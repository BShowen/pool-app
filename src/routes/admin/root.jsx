import { redirect } from "react-router-dom";
import { useState } from "react";

import Sidebar from "./adminComponents/SideBar";
import MobileBottomNav from "./adminComponents/MobileBottomNav";
import routes from "../routeDefinitions";
export function loader() {
  const apiToken = window.localStorage.getItem("apiToken") || false;
  if (apiToken) {
    return apiToken;
  } else {
    return redirect(routes.login);
  }
}

export default function Root() {
  const [state, setState] = useState(false);

  function toggle() {
    setState(!state);
  }

  return (
    <>
      <Sidebar isSidebarOpen={state} toggleSidebar={toggle} />
      <MobileBottomNav isSidebarOpen={state} toggleSidebar={toggle} />
    </>
  );
}
