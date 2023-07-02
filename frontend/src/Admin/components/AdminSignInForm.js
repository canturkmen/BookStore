import { useNavigate } from "react-router-dom";
import { Button, Text } from "@chakra-ui/react";
import styles from "./SignInForm.module.css";
import InputElement from "../../shared/components/FormElements/Input";
import useForm from "../../shared/hooks/form-hooks";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MIN_LENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/utils/validators";
import { useContext } from "react";
import { UserContext } from "../../shared/contexts/user-context";

function AdminSignInForm(props) {
  const navigate = useNavigate();
  const userCtx = useContext(UserContext);

  const [formState, inputHandler] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
        }),
      })
  
      const data = await response.json();
  
      if(data.message) {
        window.alert(data.message);
      } else {
        localStorage.setItem("user_id", data.userId);
        localStorage.setItem("token", data.token);
        localStorage.setItem("is_logged_in", "true");
      }

      const userResponse = await fetch(
        "http://localhost:5000/auth/user/" + data.userId
      );

      if(!userResponse.ok) {
        throw new Error("Failed to fetch user data!");
      }

      const userData = await userResponse.json();
      userCtx.login(userData);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form method="POST" onSubmit={formSubmitHandler}>
      <div className={styles.control}>
        <Text color="white">Email</Text>
        <InputElement
          id="email"
          type="email"
          errorText="Please enter a valid email"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
          onInput={inputHandler}
        />
      </div>
      <div className={styles.control}>
        <Text color="white">Password</Text>
        <InputElement
          id="password"
          type="password"
          errorText="Please enter a valid password (at least 5 characters)"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MIN_LENGTH(5)]}
          onInput={inputHandler}
        />
      </div>
      <div className={styles.actions}>
        <Button isDisabled={!formState.isValid} type="submit">
          Login
        </Button>
      </div>
    </form>
  );
}

export default AdminSignInForm;
