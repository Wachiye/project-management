import React, { Component } from "react";
import { Link } from "react-router-dom";

class IndexPage extends Component {
  render() {
    return (
      <main className="main">
        <div className="container-fluid p-0">
          <div className="jumbotron w-100 text-center">
            <h1 className="display-4 text-capitalize text-success">
              Academic Project Approval and Management System
            </h1>
            <p className="text-black-50">
              {" "}
              Approvals, Management and Tracking of fourth year Academic Projects
            </p>
            <div className="cta">
              <Link to="/register" className="cta-btn primary shadow">
                Get Started
              </Link>
              <Link to="/projects" className="cta-btn ">
                Projects
              </Link>
            </div>
          </div>
        </div>
        <div className="container my-2">
          <div className="row">
            {/*<div className="col-12 text-center">*/}
            {/*    <ul className="list-inline">*/}
            {/*        <li className="list-inline-item">*/}
            {/*            <div className="card shadow bg-light">*/}
            {/*                <div className="card-body">*/}
            {/*                    <h4 className="card-title">Projects</h4>*/}
            {/*                    <h6 className="card-subtitle text-muted">14</h6>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </li>*/}
            {/*        <li className="list-inline-item">*/}
            {/*            <div className="card shadow bg-light">*/}
            {/*                <div className="card-body">*/}
            {/*                    <h4 className="card-title">Students</h4>*/}
            {/*                    <h6 className="card-subtitle text-muted">123</h6>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </li>*/}
            {/*        <li className="list-inline-item">*/}
            {/*            <div className="card shadow bg-light">*/}
            {/*                <div className="card-body">*/}
            {/*                    <h4 className="card-title">Downloads</h4>*/}
            {/*                    <h6 className="card-subtitle text-muted">43</h6>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </li>*/}
            {/*    </ul>*/}
            {/*</div>*/}
            <div className="row my-2">
              <div className="col-12 text-center mb-1">
                <h5 className="text-success">Features</h5>
              </div>
              <div className="col-md-3 mb-2">
                <div className="card bg-light border-success h-100">
                  <div className="card-header bg-success text-light d-flex flex-row justify-content-between align-items-center">
                    <i className="fa fa-clock-o fa-2x"></i>
                    <h6>Timely Approval</h6>
                  </div>
                  <div className="card-body">
                    <p className="lead card-text">Quick Approval of student projects</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-2">
                <div className="card bg-light border-success h-100">
                  <div className="card-header bg-success text-light d-flex flex-row justify-content-between align-items-center">
                    <i className="fa fa-cogs fa-2x"></i>
                    <h6>Project Management</h6>
                  </div>
                  <div className="card-body">
                    <p className="lead card-text">Automation of Common Project Management tasks</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-2">
                <div className="card bg-light border-success h-100">
                  <div className="card-header bg-success text-light d-flex flex-row justify-content-between align-items-center">
                    <i className="fa fa-calendar-check-o fa-2x"></i>
                    <h6>Progress Tracking</h6>
                  </div>
                  <div className="card-body">
                    <p className="lead card-text">
                      Faster Project tracking and progress monitoring
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-2">
                <div className="card bg-light border-success h-100">
                  <div className="card-header bg-success text-light d-flex flex-row justify-content-between align-items-center">
                    <i className="fa fa-envelope fa-2x"></i>
                    <h6>Progress Tracking</h6>
                  </div>
                  <div className="card-body">
                    <p className="lead card-text">Notifications and Reliable Communication</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*<div className="container-fluid">*/}
        {/*    <div className="row py-5 bg-success text-light">*/}
        {/*        <div className="col-8 m-auto">*/}
        {/*            <p className="lead text-center">Get notified ahead of others</p>*/}
        {/*            <form>*/}
        {/*                <div className="row">*/}
        {/*                    <div className="col-sm-5 mb-1">*/}
        {/*                        <input type="text" className="form-control" id="username" placeholder="Username"/>*/}
        {/*                    </div>*/}
        {/*                    <div className="col-sm-5 mb-1">*/}
        {/*                        <input type="text" className="form-control" id="email" placeholder="Email"/>*/}
        {/*                    </div>*/}
        {/*                    <div className="col-sm-2 mb-1">*/}
        {/*                        <button type="submit" className="btn btn-light">Subscribe</button>*/}
        {/*                    </div>*/}
        {/*                </div>*/}
        {/*            </form>*/}
        {/*        </div>*/}
        {/*    </div>*/}
        {/*</div>*/}
      </main>
    );
  }
}

export default IndexPage;
