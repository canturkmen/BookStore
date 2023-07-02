import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ViewList from "@mui/icons-material/ViewList";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import styles from "./MainHeader.module.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../../contexts/cart-context";
import { UserContext } from "../../contexts/user-context";
import { WishlistContext } from "../../contexts/wishlist-context";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";

const MainHeader = (props) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [searchedData, setSearchedData] = useState("");
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUser = () => {
    navigate("/user");
    setAnchorEl(null);
  };

  const handleCloseOrders = () => {
    navigate("/orders");
    setAnchorEl(null);
  };

  const userCtx = useContext(UserContext);
  const { cartItemCount, updateCartItemCount } = useContext(CartContext);
  const { wishlistItemCount, updateWishlistItemCount } =
    useContext(WishlistContext);

  useEffect(() => {
    const fetchCartItemCount = async () => {
      if (userCtx.isLoggedIn) {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/shop/cart/item-count",
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = await response.json();
        updateCartItemCount(data.cartItemCount);
      }
    };

    const fetchLocalCartItemCount = () => {
      const storedGuestCart = localStorage.getItem("guestCart");
      if (storedGuestCart) {
        const guestCart = JSON.parse(storedGuestCart);
        let localCartItemCount = 0;

        for (const item of guestCart.items) {
          localCartItemCount += item.quantity;
        }

        updateCartItemCount(localCartItemCount);
      }
    };

    if (userCtx.isLoggedIn) {
      fetchCartItemCount();
    } else {
      fetchLocalCartItemCount();
    }
  }, [userCtx.isLoggedIn]);

  useEffect(() => {
    const fetchWishlistItemCount = async () => {
      if (userCtx.isLoggedIn) {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/shop/wishlist/item-count",
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = await response.json();
        updateWishlistItemCount(data.wishlistItemCount);
      }
    };

    fetchWishlistItemCount();
  }, [userCtx.isLoggedIn]);

  const submitHandler = async (event) => {
    navigate(`/searchpage?option=${selectedOption}&data=${searchedData}`);
  };

  return (
    <div className={styles.header}>
      <Link to="/">Book Store</Link>
      <div className={styles.header__option_buttons}>
        <select
          className={styles.header__options_select}
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="" disabled>
            Select an option
          </option>
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="description">Description</option>
        </select>
      </div>

      <div className={styles.header__search}>
        <input
          type="text"
          className={styles.header__searchInput}
          placeholder="Search by Title, Author or Description"
          onChange={(event) => {
            setSearchedData(event.target.value);
          }}
          onKeyDown={(e) => e.key === "Enter" && submitHandler()}
        />
        <button className={styles.header__searchIcon}>
          <SearchIcon onClick={submitHandler} />
        </button>
      </div>
      <div className={styles.header__nav}>
        {userCtx.isLoggedIn ? (
          userCtx.user.role === "customer" ? (
            <div className={styles.header__optionfirst}>
              <span className={styles.header__optionLineOneFirst}>
                Hello, {userCtx.user.username}
              </span>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="black"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={() => {
                  setAnchorEl(null);
                }}
              >
                <MenuItem onClick={handleCloseUser}>User Details</MenuItem>
                <MenuItem onClick={handleCloseOrders}>Orders</MenuItem>
                <MenuItem
                  onClick={() => {
                    userCtx.logout();
                    setAnchorEl(null);
                  }}
                >
                  Log Out
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <Link to="/admin/product-signin">
              <div
                className={styles.header__option}
                onClick={() => {
                  userCtx.logout();
                }}
              >
                <React.Fragment>
                  <span className={styles.header__optionLineOne}>
                    Hello, {userCtx.user.username}
                  </span>
                  <span className={styles.header__optionLineTwo}>Log Out</span>
                </React.Fragment>
              </div>
            </Link>
          )
        ) : (
          <Link to="/auth/signin">
            <div className={styles.header__option}>
              <React.Fragment>
                <span className={styles.header__optionLineOne}>
                  Hello, Guest
                </span>
                <span className={styles.header__optionLineTwo}>Sign In</span>
              </React.Fragment>
            </div>
          </Link>
        )}
        {userCtx.isLoggedIn && userCtx.user.role === "productManager" ? (
          <Link to="/customer/signin">
            <div className={styles.header__option}>
              <React.Fragment>
                <span className={styles.header__optionLineOne}>Sign In</span>
                <span className={styles.header__optionLineTwo}>
                  As Customer
                </span>
              </React.Fragment>
            </div>
          </Link>
        ) : (
          <Link to="/admin/product-signin">
            <div className={styles.header__option}>
              <React.Fragment>
                <span className={styles.header__optionLineOne}>Sign In</span>
                <span className={styles.header__optionLineTwo}>As Admin</span>
              </React.Fragment>
            </div>
          </Link>
        )}
        {(userCtx.user.role !== "salesManager" ||
          userCtx.user.role !== "productManager") && (
          <Link to="/wishlist">
            <div className={styles.header__optionCart}>
              <FavoriteIcon />
              <span
                className={`${styles.header__optionLineTwo} ${styles.header__cartItemCount}`}
              >
                {wishlistItemCount}
              </span>
            </div>
          </Link>
        )}
        <Link to="/checkout">
          <div className={styles.header__optionCart}>
            <ShoppingBasketIcon />
            <span
              className={`${styles.header__optionLineTwo} ${styles.header__cartItemCount}`}
            >
              {cartItemCount}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default MainHeader;
