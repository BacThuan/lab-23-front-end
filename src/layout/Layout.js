import { Outlet, useNavigation } from "react-router-dom";

import MainNavigation from "./MainNavigation";
import React from "react";
import Toolbar from "../component/Toolbar/Toolbar";
import Backdrop from "../component/Backdrop/Backdrop";
import Loader from "../component/Loader/Loader";

function Layout() {
  const navigation = useNavigation();

  return (
    <React.Fragment>
      {/* <Backdrop /> */}
      <Toolbar>
        <MainNavigation />
        <main>
          {navigation.state === "loading" && <Loader />}
          <Outlet />
        </main>
      </Toolbar>
    </React.Fragment>
  );
}

export default Layout;
