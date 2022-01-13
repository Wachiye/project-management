import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "./App.css";

import "jquery/dist/jquery.min.js";
import "@popperjs/core/dist/cjs/popper";
import  "bootstrap/dist/js/bootstrap.min";

import { PrivateRoute, PublicRoute } from "./routes/Routes";

import IndexPage from "./pages/Index";
import ProjectsPage from "./pages/Projects";
import ViewProjectPage from "./pages/ViewProject";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NewProject from "./pages/NewProject";
import NewMilestone from "./pages/NewMilestone";
import MyProjects from "./pages/MyProjects";
import Milestones from "./pages/Milestones";
import ViewMilestone from "./pages/ViewMilestone";
import NewTask from "./pages/NewTask";
import Profile from "./pages/Profile";
import Users from "./pages/Users";
import Students from "./pages/Students";
import Staff from "./pages/Staff";
import NewUser from "./pages/NewUser";
import Comments from "./pages/Comments";
import Notifications from "./pages/Notifications";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import Help from "./components/Help";
import ProjectFiles from "./pages/ProjectFiles";
import ViewProjectFile from "./pages/ViewProjectFile";
import ApproveProjects from "./pages/ApproveProjects";

function App() {
  return (
    <Router>
      <Switch>
        <PublicRoute path="/" exact component={IndexPage} />
        <PublicRoute path="/login" exact component={LoginPage} />
        <PublicRoute path="/register" exact component={RegisterPage} />
        <PublicRoute path="/contact" exact component={Contact} />

        <PrivateRoute path="/dashboard" exact component={Dashboard} />

        <PrivateRoute path="/projects" exact component={ProjectsPage} />
        <PrivateRoute path="/projects/:projectId" exact component={ViewProjectPage} />
        <PrivateRoute path="/my-projects" exact component={MyProjects} />
        <PrivateRoute path="/new-project" exact component={NewProject} />
        <PrivateRoute path="/approve-projects" exact component={ApproveProjects} />
        <PrivateRoute path="/projects/:projectId/milestones" exact component={Milestones} />
        <PrivateRoute path="/projects/:projectId/milestones/:milestoneId" exact component={ViewMilestone} />
        <PrivateRoute path="/new-milestone" exact component={NewMilestone} />
        <PrivateRoute path="/new-task/:milestoneId" exact component={NewTask} />
        <PrivateRoute path="/projects/:projectId/comments" exact component={Comments} />
        <PrivateRoute path="/projects/:projectId/files" exact component={ProjectFiles} />
        <PrivateRoute path="/projects/:projectId/files/:fileId" exact component={ViewProjectFile} />
        <PrivateRoute path="/notifications" exact component={Notifications} />
        <PrivateRoute path={"/reports"} exact component={Reports} />

        <PrivateRoute path="/profile" exact component={Profile} />
        <PrivateRoute path="/users" exact component={Users}/>
        <PrivateRoute path="/students" exact component={Students} />
        <PrivateRoute path="/staff" exact component={Staff} />
        <PrivateRoute path="/new-user" exact component={NewUser} />

        <PrivateRoute path="/settings" exact component={Settings} />
        <Route path="/help" exact component={Help} />
        <Route path="*" exact component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
