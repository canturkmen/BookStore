import { useNavigate } from "react-router-dom";

import Card from "../../shared/components/UIComponents/Card";
import styles from "./SignIn.module.css";
import AdminSignInForm from "../components/AdminSignInForm";

const AdminSignInPage = (props) => {
  const navigate = useNavigate();

  return (
    <Card className={styles.configure}>
      <div className={styles.form}>
        <div className={styles.info}>
          <h1>Welcome, {props.role.charAt(0).toUpperCase() + props.role.slice(1)} Manager</h1>
          <p>You need to login before you continue with panel</p>
          <p>
            You don't have an account?{" "}
            <span
              style={{ color: "black", cursor: "pointer"}}
              onClick={() => {
                navigate(`/admin/${props.role}-signup`);
              }}
            >
              Sign Up
            </span>
          </p>
          <p>
            Switch from {props.role} manager?{" "}
            <span
              style={{ color: "black", cursor: "pointer" }}
              onClick={() => {
                if (props.role === "product") {
                  navigate(`/admin/sales-signin`);
                } else {
                  navigate(`/admin/product-signin`);
                }
              }}
            >
              Switch
            </span>
          </p>
        </div>
        <div className={styles.signinform}>
          <AdminSignInForm role={props.role}/>
        </div>
      </div>
    </Card>
  );
};

export default AdminSignInPage;
