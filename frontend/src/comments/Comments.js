import { useState, useEffect } from "react";
import "./Comments.css";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import {
  getComments as getCommentsApi,
  createComment as createCommentApi,
  updateComment as updateCommentApi,
  deleteComment as deleteCommentApi,
} from "../api";
import StarRating from "./StarRating";

const Comments = ({ bookId, commentsUrl, currentUserId }) => {
  const [reviews, setReviews] = useState([]);

  // const [activeComment, setActiveComment] = useState(null);

  // const rootComments = backendComments.filter(
  //   (backendComment) => backendComment.parentId === null
  // );

  // const getReplies = (commentId) =>
  //   backendComments
  //     .filter((backendComment) => backendComment.parentId === commentId)
  //     .sort(
  //       (a, b) =>
  //         new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  //     );

  const addComment = async (enteredData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "http://localhost:5000/shop/book/comments/add-comment/" + bookId,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(enteredData),
      }
    );

    const data = await response.json();
    if (data.isHere) {
      console.log(data.review);
      setReviews((prevState) => {
        return [...prevState, data.review];
      });
    }
  };

  // const updateComment = (text, commentId) => {
  //   updateCommentApi(text).then(() => {
  //     const updatedBackendComments = backendComments.map((backendComment) => {
  //       if (backendComment.id === commentId) {
  //         return { ...backendComment, body: text };
  //       }
  //       return backendComment;
  //     });
  //     setBackendComments(updatedBackendComments);
  //     setActiveComment(null);
  //   });
  // };

  // const deleteComment = (commentId) => {
  //   if (window.confirm("Are you sure you want to remove comment?")) {
  //     deleteCommentApi().then(() => {
  //       const updatedBackendComments = backendComments.filter(
  //         (backendComment) => backendComment.id !== commentId
  //       );
  //       setBackendComments(updatedBackendComments);
  //     });
  //   }
  // };

  useEffect(() => {
    const getComments = async () => {
      const response = await fetch(
        "http://localhost:5000/shop/book/comments/" + bookId
      );
      const data = await response.json();
      setReviews(data.reviews);
    };

    getComments();
  }, []);

  if (reviews.length === 0) {
    return (
      <div className="comments">
        <h3 className="comment__form_title">{`Comments (${reviews.length})`}</h3>
        {<CommentForm submitLabel="Write" handleSubmit={addComment} />}
      </div>
    );
  }

  return (
    <div className="comments">
      <h3 className="comment__form_title">{`Comments (${reviews.length})`}</h3>
      {<CommentForm submitLabel="Write" handleSubmit={addComment} />}
      <div className="comment-section">
        <h2>Comments</h2>
        {reviews.map((review, index) => (
          <div className="comment" key={index}>
            <div className="user-info">
              <span className="username">
                {review.user.username && review.user.username}
              </span>
              {review.rating > 0 && (
                <StarRating
                  onRatingChange={() => {}}
                  rating={review.rating && review.rating}
                />
              )}
            </div>
            <p className="comment-text">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
