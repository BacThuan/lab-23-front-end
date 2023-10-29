import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { required, lengthValue, isEmail } from "../../store/validators";
import Input from "../../component/Input/Input";
import Button from "../../component/Button/Button";
import { useDispatch } from "react-redux";
import Auth from "./Auth";
import { baseUrl } from "../../store/url";
const Signup = () => {
  const [email, setEmail] = useState("");
  const [touchedEmail, setTouchEmail] = useState(false);
  const [validEmail, setValidEmail] = useState(false);

  const [password, setPass] = useState("");
  const [touchedPass, setTouchPass] = useState(false);
  const [validPass, setValidPass] = useState(false);

  const [name, setName] = useState("");
  const [touchedName, setTouchName] = useState(false);
  const [validName, setValidName] = useState(false);

  const [error, setError] = useState(false);

  const formValid = validEmail && validPass && validName;

  const handleChangeEmail = (id, value, file) => {
    setEmail(value);
    setValidEmail(required(email) && isEmail(email));
  };

  const handleChangePass = (id, value, file) => {
    setPass(value);
    setValidPass(required(password) && lengthValue({ min: 5 }, password));
  };

  const handleChangeName = (id, value, file) => {
    setName(value);
    setValidName(required(name));
  };

  // handle error
  const errorHandler = () => {
    setError(false);
  };

  const navigate = useNavigate();

  const signup = (e) => {
    e.preventDefault();

    fetch(baseUrl + "/auth/signup", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        name: name,
      }),
    })
      .then((res) => {
        if (res.status === 422) {
          let mess =
            "Validation failed. Make sure the email address isn't used yet!";

          throw new Error(mess);
        }
        if (res.status !== 200 && res.status !== 201) {
          let mess = "Creating a user failed!";

          throw new Error(mess);
        }
        return res.json();
      })
      .then((resData) => {
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Auth>
        <form onSubmit={signup}>
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
            id="name"
            label="Your Name"
            type="text"
            control="input"
            onChange={handleChangeName}
            onBlur={() => {
              setTouchName(true);
            }}
            value={name}
            valid={validName}
            touched={touchedName}
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
            Signup
          </Button>
        </form>
      </Auth>
    </div>
  );
};
export default Signup;
