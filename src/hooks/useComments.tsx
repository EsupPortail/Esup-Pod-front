"use client";

import { useCallback, useState } from "react";
import { useAuth } from "@/src/context/AuthProvider";
import { authFetch } from "@/src/api/authFetch";
import { requestJson } from "@/src/utils/requestJson";
import { getRoutes } from "@/src/api/routes";
import type { Comment, CommentRequest } from "@/src/types";

type CreateCommentPayload = Pick<CommentRequest, "content"> & {
  parent?: number | null;
  direct_parent?: number | null;
};

const normalizeComment = (comment: Comment): Comment => {
  return {
    ...comment,
    children: (comment.children ?? []).map(normalizeComment),
  };
};

const normalizeComments = (
  comments: Comment[] | undefined | null,
): Comment[] => {
  return (comments ?? []).map(normalizeComment);
};

const updateCommentTree = (
  comments: Comment[] | undefined,
  commentId: string | number,
  updater: (comment: Comment) => Comment,
): Comment[] => {
  const safeComments = normalizeComments(comments);

  return safeComments.map((comment) => {
    if (String(comment.id) === String(commentId)) {
      return normalizeComment(updater(comment));
    }

    return {
      ...comment,
      children: updateCommentTree(comment.children, commentId, updater),
    };
  });
};

const removeCommentFromTree = (
  comments: Comment[] | undefined,
  commentId: string | number,
): Comment[] => {
  const safeComments = normalizeComments(comments);

  return safeComments
    .filter((comment) => String(comment.id) !== String(commentId))
    .map((comment) => ({
      ...comment,
      children: removeCommentFromTree(comment.children, commentId),
    }));
};

const prependReplyToTree = (
  comments: Comment[] | undefined,
  parentId: string | number,
  reply: Comment,
): Comment[] => {
  const safeComments = normalizeComments(comments);
  const normalizedReply = normalizeComment(reply);

  return safeComments.map((comment) => {
    if (String(comment.id) === String(parentId)) {
      return {
        ...comment,
        children: [...normalizeComments(comment.children), normalizedReply],
      };
    }

    return {
      ...comment,
      children: prependReplyToTree(comment.children, parentId, normalizedReply),
    };
  });
};

export function useComments(videoSlug: string) {
  const { accessToken, refresh } = useAuth();

  const [comments, setComments] = useState<Comment[]>([]);
  const [votedCommentIds, setVotedCommentIds] = useState<string[]>([]);
  const [useCommentsLoading, setUseCommentsLoading] = useState(false);
  const [useCommentsError, setUseCommentsError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    setUseCommentsLoading(true);
    setUseCommentsError(null);

    try {
      const [commentsRes, votesRes] = await Promise.all([
        authFetch(getRoutes().comment.list(videoSlug), {
          accessToken,
          onRefresh: refresh,
        }),
        authFetch(getRoutes().comment.votes(videoSlug), {
          accessToken,
          onRefresh: refresh,
        }),
      ]);

      const [commentsData, votesData] = await Promise.all([
        requestJson<Comment[]>(commentsRes),
        requestJson<Array<string | number>>(votesRes),
      ]);

      setComments(normalizeComments(commentsData));
      setVotedCommentIds(votesData.map((id) => String(id)));

      return true;
    } catch (e: unknown) {
      setUseCommentsError(
        e instanceof Error
          ? e.message
          : "Erreur lors du chargement des commentaires.",
      );
      return false;
    } finally {
      setUseCommentsLoading(false);
    }
  }, [accessToken, refresh, videoSlug]);

  const addComment = useCallback(
    async ({ content, parent, direct_parent }: CreateCommentPayload) => {
      setUseCommentsError(null);

      try {
        const targetCommentId = direct_parent ?? undefined;

        const res = await authFetch(
          getRoutes().comment.add(videoSlug, targetCommentId),
          {
            accessToken,
            onRefresh: refresh,
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content,
              parent: parent ?? null,
              direct_parent: direct_parent ?? null,
            }),
          },
        );

        const createdComment = normalizeComment(
          await requestJson<Comment>(res),
        );

        if (direct_parent != null) {
          setComments((prev) =>
            prependReplyToTree(prev, direct_parent, createdComment),
          );
        } else {
          setComments((prev) => [...normalizeComments(prev), createdComment]);
        }

        return createdComment;
      } catch (e: unknown) {
        setUseCommentsError(
          e instanceof Error
            ? e.message
            : "Erreur lors de l'ajout du commentaire.",
        );
        return null;
      }
    },
    [accessToken, refresh, videoSlug],
  );

  const toggleVote = useCallback(
    async (commentId: string | number) => {
      setUseCommentsError(null);

      try {
        const res = await authFetch(
          getRoutes().comment.vote(videoSlug, commentId),
          {
            accessToken,
            onRefresh: refresh,
            method: "POST",
          },
        );

        await requestJson(res);

        const alreadyVoted = votedCommentIds.includes(String(commentId));

        setVotedCommentIds((prev) =>
          alreadyVoted
            ? prev.filter((id) => id !== String(commentId))
            : [...prev, String(commentId)],
        );

        setComments((prev) =>
          updateCommentTree(prev, commentId, (comment) => ({
            ...comment,
            children: normalizeComments(comment.children),
            nbr_vote: alreadyVoted
              ? Math.max(0, comment.nbr_vote - 1)
              : comment.nbr_vote + 1,
          })),
        );

        return true;
      } catch (e: unknown) {
        setUseCommentsError(
          e instanceof Error ? e.message : "Erreur lors du vote.",
        );
        return false;
      }
    },
    [accessToken, refresh, videoSlug, votedCommentIds],
  );

  const deleteComment = useCallback(
    async (commentId: string | number) => {
      setUseCommentsError(null);
      setUseCommentsLoading(true);

      try {
        const res = await authFetch(
          getRoutes().comment.delete(videoSlug, commentId),
          {
            accessToken,
            onRefresh: refresh,
            method: "POST",
          },
        );

        if (!res.ok) {
          throw new Error("Erreur lors de la suppression du commentaire.");
        }

        setComments((prev) => removeCommentFromTree(prev, commentId));
        setVotedCommentIds((prev) =>
          prev.filter((id) => id !== String(commentId)),
        );
        setUseCommentsLoading(false);
        return true;
      } catch (e: unknown) {
        setUseCommentsError(
          e instanceof Error
            ? e.message
            : "Erreur lors de la suppression du commentaire.",
        );
        return false;
      }
    },
    [accessToken, refresh, videoSlug],
  );

  return {
    comments,
    votedCommentIds,
    useCommentsLoading,
    useCommentsError,
    fetchComments,
    addComment,
    toggleVote,
    deleteComment,
  };
}
