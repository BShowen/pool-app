import { redirect } from "react-router-dom";
import routes from "./routeDefinitions";

/**
 * This loader matches the root route and redirects the user to the appropriate
 * root page. For admins this is "/admin" for customers this is "/customers" and
 * for technicians this is "/technician". If the user is not logged in the they
 * are redirected to "/login"
 */
export async function loader() {
  const token = window.localStorage.getItem("apiToken");

  if (!token) {
    return redirect(routes.login);
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.roles.includes("ADMIN")) {
      return redirect("/admin");
    } else if (payload.roles.includes("TECH")) {
      return redirect("/technician");
    } else {
      return redirect("/customer");
    }
  } catch (error) {
    throw error;
  }
}
