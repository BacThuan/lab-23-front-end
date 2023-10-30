import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import classes from "./MainNavigation.module.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Logo from "../component/Logo/Logo";
function MainNavigation() {
  const [isAuth, setAuth] = useState(false);

  const dispatch = useDispatch();
  const isSignIn = useSelector((state) => state.isAuth);

  const navigate = useNavigate();

  useEffect(() => {
    setAuth(isSignIn);
    if (isSignIn) {
      navigate("/feed");
    }
  }, [isSignIn]);

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  return (
    <nav className={classes["main-nav"]}>
      <div className={classes["main-nav__logo"]}>
        <NavLink to="/">
          <Logo />
        </NavLink>
      </div>
      <div className={classes.spacer} />
      <ul className={classes["main-nav__items"]}>
        {!isAuth && (
          <li className={classes["navigation-item"]}>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              // tat active cua trang mac
              end
            >
              Login
            </NavLink>
          </li>
        )}

        {!isAuth && (
          <li className={classes["navigation-item"]}>
            <NavLink
              to="/sign-up"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              Sign up
            </NavLink>
          </li>
        )}

        {isAuth && (
          <li className={classes["navigation-item"]}>
            <NavLink
              to="/feed"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              // tat active cua trang mac
              end
            >
              Feed
            </NavLink>
          </li>
        )}

        {isAuth && (
          <li className={classes["navigation-item"]}>
            <NavLink
              onClick={logout}
              to="/"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              Logout
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default MainNavigation;
