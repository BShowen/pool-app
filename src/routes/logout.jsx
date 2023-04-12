import { redirect } from "react-router-dom";
export function loader() {
  window.localStorage.removeItem("apiToken");
  return redirect("/login");
}
