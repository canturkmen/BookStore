import styles from "./Card.module.css";

const Card = (props) => {
  return (
    <div className={`${styles.card} ${props.className}`} style={props.stlye}>
      {props.children}
    </div>
  );
};

export default Card;
