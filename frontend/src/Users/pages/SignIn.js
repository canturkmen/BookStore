import { useNavigate } from "react-router-dom";

import Card from "../../shared/components/UIComponents/Card";
import styles from "./SignIn.module.css";
import SignInForm from "../components/SignInForm";

const SignInPage = () => {
  const navigate = useNavigate();

  return (
    <Card className={styles.configure}>
      <div className={styles.form}>
        <div className={styles.info}>
          <h1>Welcome, This is Book Store</h1>
          <p>You need to login to the store before continue shopping</p>
          <span style={{ marginRight: "0px" }}>
            You don't have an account?{" "}
            <span
              style={{ color: "black", cursor: "pointer" }}
              onClick={() => {
                navigate("/auth/signup");
              }}
            >
              Sign Up
            </span>
          </span>
        </div>
        <div className={styles.signinform}>
          <SignInForm />
        </div>
      </div>
    </Card>
  );
};

export default SignInPage;
