import React from "react";
import { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const ListProducts = (props) => {

  const CardContainer = styled(motion.div)`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 20px;
    margin: 20px;
    width: 300px;
  `;

  const CardImage = styled.img`
    width: 200px;
    height: 300px;
    object-fit: cover; /* This will ensure that the image maintains its aspect ratio */
    margin-bottom: 0.5rem;
  `;

  const CardHeader = styled.h2`
    font-size: 1.5em;
    color: #333;
  `;

  const CardText = styled.p`
    font-size: 1em;
    color: #666;
    margin-bottom: 1rem;
  `;

  const Button = styled.button`
    background-color: #ff6347;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    margin: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #ff4500;
    }
  `;

  const ButtonsContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  `;

  const DeleteButton = styled(Button)`
    background-color: #ff0000;
    &:hover {
      background-color: #cc0000;
    }
  `;

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "http://localhost:5000/admin/product-manager/delete-book/" + props.id,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    
    if (response.ok) {
      props.onDelete();
    }
  };

  return (
    <CardContainer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CardHeader>{props.name}</CardHeader>
      <CardText>
        {props.author} - {props.publisher}
      </CardText>
      <CardImage src={props.image} alt="" />
      <ButtonsContainer>
        <DeleteButton onClick={handleDelete}>Delete</DeleteButton>
      </ButtonsContainer>
      <CardText>{props.description}</CardText>
    </CardContainer>
  );
};

export default ListProducts;
