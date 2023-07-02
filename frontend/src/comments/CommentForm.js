import { useState } from "react";
import styles from "./CommentForm.module.css";
import StarRating from "./StarRating";

const CommentForm = ({
  handleSubmit,
  submitLabel,
  otherLabel,
  hasCancelButton = false,
  handleCancel,
  initialText = "",
  initialRating = 0,
}) => {
  const [comment, setComment] = useState(initialText);
  const [rating, setRating] = useState(initialRating);
  const isTextareaDisabled = comment.length === 0;

  const onSubmit = (event) => {
    event.preventDefault();
    const enteredData = {
      comment: comment,
      rating: rating,
    };
    handleSubmit(enteredData);
    setComment("");
    setRating(0);
  };

  const handleRatingChange = (value) => {
    setRating(value);
  };

  return (
    <form onSubmit={onSubmit}>
      <div className={styles.comment__form_control}>
        <textarea
          className={styles.comment_form__textarea}
          value={comment}
          placeholder="Write Comment"
          onChange={(e) => setComment(e.target.value)}
        />
        <div className={styles.comment__rating}>
          <p>Give a rating</p>
          <StarRating rating={rating} onRatingChange={handleRatingChange}/>
        </div>
      </div>
      <button
        className={styles.comment_form__button}
      >
        {submitLabel}
      </button>
      {hasCancelButton && (
        <button
          type="button"
          className="comment-form-button comment-form-cancel-button"
          onClick={handleCancel}
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default CommentForm;
