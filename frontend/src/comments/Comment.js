import CommentForm from "./CommentForm";

const Comment = (props) => {
  // const isEditing =
  //   activeComment &&
  //   activeComment.id === comment.id &&
  //   activeComment.type === "editing";
  // const isReplying =
  //   activeComment &&
  //   activeComment.id === comment.id &&
  //   activeComment.type === "replying";
  // const fiveMinutes = 300000;
  // const timePassed = new Date() - new Date(comment.createdAt) > fiveMinutes;
  // const canDelete =
  //   currentUserId === comment.userId && replies.length === 0 && !timePassed;
  // const canReply = Boolean(currentUserId);
  // const canEdit = currentUserId === comment.userId && !timePassed;
  // const replyId = parentId ? parentId : comment.id;
  return (
    <div className="comment">
      <div className="comment-right-part">
        <div className="comment-content">
          <div className="comment-author">{props.username}</div>
        </div>
        <div className="comment-text">{props.comment}</div>
        <div className="comment-text">{props.rating}</div>
        {/* {!isEditing && <div className="comment-text">{comment.body}</div>}
        {isEditing && (
          <CommentForm
            submitLabel="Update"
            hasCancelButton
            initialText={comment.body}
            handleSubmit={(text) => updateComment(text, comment.id)}
            handleCancel={() => {
              setActiveComment(null);
            }}
          />
        )}
        <div className="comment-actions">
          {canReply && (
            <div
              className="comment-action"
              onClick={() =>
                setActiveComment({ id: comment.id, type: "replying" })
              }
            >
              Reply
            </div>
          )}
          {canEdit && (
            <div
              className="comment-action"
              onClick={() =>
                setActiveComment({ id: comment.id, type: "editing" })
              }
            >
              Edit
            </div>
          )}
          {canDelete && (
            <div
              className="comment-action"
              onClick={() => deleteComment(comment.id)}
            >
              Delete
            </div>
          )} */}
        </div>
        {/* {isReplying && (
          <CommentForm
            submitLabel="Reply"
            handleSubmit={(text) => addComment(text, replyId)}
          />
        )}
        {replies.length > 0 && (
          <div className="replies">
            {replies.map((reply) => (
              <Comment
                comment={reply}
                key={reply.id}
                setActiveComment={setActiveComment}
                activeComment={activeComment}
                updateComment={updateComment}
                deleteComment={deleteComment}
                addComment={addComment}
                parentId={comment.id}
                replies={[]}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )} */}
      {/* </div> */}
    </div>
  );
};

export default Comment;
