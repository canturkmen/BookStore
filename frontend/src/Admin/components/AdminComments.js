import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";
import NavBar from "./NavBar";
import "./AdminComments.css";
import AdminCommentWidget from "./AdminCommentWidget";

const AdminComments = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/admin/product-manager/comments",
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = await response.json();
        setReviews(data.reviews);
      } catch (err) {
        console.log("Error fetching comments:", err);
      }
    };

    fetchComments();
  }, []);

  const handleAcceptComment = (commentId) => {
   const updatedReviews = reviews.filter((review) => review._id.toString() !== commentId.toString());
   setReviews(updatedReviews);
  };

  return (
    <div className="list">
      <SideBar />
      <div className="list-container">
        <NavBar />
        <AdminCommentWidget reviews={reviews} onAcceptComment={handleAcceptComment}/>
      </div>
    </div>
  );
};

export default AdminComments;
