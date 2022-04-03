import AuthService from "../services/AuthService";
import Register from "./Register";

const NewUser = () => {
  const role = AuthService.getUserRole();
  let allowedRoles = [];

  if (role === "ADMINISTRATOR") {
    allowedRoles = ["ADMINISTRATOR", "EVALUATOR", "SUPERVISOR", "STUDENT"];
  } else if (role === "EVALUATOR") {
    allowedRoles = ["EVALUATOR", "SUPERVISOR", "STUDENT"];
  } else {
    allowedRoles = ["STUDENT"];
  }

  return <Register class="admin-main" roles={allowedRoles} />;
};
export default NewUser;
