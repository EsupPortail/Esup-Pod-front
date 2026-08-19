"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button, TextArea } from "@openfun/cunningham-react";
import Avatar from "@mui/material/Avatar";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useAuth } from "@/src/context/AuthProvider";
import type { Comment } from "@/src/types";
import { timeAgo } from "@/src/constants/date";
import { getProfilePictureUrl, setInitial } from "@/src/constants/user";
import { useTranslation } from "@/src/hooks/useTranslation";
import styles from "./styles.module.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

type ReplyPayload = {
  content: string;
  parent?: number | null;
  direct_parent?: number | null;
};

type CommentItemProps = {
  comment: Comment;
  votedCommentIds: string[];
  onReply: (payload: ReplyPayload) => Promise<Comment | null>;
  onVote: (commentId: string | number) => Promise<boolean>;
  onDelete: (commentId: string | number) => Promise<boolean>;
  onCreatedReply: (id: string | number) => void;
  pendingScrollToId: string | number | null;
  onScrollHandled: () => void;
};

const getAuthorDisplayName = (authorName: string) => {
  return authorName.trim();
};

const getInitialsFromAuthorName = (authorName: string) => {
  const parts = authorName.trim().split(/\s+/);
  const lastName = parts[0] ?? "";
  const firstName = parts[1] ?? "";

  return setInitial(lastName, firstName);
};

export default function CommentItem({
  comment,
  votedCommentIds,
  onReply,
  onVote,
  onDelete,
  onCreatedReply,
  pendingScrollToId,
  onScrollHandled,
}: CommentItemProps) {
  const { t, locale } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [isRepliesOpen, setIsRepliesOpen] = useState(false);
  const [isReplyFormOpen, setIsReplyFormOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const commentRef = useRef<HTMLElement | null>(null);
  const [isHighlighted, setIsHighlighted] = useState(false);

  const children = comment.children ?? [];
  const hasReplies = children.length > 0;
  const hasVoted = votedCommentIds.includes(String(comment.id));
  const canVote = isAuthenticated;
  const canDelete =
    !!user && (user.is_staff || String(user.id) === String(comment.author));

  const initials = useMemo(() => {
    const nameToUse = comment.author_name && comment.author_name.trim() 
      ? comment.author_name 
      : comment.author_username;
    return getInitialsFromAuthorName(nameToUse || "");
  }, [comment.author_name, comment.author_username]);

  const profilePictureUrl = getProfilePictureUrl(comment.author_picture);

  const handleReply = async () => {
    if (!replyContent.trim() || isSubmittingReply) {
      return;
    }

    setIsSubmittingReply(true);

    const created = await onReply({
      content: replyContent.trim(),
      parent: comment.parent ?? Number(comment.id),
      direct_parent: Number(comment.id),
    });

    if (created) {
      setReplyContent("");
      setIsReplyFormOpen(false);
      setIsRepliesOpen(true);
      onCreatedReply(created.id);
    }

    setIsSubmittingReply(false);
  };

  useEffect(() => {
    if (pendingScrollToId == null) {
      return;
    }

    if (String(pendingScrollToId) !== String(comment.id)) {
      return;
    }

    if (!commentRef.current) {
      return;
    }

    commentRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    onScrollHandled();
    setIsHighlighted(true);
  }, [comment.id, onScrollHandled, pendingScrollToId]);

  useEffect(() => {
    if (!isHighlighted) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsHighlighted(false);
    }, 2000);

    return () => window.clearTimeout(timeout);
  }, [isHighlighted]);

  return (
    <article
      ref={commentRef}
      className={`${styles.comment} ${isHighlighted ? styles.commentHighlight : ""}`}
      id={`comment-${comment.id}`}
    >
      <div className={styles.header}>
        <Avatar src={profilePictureUrl}>{initials}</Avatar>

        <div className={styles.body}>
          <div className={styles.meta}>
            <strong>
              {comment.author_name && comment.author_name.trim()
                ? getAuthorDisplayName(comment.author_name)
                : comment.author_username}
            </strong>
            <span>{timeAgo(comment.added, locale)}</span>
          </div>

          <p className={styles.content}>{comment.content}</p>

          <div className={styles.actions}>
            {canVote ? (
              <Button
                type="button"
                size="small"
                className={styles.actionButton}
                onClick={() => onVote(comment.id)}
                aria-label="Voter pour ce commentaire"
              >
                <ThumbUpOffAltIcon fontSize="small" />
                <span>{comment.nbr_vote}</span>
              </Button>
            ) : (
              <div className={styles.actionButtonStatic}>
                <ThumbUpOffAltIcon fontSize="small" />
                <span>{comment.nbr_vote}</span>
              </div>
            )}

            {isAuthenticated && (
              <Button
                type="button"
                size="small"
                className={styles.actionButton}
                onClick={() => setIsReplyFormOpen((prev) => !prev)}
              >
                {t("comments.reply")}
              </Button>
            )}

            {canDelete && (
              <Button
                type="button"
                size="small"
                color="error"
                variant="tertiary"
                onClick={() => onDelete(comment.id)}
              >
                <DeleteOutlineIcon fontSize="small" />
                {t("comments.delete")}
              </Button>
            )}
          </div>

          {hasVoted && canVote && (
            <span className={styles.voted}>{t("comments.liked")}</span>
          )}

          {isReplyFormOpen && (
            <div className={styles.replyForm}>
              <TextArea
                label={t("comments.yourReply")}
                rows={3}
                value={replyContent}
                onChange={(event) => setReplyContent(event.target.value)}
              />
              <div className={styles.replyActions}>
                <Button
                  color="brand"
                  size="small"
                  variant="primary"
                  type="button"
                  onClick={handleReply}
                  disabled={!replyContent.trim() || isSubmittingReply}
                >
                  {isSubmittingReply ? t("comments.submitting") : t("comments.reply")}
                </Button>
              </div>
            </div>
          )}

          {hasReplies && (
            <Button
              type="button"
              size="small"
              className={styles.repliesToggle}
              onClick={() => setIsRepliesOpen((prev) => !prev)}
            >
              {isRepliesOpen
                ? t("comments.hideReplies")
                : children.length === 1
                ? t("comments.showReplies", { count: children.length })
                : t("comments.showRepliesPlural", { count: children.length })}
              {isRepliesOpen ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </Button>
          )}

          {isRepliesOpen && hasReplies && (
            <div className={styles.replies}>
              {children.map((child) => (
                <CommentItem
                  key={child.id}
                  comment={child}
                  votedCommentIds={votedCommentIds}
                  onReply={onReply}
                  onVote={onVote}
                  onDelete={onDelete}
                  onCreatedReply={onCreatedReply}
                  pendingScrollToId={pendingScrollToId}
                  onScrollHandled={onScrollHandled}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
