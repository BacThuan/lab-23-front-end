import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { required, lengthValue, isEmail } from "../../store/validators";
import Input from "../../component/Input/Input";
import Button from "../../component/Button/Button";
import { useDispatch } from "react-redux";
import Auth from "./Auth";
import { baseUrl } from "../../store/url";
const Login = () => {
  const [email, setEmail] = useState("");
  const [touchedEmail, setTouchEmail] = useState(false);
  const [validEmail, setValidEmail] = useState(false);

  const [password, setPass] = useState("");
  const [touchedPass, setTouchPass] = useState(false);
  const [validPass, setValidPass] = useState(false);

  const formValid = validEmail && validPass;

  const handleChangeEmail = (id, value, file) => {
    setEmail(value);
    setValidEmail(required(email) && isEmail(email));
  };

  const handleChangePass = (id, value, file) => {
    setPass(value);
    setValidPass(required(password) && lengthValue({ min: 5 }, password));
  };

  const [errorMessage, setErrMess] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //login
  const login = (e) => {
    e.preventDefault();
    fetch(baseUrl + "/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => {
        if (res.status === 422) {
          throw new Error("Validation failed.");
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log("Error!");
          throw new Error("Could not authenticate you!");
        }
        return res.json();
      })
      .then((resData) => {
        dispatch({
          type: "LOGIN",
          token: resData.token,
          userId: resData.userId,
        });

        // set auto logout
        const remainingMilliseconds = 60 * 60 * 1000;
        setTimeout(() => {
          dispatch({ type: "LOGOUT" });
        }, remainingMilliseconds);

        navigate("/feed");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <Auth>
        <form onSubmit={login}>
          <Input
            id="email"
            label="Your E-Mail"
            type="email"
            control="input"
            onChange={handleChangeEmail}
            onBlur={() => {
              setTouchEmail(true);
            }}
            value={email}
            valid={validEmail}
            touched={touchedEmail}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            control="input"
            onChange={handleChangePass}
            onBlur={() => {
              setTouchPass(true);
            }}
            value={password}
            valid={validPass}
            touched={touchedPass}
          />
          <Button design="raised" type="submit" disable={formValid}>
            Login
          </Button>
        </form>
      </Auth>
    </div>
  );
};
export default Login;
