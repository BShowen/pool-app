import { redirect } from "react-router-dom";
import routes from "./routeDefinitions";
export function loader() {
  window.localStorage.clear();
  return redirect(routes.login);
}
