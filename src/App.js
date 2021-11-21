import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";

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
import HelpPage from "./pages/Help";
import NewProject from "./pages/NewProject";
import NewMilestone from "./pages/NewMilestone";
import MyProjects from "./pages/MyProjects";
import Milestones from "./pages/Milestones";
import ViewMilestone from "./pages/ViewMilestone";
import NewTask from "./pages/NewTask";
import Profile from "./pages/Profile";
function App() {
  return (
    <Router>
      <Switch>
        <PublicRoute path="/" exact component={IndexPage} />
        <PublicRoute path="/login" exact component={LoginPage} />
        <PublicRoute path="/register" exact component={RegisterPage} />
        <PublicRoute path="/help" exact component={HelpPage} />

        <PrivateRoute path="/dashboard" exact component={Dashboard} />
        <PrivateRoute path="/projects" exact component={ProjectsPage} />
        <PrivateRoute path="/project/:id" exact component={ViewProjectPage} />
        <PrivateRoute path="/my-projects" exact component={MyProjects} />
        <PrivateRoute path="/new-project" exact component={NewProject} />
        <PrivateRoute path="/project-milestones/:projectId" exact component={Milestones} />
        <PrivateRoute path="/milestone/:milestoneId" exact component={ViewMilestone} />
        <PrivateRoute path="/new-milestone" exact component={NewMilestone} />
        <PrivateRoute path="/new-task/:milestoneId" exact component={NewTask} />
        <PrivateRoute path="/profile" exact component={Profile} />
      </Switch>
    </Router>
  );
}

export default App;
