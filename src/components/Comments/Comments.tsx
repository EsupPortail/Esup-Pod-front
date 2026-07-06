"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Loader,
  TextArea,
  VariantType,
} from "@openfun/cunningham-react";
import Avatar from "@mui/material/Avatar";
import { useAuth } from "@/src/context/AuthProvider";
import { getProfilePictureUrl, setInitial } from "@/src/constants/user";
import { useComments } from "@/src/hooks/useComments";
import CommentItem from "./commentItem";
import styles from "./styles.module.css";

type CommentsProps = {
  videoSlug: string;
};

export default function Comments({ videoSlug }: CommentsProps) {
  const { user, accessToken } = useAuth();
  const {
    comments,
    votedCommentIds,
    useCommentsLoading,
    useCommentsError,
    fetchComments,
    addComment,
    toggleVote,
    deleteComment,
  } = useComments(videoSlug);

  const [content, setContent] = useState("");
  const profilePictureUrl = getProfilePictureUrl(user?.userpicture);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingScrollToId, setPendingScrollToId] = useState<
    string | number | null
  >(null);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const commentCountLabel = useMemo(() => {
    return `${comments.length} commentaire${comments.length > 1 ? "s" : ""}`;
  }, [comments.length]);

  const initials = user ? setInitial(user.last_name, user.first_name) : "";

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    const created = await addComment({
      content: content.trim(),
      parent: null,
      direct_parent: null,
    });

    if (created) {
      setContent("");
      setPendingScrollToId(created.id);
    }

    setIsSubmitting(false);
  };

  return (
    <section className={styles.comments}>
      <h2 className={styles.title}>Commentaires</h2>
      <p className={styles.count}>{commentCountLabel}</p>

      {useCommentsError && (
        <Alert canClose type={VariantType.ERROR}>
          {useCommentsError}
        </Alert>
      )}

      {accessToken && user ? (
        <div className={styles.form}>
          <Avatar src={profilePictureUrl}>{initials}</Avatar>

          <div className={styles.formContent}>
            <TextArea
              label="Ajouter un commentaire"
              fullWidth
              rows={4}
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />

            <div className={styles.formActions}>
              <Button
                color="brand"
                variant="secondary"
                size="small"
                type="button"
                onClick={handleSubmit}
                disabled={!content.trim() || isSubmitting}
              >
                {isSubmitting ? "Publication..." : "Commenter"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Alert type={VariantType.INFO}>
          Connectez-vous pour ajouter un commentaire.
        </Alert>
      )}

      {useCommentsLoading ? (
        <div className={styles.loader}>
          <Loader />
        </div>
      ) : comments.length > 0 ? (
        <div className={styles.list}>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              votedCommentIds={votedCommentIds}
              onReply={addComment}
              onVote={toggleVote}
              onDelete={deleteComment}
              onCreatedReply={setPendingScrollToId}
              pendingScrollToId={pendingScrollToId}
              onScrollHandled={() => setPendingScrollToId(null)}
            />
          ))}
        </div>
      ) : (
        <Alert>Aucun commentaire pour le moment.</Alert>
      )}
    </section>
  );
}
