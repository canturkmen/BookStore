import React from "react";
import "./AdminComments.css";
import StarIcon from "@mui/icons-material/Star";

const AdminCommentWidget = ({ reviews, onAcceptComment }) => {
  const acceptCommentHandler = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/admin/product-manager/comments/${commentId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to accept comment");
      }

      onAcceptComment(commentId);
    } catch (err) {
      console.log("Error accepting comment:", err);
    }
  };

  const rejectCommentHandler = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/admin/product-manager/comments/reject/${commentId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to accept comment");
      }

      onAcceptComment(commentId);
    } catch (err) {
      console.log("Error accepting comment:", err);
    }
  };

  return (
    <table className="comment-table">
      <thead>
        <tr>
          <th>User</th>
          <th>Book Title</th>
          <th>Comment</th>
          <th>Rating</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {reviews.map((review) => (
          <tr key={review._id}>
            <td>{review.user.username}</td>
            <td>{review.book.title}</td>
            <td>{review.comment}</td>
            <td>
              {[...Array(review.rating)].map((_, i) => (
                <StarIcon key={i} />
              ))}
            </td>
            <td>
              <button
                onClick={() => acceptCommentHandler(review._id)}
                className="accept-comment-btn"
              >
                Accept Comment
              </button>
              <button
                onClick={() => rejectCommentHandler(review._id)}
                className="accept-comment-btn"
              >
                Reject Comment
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminCommentWidget;
