import styles from "./HomePage.module.css";
import BookList from "../../Books/components/BookList";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // import carousel stylesimport
import React from 'react';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import dummyBooks from "../../Admin/components/AdminStockDummyBooks";
import AdminStockBooks from "../../Admin/components/AdminStockBooks";

const HomePage = (props) => {
  const [books, setBooks] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newlyAddedBooks, setNewlyAddedBooks] = useState([]);
  const [topRatedBooks, setTopRatedBooks] = useState([]);
  const [bestSellerBooks, setBestSellerBooks] = useState([]);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/shop");
      const data = await response.json();
      const loadedBooks = [];
      for (const key in data.books) {
        loadedBooks.push({
          ...data.books[key],
        });
      }

      setIsLoading(false);
      setBooks(loadedBooks);
    };

    getData();
  }, []);

  useEffect(() => {
    const getCategoryCounts = async () => {
      const response = await fetch(
        "http://localhost:5000/shop/category-counts"
      );
      const data = await response.json();
      setCategoryCounts(data.categoryCounts);
    };

    getCategoryCounts();
  }, []);

  useEffect(() => {
    const fetchNewlyAddedBooks = async () => {
      const response = await fetch(
        "http://localhost:5000/shop/newly-added-books"
      );
      const data = await response.json();
      setNewlyAddedBooks(data.newlyAddedBooks);
    };

    fetchNewlyAddedBooks();
  }, []);

  useEffect(() => {
    const fetchTopRatedBooks = async () => {
      const response = await fetch(
        "http://localhost:5000/shop/top-rated-books"
      );
      const data = await response.json();
      setTopRatedBooks(data.topRatedBooks);
    };

    fetchTopRatedBooks();
  }, []);

  useEffect(() => {
    const fetchBestSellingBooks = async () => {
      const response = await fetch(
        "http://localhost:5000/shop/best-seller-books"
      );
      const data = await response.json();
      setBestSellerBooks(data.bestSellers);
    };

    fetchBestSellingBooks();
  }, []);

  return (
    <div className={styles.home}>
      <div className={styles.home__container}>
        <section className={styles.home__first_section}>
          <div className={styles.home__categories}>
            <h1>Categories</h1>
            {categoryCounts.map((category) => (
              <div key={category.name}>
                <Link to={`/categories/${category.name.toLowerCase()}`}>
                  {category.name}
                </Link>
                <p>{category.count}</p>
              </div>
            ))}
          </div>
            {/* <Carousel autoPlay interval={1500} showThumbs={false} infiniteLoop={true}>
              {dummyBooks.map((book) => (
                <div key={book.id} style={{position: 'relative'}}>
                  <img src={book.image} alt={book.name} style={{width: '100%', height: 'auto'}}/>
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    width: '100%',
                    padding: '20px'
                  }}>
                  </div>
                </div>
              ))}
            </Carousel> */}
              <Carousel autoPlay interval={1500} showThumbs={false} infiniteLoop={true}>
              {dummyBooks.map((book) => (
                <div key={book.id} style={{position: 'relative'}}>
                  <img 
                    src={book.image} 
                    alt={book.name} 
                    style={{width: '100%', height: '400px', width: '400px'}}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    width: '100%',
                    padding: '20px'
                  }}>
                    <h4>{book.name}</h4>
                    <p>{book.author}</p>
                  </div>
                </div>
              ))}
              </Carousel>

        </section>
        <div className={styles.home__newly_added_books}>
          <div className={styles.home__newly_added_books_information}>
            <h2>Newly Added Books</h2>
            <Link to="/all-book/newly-added-books">Show All Books</Link>
          </div>
          <div className={styles.home__newly_added_books_container}>
            <BookList books={newlyAddedBooks} />
          </div>
        </div>
        <div className={styles.home__newly_added_books}>
          <h2>Top Rated Books</h2>
          <div className={styles.home__newly_added_books_container}>
            <BookList books={topRatedBooks} />
          </div>
        </div>
        <div className={styles.home__newly_added_books}>
          <h2>Best Seller Books</h2>
          <div className={styles.home__newly_added_books_container}>
            <BookList books={bestSellerBooks} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
