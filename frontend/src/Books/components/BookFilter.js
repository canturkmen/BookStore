import { useEffect, useState } from "react";
import styles from "./BookFilter.module.css";

const BookFilter = (props) => {
  const [filterOptions, setFilterOptions] = useState([]);
  const [filterData, setFilterData] = useState({
    authors: {},
    publishers: {},
  });
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  useEffect(() => {
    const getFilterData = () => {
      const authors = {};
      const publishers = {};

      props.books.forEach((book) => {
        authors[book.author] = (authors[book.author] || 0) + 1;
        publishers[book.distributor] = (publishers[book.distributor] || 0) + 1;
      });

      setFilterData({ authors, publishers });
    };

    getFilterData();
  }, [props.books]);

  const editFilterHandler = (filterData, filterCategory) => {
    setFilterOptions((prevState) => {
      return [
        { filterCategory: filterCategory, filterData: filterData },
        ...prevState,
      ];
    });
  };

  const handlePriceRangeChange = (event, type) => {
    setPriceRange((prevRange) => ({ ...prevRange, [type]: event.target.value }));
  };

  return (
    <div className={styles.book__filter}>
      <div className={styles.book__filter_option}>
        <label>Authors</label>
        <hr></hr>
        <ul>
          {Object.entries(filterData.authors).map(([author, count]) => (
            <li key={author}>
              <input
                type="checkbox"
                onChange={() => editFilterHandler(author, "author")}
              />
              {author} ({count})
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.book__filter_option}>
        <label>Publishers</label>
        <hr></hr>
        <ul>
          {Object.entries(filterData.publishers).map(([publisher, count]) => (
            <li key={publisher}>
              <input
                type="checkbox"
                onChange={() => editFilterHandler(publisher, "publisher")}
              />
              {publisher} ({count})
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.book__filter_option}>
        <label>Price Range</label>
        <hr></hr>
        <div className={styles.book__filter_option_min}>
          <label>Min:</label>
          <input
            type="number"
            min="0"
            value={priceRange.min}
            onChange={(event) => handlePriceRangeChange(event, "min")}
          />
        </div>
        <div className={styles.book__filter_option_max}>
          <label>Max:</label>
          <input
            type="number"
            min="0"
            value={priceRange.max}
            onChange={(event) => handlePriceRangeChange(event, "max")}
          />
        </div>
      </div>
      <div className={styles.book__filter_actions}>
        <button
          onClick={() => {
            props.filterBooks(filterOptions, priceRange);
          }}
        >
          Apply Filter
        </button>
      </div>
    </div>
  );
};

export default BookFilter;
