import { redirect } from "react-router-dom";
import routes from "./routeDefinitions";
export function loader() {
  window.localStorage.removeItem("apiToken");
  return redirect(routes.login);
}
