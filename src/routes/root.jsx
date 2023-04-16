import { redirect } from "react-router-dom";
import { useState } from "react";

import Sidebar from "../components/SideBar";
import MobileBottomNav from "../components/MobileBottomNav";
export function loader() {
  const apiToken = window.localStorage.getItem("apiToken") || false;
  if (apiToken) {
    return apiToken;
  } else {
    return redirect("/login");
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
