import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import SideBar from "./SideBar";
import "./AdminProducts.css";

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #f8f9fa;
  border-radius: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin-top: 20px;
  border: none;
  background: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 5px;
`;

const AddBookForm = () => {
  const [category, setCategory] = useState("existing");
  const [book, setBook] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("new");

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleChange = (e) => {
   console.log("Here");
    setBook({
      ...book,
      [e.target.name]: e.target.value,
    });
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    console.log(book);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/admin/product-manager/add-book",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(book),
        }
      );

      if (!response.ok) throw new Error("Error in response!");

      const data = await response.json();
      console.log(data);

      setBook({});
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/admin/product-manager/get-category-names", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="list">
      <SideBar />
      <div className="list-container">
        <Container
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Add Book</h2>
          <form onSubmit={formSubmitHandler}>
            <Input
              type="text"
              name="title"
              placeholder="Title"
              onChange={handleChange}
            />
            <TextArea
              name="description"
              placeholder="Description"
              onChange={handleChange}
            />
            <Input
              type="text"
              name="author"
              placeholder="Author"
              onChange={handleChange}
            />
            <Input
              type="text"
              name="distributor"
              placeholder="Publisher"
              onChange={handleChange}
            />
            <Input
              type="number"
              name="stock"
              placeholder="Amount In Stock"
              onChange={handleChange}
            />
            <Input
              type="text"
              name="warranty"
              placeholder="Warranty"
              onChange={handleChange}
            />
            <Input
              type="text"
              name="language"
              placeholder="Language"
              onChange={handleChange}
            />
            <Input
              type="number"
              name="price"
              step="0.01"
              placeholder="Initial Price"
              onChange={handleChange}
            />
            <Input
              type="number"
              name="page_number"
              placeholder="Page Number"
              onChange={handleChange}
            />
            <Input
              type="number"
              name="rating"
              placeholder="Rating"
              onChange={handleChange}
            />
            <Input
              type="number"
              name="publication_year"
              placeholder="Publication Year"
              onChange={handleChange}
            />
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="existing">Select from existing categories</option>
              <option value="new">Add new category</option>
            </Select>
            {selectedCategory === "existing" ? (
              <Select name="category" onChange={handleChange}>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </Select>
            ) : (
              <Input
                type="text"
                name="category"
                onChange={handleChange}
                placeholder="New Category"
              />
            )}
            <Input
              type="text"
              name="imageUrl"
              placeholder="Image URL"
              onChange={handleChange}
            />
            <Button>Add Book</Button>
          </form>
        </Container>
      </div>
    </div>
  );
};

export default AddBookForm;
