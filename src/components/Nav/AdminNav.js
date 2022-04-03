import { Link } from "react-router-dom";
import AuthService from "../../services/AuthService";
import React from "react";
import $ from "jquery";
import ProjectService from "../../services/ProjectService";

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
      <li className="nav-item">
        <Link className="nav-link" to="/guides">
          Guides
        </Link>
      </li>
    </>
  );
};

const EvaluatorNav = () => {
  let pendingProjects = null;

  ProjectService.getAllByStatus("WAITING_APPROVAL").then((res) => {
    pendingProjects = res.data?.data;
  });

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
        <Link className="nav-link" to="/my-projects">
          My Projects
        </Link>
      </li>
      {pendingProjects && (
        <li className="nav-item">
          <Link className="nav-link" to="/approve-projects">
            Approve Projects
            <span className="badge text-danger pull-right">{pendingProjects?.length || 0}</span>
          </Link>
        </li>
      )}
      <li className="nav-item">
        <Link className="nav-link" to="/reports">
          Reports
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/guides">
          Guides
        </Link>
      </li>
      <SettingsNav />
    </>
  );
};

const SupervisorNav = () => {
  return (
    <>
      <li className="nav-item">
        <Link className="nav-link" to="/students">
          My Students
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/my-projects">
          My Projects
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/guides">
          Guides
        </Link>
      </li>
    </>
  );
};

const AdminNav = () => {
  return (
    <>
      <li className="nav-item">
        <Link className="nav-link" to="/users">
          Users
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/messages">
          Messages
        </Link>
      </li>
    </>
  );
};
const SettingsNav = () => {
  return (
    <li className="nav-item">
      <Link className="nav-link" to="/settings">
        Settings
      </Link>
    </li>
  );
};
const GetNav = ({ role }) => {
  if (role === "STUDENT") return <StudentNav />;
  else if (role === "EVALUATOR") return <EvaluatorNav />;
  else if (role === "SUPERVISOR") return <SupervisorNav />;
  else if (role === "ADMINISTRATOR") return <AdminNav />;
  else return null;
};

const Nav = (props) => {
  const logout = async () => {
    const response = await AuthService.logout();
    if (response.error) {
      alert(response.error.message);
    } else {
      localStorage.removeItem("_apams");
      window.location = "/login";
    }
  };

  function toggleNav() {
    $(".admin-nav").toggleClass("active");
  }
  return (
    <div className="admin-nav">
      <div className="nav-header">
        <h5>
          {props.role} Dashboard
          <span className="pull-right d-lg-none" onClick={() => toggleNav()}>
            <i className="fa fa-close"></i>
          </span>
        </h5>
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
