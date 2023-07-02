import { Input } from "@chakra-ui/react";
import { useEffect, useReducer } from "react";
import { validate } from "../../utils/validators";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
        return {
            ...state,
            value: action.val,    
            isValid: validate(action.val, action.validators)
        }
    case "TOUCH":
        return {
            ...state,
            isTouched: true
        }
    default:
      return state;
  }
};

const InputElement = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isValid: props.initialValidty || false,
    isTouched: false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, onInput, value, isValid]);

  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = (event) => {
    dispatch({ type: "TOUCH" });
  };

  return (
    <div>
      <Input
        name={props.id}
        type={props.type}
        value={inputState.value}
        onBlur={touchHandler}
        onChange={changeHandler}
        variant={props.variant}
        focusBorderColor={props.focusBorderColor}
        width={props.width}
        pr={props.pr}
      />
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default InputElement;
