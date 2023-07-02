import Card from "../../shared/components/UIComponents/Card";
import styles from "../../Users/pages/SignIn.module.css";
import SignInForm from "../../Users/components/SignInForm";
import SideBar from "./SideBar"
import NavBar from "./NavBar"
import AdminStyles from './Admin.css'
import Widget from "./Widget";
import Chart from "./Chart";
import Featured from "./Featured";
import Table from "./Table";
import List from "./List"
import { Link } from "@mui/material";

const AdminPage = () => {
  return (
    <div>
      <div className="home">
        <SideBar/>
        <div className="homeContainer">
          <NavBar/>
          <div className="widgets">
            <Widget type="user"/>
            <Widget type="order"/>
            <Widget type="earning"/>
            <Widget type="balance"/>
          </div>
          <div className="charts">
            <Featured/>
            <Chart/>
          </div>
          <div className="listContainer">
            <div className="listTitle">Latest Transactions</div>
            <Table/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;