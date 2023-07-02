  import BookItem from "./BookItem";
  import styles from "./BookList.module.css";
  import Slider from "react-slick";
  import "slick-carousel/slick/slick.css";
  import "slick-carousel/slick/slick-theme.css";

  import Card from "../../shared/components/UIComponents/Card";

  const BookList = (props) => {
    if (props.books.length === 0)
      return (
        <Card className={styles.error_text}>
          <p>No Books are in store yet! Visit later.</p>
        </Card>
      );

    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 1,
    };

    return (
      <div className="book-carousel">
        <Slider {...settings}>
          {props.books.map((book) => {
            return (
              <BookItem
                key={book._id}
                id={book._id}
                title={book.title}
                price={book.price}
                rating={book.rating}
                imageUrl={book.imageUrl}
                author={book.author}
                distributor={book.distributor}
                number={book.number}
                sold={book.sold}
                discount={book.discount}
                originalPrice={book.originalPrice}
              />
            );
          })}
        </Slider>
      </div>
    );
  };

  export default BookList;
