import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import styles from "./BookPage.module.css";
import { useEffect, useState } from "react";
import BookFilter from "../../Books/components/BookFilter";
import BookItem from "../../Books/components/BookItem";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "./BookPageTransitions.css";

const BookPage = (props) => {
  const [books, setBooks] = useState([]);
  const [filterOptions, setFilterOptions] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const params = useParams();
  const search = params.search;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const queryParams = new URLSearchParams();

      queryParams.append("search", search);
      queryParams.append("sorting", sortOption);

      if (search === "newly-added-books") {
        queryParams.append("newlyAdded", true);
      }

      filterOptions.forEach((option) => {
        queryParams.append(option.filterCategory, option.filterData);
      });

      const response = await fetch(
        `http://localhost:5000/shop/filter-all?${queryParams.toString()}`
      );
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

    fetchData();
  }, [search, filterOptions, sortOption]);

  if (isLoading) {
    return (
      <section>
        <p>Loading...</p>
      </section>
    );
  }

  const filterBooksHandler = (newFilterOptions, priceRange) => {
    const updatedFilterOptions = [...newFilterOptions];

    if (priceRange.min) {
      updatedFilterOptions.push({
        filterCategory: "minPrice",
        filterData: priceRange.min,
      });
    }

    if (priceRange.max) {
      updatedFilterOptions.push({
        filterCategory: "maxPrice",
        filterData: priceRange.max,
      });
    }

    setFilterOptions(updatedFilterOptions);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setSortOption(event.target.value);
  };

  return (
    <div className={styles.home}>
      <div className={styles.home__container}>
        <BookFilter books={books} filterBooks={filterBooksHandler} />
        <div className={styles.home__row}>
          <div className={styles.home__row_info}>
            <p>
              <strong>{books.length}</strong> Books were found
            </p>
            <label htmlFor="sort">
              <select
                name="sort"
                id="sort"
                className={styles.dropDown}
                onChange={submitHandler}
                value={sortOption}
              >
                <option value=""></option>
                <option value="ascending">Price (Lowest)</option>
                <option value="descending">Price (Highest)</option>
                <option value="popularity">Popularity</option>
              </select>
            </label>
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

export default BookPage;
