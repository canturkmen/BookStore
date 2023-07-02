import styles from "./CheckoutList.module.css";
import WishlistItem from "./CheckoutItem";

const CheckoutList = (props) => {
  return (
    <ul className={styles.checkout__list}>
      {props.books.map((book) => {
        console.log(book);
        return (
          <WishlistItem
            key={book.id}
            number={book.number}
            id={book.id}
            title={book.title}
            imageUrl={book.imageUrl}
            price={book.price}
            rating={book.rating}
            author={book.author}
            publisher={book.publisher}
            discount={book.discount}
            amount={book.amount}
          />
        );
      })}
    </ul>
  );
};

export default CheckoutList;
