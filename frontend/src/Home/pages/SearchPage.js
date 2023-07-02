import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import styles from "./BookPage.module.css";
import BookList from "../../Books/components/BookList";
import "./BookPageTransitions.css";
import BookFilter from "../../Books/components/BookFilter";
import BookItem from "../../Books/components/BookItem";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const SearchPage = (props) => {
  const [books, setBooks] = useState([]);
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getBooks = async () => {
      setIsLoading(true);
      const enteredData = {
        data: searchParams.get("data"),
        option: searchParams.get("option"),
      };

      console.log(enteredData);
      const response = await fetch("http://localhost:5000/shop/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enteredData),
      });

      const data = await response.json();
      const loadedBooks = [];
      for (const key in data.books) {
        loadedBooks.push({
          id: key,
          ...data.books[key],
        });
      }

      setIsLoading(false);
      setBooks(loadedBooks);
    };

    getBooks();
  }, [searchParams]);

  const filterBooksHandler = (event) => {
    for (const filterIndex in event) {
      const category = event[filterIndex].filterCategory;
      const value = event[filterIndex].filterData;
      const filteredBooks = books.filter((book) => book[category] === value);
      setBooks(filteredBooks);
    }
  };

  return (
    <div className={styles.home}>
      {console.log(books)}
      <div className={styles.home__container}>
        <BookFilter books={books} filterBooks={filterBooksHandler} />
        <div className={styles.home__row}>
          <div className={styles.home__row_info}>
            <p>
              <strong>{books.length}</strong> Books were found
            </p>
          </div>
          <TransitionGroup className={styles.book_grid}>
            {books.map((book) => (
              <CSSTransition key={book._id} timeout={500} classNames="book">
                <div key={book._id} className={styles.book_item}>
                  <BookItem
                    id={book._id}
                    title={book.title}
                    price={book.price}
                    rating={book.rating}
                    imageUrl={book.imageUrl}
                    author={book.author}
                    distributor={book.distributor}
                    number={book.number}
                    sold={book.sold}
                  />
                </div>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </div>
      </div>
    </div>

  );
};

export default SearchPage;
