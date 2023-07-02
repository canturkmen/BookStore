import { useNavigate } from "react-router-dom";

import Card from "../../shared/components/UIComponents/Card";
import styles from "./Signup.module.css";
import SignUpForm from "../components/SignUpForm";

const SignUpPage = () => {
  const navigate = useNavigate();

  return (
    <Card className={styles.configure}>
      <div className={styles.form}>
        <div className={styles.info}>
          <h1>Welcome, This is Book Store</h1>
          <p>You need to sign-up to the store before continue shopping</p>
          <span style={{ marginRight: "0px" }}>
            You already have an account?{" "}
            <span
              style={{ color: "black", cursor: "pointer" }}
              onClick={() => {
                navigate("/auth/signin");
              }}
            >
              Sign In
            </span>
          </span>
        </div>
        <div className={styles.signupform}>
          <SignUpForm />
        </div>
      </div>
    </Card>
  );
};

export default SignUpPage;
