import React, { Component } from "react";
import { Link } from "react-router-dom";

class Dashboard extends Component {
  render() {
    return (
      <div className="admin-main">
        <div className="container-fluid p-1">
          <div className="row">
            <div className="col-12">
              <div className="welcome">
                <div className="message float-left">
                  <h3 className="text-dark">Hi, Welcome back,</h3>
                  <p className="lead">Your analytics dashboard</p>
                </div>
                <div className="cta float-right">
                  <Link to="/reports" className="cta-btn primary">
                    View Reports
                  </Link>
                </div>
                <div className="clearfix"></div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="updates mb-2">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Quick Updates</h5>
                    <div className="card-text">
                      <div className="row">
                        <div className="col-6 col-md-4 col-xl-2">
                          <div className="update">
                            <div className="icon d-flex justify-content-center align-items-center">
                              <img src="" alt="" width="35" height="35" />
                            </div>
                            <h6 className="title">All Projects</h6>
                            <p className="text">354</p>
                          </div>
                        </div>
                        <div className="col-6 col-md-4 col-xl-2">
                          <div className="update">
                            <div className="icon d-flex justify-content-center align-items-center">
                              <img src="" alt="" width="35" height="35" />
                            </div>
                            <h6 className="title">My Projects</h6>
                            <p className="text">4</p>
                          </div>
                        </div>
                        <div className="col-6 col-md-4  col-xl-2">
                          <div className="update">
                            <div className="icon d-flex justify-content-center align-items-center">
                              <img src="" alt="" width="35" height="35" />
                            </div>
                            <h6 className="title">Milestones</h6>
                            <p className="text">14</p>
                          </div>
                        </div>
                        <div className="col-6 col-md-4 col-xl-2">
                          <div className="update">
                            <div className="icon d-flex justify-content-center align-items-center">
                              <img src="" alt="" width="35" height="35" />
                            </div>
                            <h6 className="title">Project Files</h6>
                            <p className="text">4</p>
                          </div>
                        </div>

                        <div className="col-6 col-md-4 col-xl-2">
                          <div className="update">
                            <div className="icon d-flex justify-content-center align-items-center">
                              <img src="" alt="" width="35" height="35" />
                            </div>
                            <h6 className="title">All Tasks</h6>
                            <p className="text">4</p>
                          </div>
                        </div>
                        <div className="col-6 col-md-4 col-xl-2">
                          <div className="update">
                            <div className="icon d-flex justify-content-center align-items-center">
                              <img src="" alt="" width="35" height="35" />
                            </div>
                            <h6 className="title">Overdue Tasks</h6>
                            <p className="text">4</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 my-2">
              <div className="quick-reports">
                <div className="time-spend">
                  <h6 className="title">Time spend on project</h6>
                  <div className="progress" style={{ height: "30px" }}>
                    <div
                      className="progress-bar progress-bar-striped"
                      style={{ width: "70%" }}
                    >
                      70%
                    </div>
                  </div>
                  <h6 className="title">Time Available</h6>
                  <p className="lead">233 Days</p>
                </div>
                <div className="pending-tasks">
                  <h6 className="title">Pending Tasks</h6>
                  <p className="lead">8</p>
                </div>
                <div className="finished-tasks">
                  <h6 className="title">Finished Tasks</h6>
                  <p className="lead">2</p>
                </div>
                <div className="finished-milestones">
                  <h6 className="title">Finished Milestones</h6>
                  <p className="lead">3</p>
                </div>
                <div className="project-report">
                  <div className="card border-info h-100">
                    <div className="card-header bg-info">
                      <h6>Project Report</h6>
                    </div>
                    <div className="card-body">
                      <ul className="list-unstyled">
                        <li className="">
                          Start Date:
                          <span className="pull-right">{'values'}</span>
                        </li>
                        <li className="">
                          End Date:
                          <span className="pull-right">{'values'}</span>
                        </li>
                        <li className="">
                          Project Status:
                          <span className="pull-right">{'values'}</span>
                        </li>

                        <li className="">
                          All Milestones:
                          <span className="pull-right">{'values'}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5>Recent Tasks</h5>
                </div>
                <div className="card-body">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Task ID</th>
                        <th>Task Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>2334</td>
                        <td>Create Login page</td>
                        <td>12-09-2021</td>
                        <td>12-10-2021</td>
                        <td>Pending</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
