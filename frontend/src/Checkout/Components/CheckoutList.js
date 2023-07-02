import styles from "./CheckoutList.module.css";
import CheckoutItem from "./CheckoutItem";

const CheckoutList = (props) => {
  return (
    <ul className={styles.checkout__list}>
      {props.books.map((book) => {
        console.log(book);
        return (
          <CheckoutItem
            key={book.id}
            id={book.id}
            title={book.title}
            imageUrl={book.imageUrl}
            price={book.price}
            rating={book.rating}
            author={book.author}
            publisher={book.publisher}
            amount={book.amount}
            number={book.number}
          />
        );
      })}
    </ul>
  );
};

export default CheckoutList;
