import React, { useContext } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import QrCodeIcon from "@mui/icons-material/QrCode";
import InventoryIcon from "@mui/icons-material/Inventory2";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsSystemDaydreamIcon from "@mui/icons-material/SettingsSystemDaydream";
import PsychologyIcon from "@mui/icons-material/Psychology";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import CommentIcon from "@mui/icons-material/Comment";
import { UserContext } from "../../shared/contexts/user-context";

export const SideBar = () => {
  const userCtx = useContext(UserContext);

  return (
    <div className="sidebar">
      <div className="top">
        <span className="logo">
          {userCtx.user.role === "productManager"
            ? "Product Manager"
            : "Sales Manager"}
        </span>
      </div>
      <hr />
      <div className="center">
        <ul className="dashboards">
          <p className="title">LIST</p>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to={`/${
                userCtx.user.role === "productManager"
                  ? "users"
                  : "view-products"
              }`}
            >
              <span className="sidebarNames">
                {userCtx.user.role === "productManager"
                  ? "Users"
                  : "View Products"}
              </span>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to={`/${
                userCtx.user.role === "productManager"
                  ? "products"
                  : "refunds"
              }`}
            >
              <span className="sidebarNames">
                {userCtx.user.role === "productManager"
                  ? "Products"
                  : "Refunds"}
              </span>
            </Link>
          </li>

          <li>
            <Link
              style={{ textDecoration: "none" }}
              to={`/${
                userCtx.user.role === "productManager" ? "orders" : "revenue"
              }`}
            >
              <span className="sidebarNames">
                {userCtx.user.role === "productManager" ? "Orders" : "Revenue"}
              </span>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to={`/${
                userCtx.user.role === "productManager" ? "invoices" : "invoices"
              }`}
            >
              <span className="sidebarNames">
                {userCtx.user.role === "productManager"
                  ? "Invoices"
                  : "Invoices"}
              </span>
            </Link>
          </li>
          <li>
            {userCtx.user.role === "productManager" && (
              <Link
                style={{ textDecoration: "none" }}
                to={`/${
                  userCtx.user.role === "productManager"
                    ? "customer-comments"
                    : "refunds"
                }`}
              >
                {" "}
                <span className="sidebarNames">
                  {userCtx.user.role === "productManager" ? "Comments" : ""}
                </span>
              </Link>
            )}
          </li>
          <li>
            {userCtx.user.role === "productManager" && (
              <Link
                style={{ textDecoration: "none" }}
                to={`/${
                  userCtx.user.role === "productManager"
                    ? "stock"
                    : "refunds"
                }`}
              >
                {" "}
                <span className="sidebarNames">
                  {userCtx.user.role === "productManager" ? "Stock" : ""}
                </span>
              </Link>
            )}
          </li>
          <li>
            {userCtx.user.role === "productManager" && (
              <Link
                style={{ textDecoration: "none" }}
                to={`/${
                  userCtx.user.role === "productManager"
                    ? "add"
                    : "refunds"
                }`}
              >
                {" "}
                <span className="sidebarNames">
                  {userCtx.user.role === "productManager" ? "Add" : ""}
                </span>
              </Link>
            )}
          </li>

          <p className="title">USEFUL LIST</p>
          <li>
            <QueryStatsIcon className="icon" />
            <span className="sidebarNames">Stats</span>
          </li>
          <li>
            <NotificationsIcon className="icon" />
            <span className="sidebarNames">Notifications</span>
          </li>
          <p className="title">SERVICE</p>
          <li>
            <SettingsSystemDaydreamIcon className="icon" />
            <span className="sidebarNames">System Health</span>
          </li>
          <li>
            <PsychologyIcon className="icon" />
            <span className="sidebarNames">Logs</span>
          </li>
          <li>
            <SettingsIcon className="icon" />
            <span className="sidebarNames">Settings</span>
          </li>
          <p className="title">USER</p>
          <li>
            <AccountCircleIcon className="icon" />
            <span className="sidebarNames">Profile</span>
          </li>
          <li>
            <LogoutIcon className="icon" />
            <span className="sidebarNames">Logout</span>
          </li>
        </ul>
      </div>
      <div className="bottom">
        <div className="colorOption"></div>
        <div className="colorOption"></div>
      </div>
    </div>
  );
};

export default SideBar;
