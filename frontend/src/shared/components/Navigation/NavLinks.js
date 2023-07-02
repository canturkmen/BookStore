import { NavLink } from "react-router-dom";
import styles from "./NavLinks.module.css";

const NavLinks = (props) => {
   return (
    <ul className={styles.links}>
      <li>
         <NavLink to="/">Store</NavLink>
      </li>
      <li>
         <NavLink to="/auth/signin">Login</NavLink>
      </li>
      <li>
         <NavLink to="/auth/signup">Sign-Up</NavLink>
      </li>
      <li>
         <NavLink to="/auth/signup">Logout</NavLink>
      </li>
    </ul>
   ) 
}; 

export default NavLinks;