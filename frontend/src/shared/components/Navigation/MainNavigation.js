import React from "react";
import styles from "./MainNavigation.module.css";
import { Outlet } from "react-router-dom";
import MainHeader from "./MainHeader";

const MainNavigation = (props) => {
  return (
    <React.Fragment>
      <MainHeader />
      <Outlet />
    </React.Fragment>
  );
};

export default MainNavigation;
