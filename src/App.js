import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout";
import ErrorHandler from "./component/ErrorHandler/ErrorHandler";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Feed from "./pages/feed/Feed";
import SinglePost from "./pages/feed/SinglePost/SinglePost";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

function App() {
  const dispatch = useDispatch();

  const error = useSelector((state) => state.error);
  const errorHandler = () => {
    dispatch({ type: "ERROR", error: null });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const expiryDate = localStorage.getItem("expiryDate");

    if (!token || !userId) {
      return;
    }
    //
    else {
      dispatch({ type: "ISAUTH", token: token, userId: userId });
    }
    if (new Date(expiryDate) <= new Date()) {
      dispatch({ type: "LOGOUT" });
      return;
    }
    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime();

    // set auto logut
    setTimeout(() => {
      dispatch({ type: "LOGOUT" });
    }, remainingMilliseconds);
  });
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorHandler error={error} onHandle={errorHandler} />,
      children: [
        {
          index: true,
          element: <Login />,
        },
        { path: "sign-up", element: <Signup /> },
        { path: "feed", element: <Feed /> },
        { path: "feed/:idPost", element: <SinglePost /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
