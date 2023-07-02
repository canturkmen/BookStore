import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

import { CartProvider } from "./shared/contexts/cart-context";

import MainNavigation from "./shared/components/Navigation/MainNavigation";
import HomePage from "./Home/pages/HomePage";
import BookPage from "./Home/pages/BookPage";
import Checkout from "./Checkout/Pages/Checkout";
import Wishlist from "./Wishlist/Pages/Wishlist";

import Comments from "./comments/Comments";
import SearchPage from "./Home/pages/SearchPage";
import SignInPage from "./Users/pages/SignIn";
import SignUpPage from "./Users/pages/Signup";
import BookDetailPage from "./Home/pages/BookDetail";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "./shared/contexts/user-context";
import AdminHome from "./Admin/components/AdminHome";
import List from "./Admin/components/List";
import AdminComments from "./Admin/components/AdminComments";
import AdminSignInPage from "./Admin/pages/AdminSignIn";
import AdminSignUpPage from "./Admin/pages/AdminSignup";
import Invoice from "./Checkout/Pages/Invoice";
import { WishlistProvider } from "./shared/contexts/wishlist-context";
import ViewProducts from "./Admin/components/ViewProducts";
import AllBooksPage from "./Home/pages/AllBooks";
import AdminOrders from "./Admin/components/AdminOrders";
import AdminInvoices from "./Admin/components/AdminInvoices";
import Orders from "./Orders/Pages/AdminOrders";
import AdminStock from "./Admin/components/AdminStock";
import AdminProducts from "./Admin/components/AdminProducts";
import AdminRevenues from "./Admin/components/AdminRevenues";
import ViewInvoices from "./Admin/components/ViewInvoices";
import AdminRefunds from "./Admin/components/AdminRefunds";
import AdminUsers from "./Admin/components/AdminUsers";
import UserProfile from "./Users/pages/UserPage";

const unloggedRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation title="BookStore" />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "book/:bookId", element: <BookDetailPage /> },
      { path: "categories/:categoryId", element: <BookPage /> },
      {
        path: "auth",
        children: [
          {
            path: "signin",
            element: <SignInPage />,
          },
          {
            path: "signup",
            element: <SignUpPage />,
          },
        ],
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "comments",
        element: <Comments />,
      },
      {
        path: "searchpage",
        element: <SearchPage />,
      },
      {
        path: "all-book/:search",
        element: <AllBooksPage />
      },
      {
        path: "admin/product-signin",
        element: <AdminSignInPage role="product" />,
      },
      {
        path: "admin/product-signup",
        element: <AdminSignUpPage role="product" />,
      },
      {
        path: "admin/sales-signup",
        element: <AdminSignUpPage role="sales" />,
      },
      {
        path: "admin/sales-signin",
        element: <AdminSignInPage role="sales" />,
      },
    ],
  },
]);

const productManagerRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation title="BookStore" />,
    children: [
      { index: true, element: <AdminHome /> },
      {
        path: "searchpage",
        element: <SearchPage />,
      },
      {
        path: "customer",
        children: [
          {
            path: "signin",
            element: <SignInPage />,
          },
          {
            path: "signup",
            element: <SignUpPage />,
          },
        ],
      },
      {
        path: "/admin/product-signin",
        element: <AdminSignInPage role="product" />,
      },
      {
        path: "/admin/product-signup",
        element: <AdminSignUpPage role="product" />,
      },
      {
        path: "/admin/sales-signup",
        element: <AdminSignUpPage role="sales" />,
      },
      {
        path: "/admin/sales-signin",
        element: <AdminSignInPage role="sales" />,
      },
      {
        path: "users",
        element: <AdminUsers />,
      },
      {
        path: "products",
        element: <List />,
      },
      {
        path: "invoices",
        element: <ViewInvoices />
      },
      {
        path: "stock",
        element: <AdminStock />,
      },
      {
        path: "add",
        element: <AdminProducts />,
      },
      {
        path: "orders",
        element: <AdminOrders />,
      },
      {
        path: "customer-comments",
        element: <AdminComments />,
      },
    ],
  },
]);

const salesManagerRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation title="BookStore" />,
    children: [
      { index: true, element: <AdminHome /> },
      {
        path: "searchpage",
        element: <SearchPage />,
      },
      {
        path: "auth",
        children: [
          {
            path: "sign-in",
            element: <SignInPage />,
          },
          {
            path: "signup",
            element: <SignUpPage />,
          },
        ],
      },
      {
        path: "/admin/product-signin",
        element: <AdminSignInPage role="product" />,
      },
      {
        path: "/admin/product-signup",
        element: <AdminSignUpPage role="product" />,
      },
      {
        path: "/admin/sales-signup",
        element: <AdminSignUpPage role="sales" />,
      },
      {
        path: "/admin/sales-signin",
        element: <AdminSignInPage role="sales" />,
      },
      {
        path: "/view-products",
        element: <ViewProducts/>
      },
      {
        path: "revenue",
        element: <AdminRevenues />
      },
      {
        path: "refunds",
        element: <AdminRefunds />
      },
      {
        path: "invoices",
        element: <AdminInvoices/>
      },
      {
        path: "users",
        element: <List />,
      },
      {
        path: "comments",
        element: <AdminComments />,
      },
    ],
  },
]);

const customerRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation title="BookStore" />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "book/:bookId", element: <BookDetailPage /> },
      { path: "categories/:categoryId", element: <BookPage /> },
      {
        path: "auth",
        children: [
          {
            path: "signin",
            element: <SignInPage />,
          },
          {
            path: "signup",
            element: <SignUpPage />,
          },
        ],
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "wishlist",
        element: <Wishlist />,
      },
      {
        path: "invoice/:orderId",
        element: <Invoice />,
      },
      {
        path: "comments",
        element: <Comments />,
      },
      {
        path: "user",
        element: <UserProfile />
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "searchpage",
        element: <SearchPage />,
      },
      {
        path: "admin/product-signin",
        element: <AdminSignInPage role="product" />,
      },
      {
        path: "admin/product-signup",
        element: <AdminSignUpPage role="product" />,
      },
      {
        path: "admin/sales-signup",
        element: <AdminSignUpPage role="sales" />,
      },
      {
        path: "admin/sales-signin",
        element: <AdminSignInPage role="sales" />,
      },
    ],
  },
]);

function App() {
  const userCtx = useContext(UserContext);
  const [fetchedUser, setFetchedUser] = useState(false);

  const getUser = useCallback(async () => {
    if (localStorage.getItem("is_logged_in") === "true" && !fetchedUser) {
      const userId = localStorage.getItem("user_id");
      try {
        const response = await fetch(
          "http://localhost:5000/auth/user/" + userId
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data.");
        }
        const data = await response.json();
        userCtx.login(data.user);
        setFetchedUser(true);
      } catch (err) {
        console.error("Error:", err.message);
      }
    }
  }, [userCtx, fetchedUser]);

  useEffect(() => {
    if (!fetchedUser) {
      getUser();
    }
  }, [getUser, userCtx.user.role, fetchedUser]);

  useEffect(() => {
    if (userCtx.isLoggedIn && !fetchedUser) {
      getUser();
    } else if (!userCtx.isLoggedIn) {
      setFetchedUser(false);
    }
  }, [userCtx.isLoggedIn, getUser, fetchedUser]);
  
  
  let element;
  if(!userCtx.isLoggedIn) {
    element = <RouterProvider router={unloggedRouter} />;
  }
  else if (userCtx.isLoggedIn && userCtx.user.role === "customer") {
    element = <RouterProvider router={customerRouter} />;
  } else if (userCtx.isLoggedIn && userCtx.user.role === "productManager") {
    element = <RouterProvider router={productManagerRouter} />;
  } else if (userCtx.isLoggedIn && userCtx.user.role === "salesManager") {
    element = <RouterProvider router={salesManagerRouter} />;
  }

  return <CartProvider><WishlistProvider>{element}</WishlistProvider></CartProvider>;
}

export default App;
