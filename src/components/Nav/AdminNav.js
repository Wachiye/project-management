import {Link} from "react-router-dom";
import AuthService from "../../services/AuthService";
import React from "react";

const StudentNav = () => {
  return (
    <>
      <li className="nav-item">
        <Link className="nav-link" to="/projects">
          Projects
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/new-project">
          New Project
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/my-projects">
          My Projects
        </Link>
      </li>
    </>
  );
};

const EvaluatorNav = () => {
  return (
    <>
      <li className="nav-item">
        <Link className="nav-link" to="/staff">
          Staff
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/students">
          Students
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/projects">
          Projects
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/approve-projects">
          Approve Projects
        </Link>
      </li>
        <SettingsNav/>
    </>
  );
};

const SupervisorNav = () => {
  return (
    <>
      <li className="nav-item">
        <Link className="nav-link" to="/my-students">
          My Students
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/my-projects">
          My Projects
        </Link>
      </li>
    </>
  );
};

const AdminNav = () => {
  return (
    <>
      <li className="nav-item">
        <Link className="nav-link" to="/staff">
          Staff
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/students">
          Students
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/projects">
          Projects
        </Link>
      </li>
        <SettingsNav/>
    </>
  );
};
const SettingsNav =() => {
    return(
        <li className="nav-item">
            <Link className="nav-link" to="/settings">
                Settings
            </Link>
        </li>
    );
}
const GetNav = ({ role }) => {
  if (role === "STUDENT") return <StudentNav />;
  else if (role === "EVALUATOR") return <EvaluatorNav />;
  else if (role === "SUPERVISOR") return <SupervisorNav />;
  else if (role === "ADMINISTRATOR") return <AdminNav />;
  else return null;
};

const Nav = (props) => {
    const logout = async () =>{
        let response = await AuthService.logout();
        if (response.error) {
            alert(response.error.message)
        } else {
            localStorage.removeItem("_apams");
            window.location ="/login";
        }
    }
  return (
    <div className="admin-nav">
      <div className="nav-header">
        <h5>{props.role} Dashboard</h5>
      </div>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className="nav-link" to="/dashboard">
            Dashboard
          </Link>
        </li>
        {props.role && <GetNav role={props.role} />}
        <li className="nav-item">
          <Link className="nav-link" to="/notifications">
            Notifications
          </Link>
        </li>
          <li className="nav-item">
              <Link className="nav-link" to="/reports">
                  Reports
              </Link>
          </li>
        <li className="nav-item">
          <Link className="nav-link" to="/profile">
            Profile
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/help">
              Help
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="#" onClick={logout}>
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};
export default Nav;
