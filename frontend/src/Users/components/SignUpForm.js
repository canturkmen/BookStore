import { Button, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import styles from "./SignUpForm.module.css";
import InputElement from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MIN_LENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/utils/validators";
import useForm from "../../shared/hooks/form-hooks";

function SignUpForm(props) {
  const navigate = useNavigate();
  const [formState, inputHandler] = useForm(
    {
      username: {
        value: "",
        isValid: false,
      },
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
      taxID: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const formSubmitHandler = (event) => {
    event.preventDefault();
    fetch("http://localhost:5000/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formState.inputs.email.value,
        password: formState.inputs.password.value,
        username: formState.inputs.username.value,
        taxID: formState.inputs.taxID.value,
        address: formState.inputs.address.value,
        role: "customer"
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        navigate("/auth/signin");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <form method="POST" onSubmit={formSubmitHandler}>
      <div className={styles.control}>
        <Text color="white">User Name</Text>
        <InputElement
          id="username"
          type="text"
          errorText="Please enter a valid username"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
        />
      </div>
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
      <div className={styles.control}>
        <Text color="white">Tax ID</Text>
        <InputElement
          id="taxID"
          type="number"
          errorText="Please enter a valid tax ID (at least 3 characters)"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MIN_LENGTH(3)]}
          onInput={inputHandler}
        />
      </div>
      <div className={styles.control}>
        <Text color="white">Address</Text>
        <InputElement
          id="address"
          type="text"
          errorText="Please enter a valid address"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
          width="100px"
        />
      </div>
      <div className={styles.actions}>
        <Button isDisabled={!formState.isValid} type="submit">
          Sign-Up
        </Button>
      </div>
    </form>
  );
}

export default SignUpForm;
