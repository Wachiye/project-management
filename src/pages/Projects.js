import React, { Component } from "react";
import Alert from "../components/Alert/Alert";
import ProjectService from "../services/ProjectService";
import ProjectCard from "../components/ProjectCard";
import AuthService from "../services/AuthService";
import { Link } from "react-router-dom";
import isLoading from "../utils/LoadingUtil";

class Projects extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allProjects: [],
      projects: [],
      alert: {},
      hasAlert: false,
      categories: ["WEB_BASED", "ANDROID", "DESKTOP", "NETWORKING", "SECURITY", "OTHER"],
      statuses: ["PENDING", "WAITING_APPROVAL", "IN_PROGRESS", "FINISHED", "REJECTED", "ACCEPTED"]
    };

    this.setAlert = this.setAlert.bind(this);
    this.removeAlert = this.removeAlert.bind(this);
    this.filterProjectByStatus = this.filterProjectByStatus.bind(this);
    this.filterProjectByCategory = this.filterProjectByCategory.bind(this);
    this.removeFilter = this.removeFilter.bind(this);
  }

  setAlert(alert) {
    this.setState({
      alert,
      hasAlert: true
    });
  }
  removeAlert() {
    this.setState({
      alert: null,
      hasAlert: false
    });
  }

  filterProjectByStatus(status) {
    this.setState({
      projects: this.state.allProjects.filter((p) => p.status === status)
    });
  }

  filterProjectByCategory(category) {
    this.setState({
      projects: this.state.allProjects.filter((p) => p.category === category)
    });
  }
  removeFilter() {
    this.setState({
      projects: this.state.allProjects
    });
  }
  async componentDidMount() {
    isLoading(true);
    let response = null;
    if (AuthService.getUserRole() === "STUDENT")
      response = await ProjectService.getAllByStatus("FINISHED");
    else response = await ProjectService.getAll();

    if (response.error) {
      this.setAlert(response.error);
    } else {
      this.setState({
        allProjects: response.data.data,
        projects: response.data.data
      });
    }
    isLoading(false);
  }

  render() {
    const { statuses, categories, projects, alert, hasAlert } = this.state;
    return (
      <div className="admin-main">
        <div className="container-fluid p-1">
          <div className="row">
            <div className="col-12 text-center mb-2">
              <h3>Projects</h3>
            </div>
            <div className="col-md-12 my-2 ">
              <div className="card bg-transparent shadow">
                <div className="card-body">
                  <div className="pull-left">
                    <div className="d-flex">
                      {AuthService.getUserRole() === "EVALUATOR" ? (
                        <div>
                          <label htmlFor="status" className="text-body">
                            Status
                          </label>
                          <select
                            name="status"
                            id="status"
                            className="form-control"
                            onChange={(evt) => this.filterProjectByStatus(evt.target.value)}
                          >
                            {statuses.map((status, index) => (
                              <option value={status} key={index}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div></div>
                      )}
                      <div className="mx-1">
                        <label htmlFor="category" className="text-body">
                          Category
                        </label>
                        <select
                          name="category"
                          id="category"
                          className="form-control"
                          onChange={(evt) => this.filterProjectByCategory(evt.target.value)}
                        >
                          {categories.map((category, index) => (
                            <option value={category} key={index}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mx-1">
                        <label htmlFor="removeFilter"></label>
                        <input
                          type="button"
                          className="form-control"
                          onClick={this.removeFilter}
                          value="Remove Filter"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pull-right">
                    {AuthService.getUserRole() === "EVALUATOR" && (
                      <Link to="/approve-projects" className="btn btn-primary mx-2">
                        Approve Projects
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              {hasAlert && <Alert alert={alert} onClick={this.removeAlert} />}
            </div>
          </div>
          <div className="row">
            {projects &&
              projects.map((project) => (
                <div className="col-sm-6 col-md-4 mb-2" key={project._id}>
                  <ProjectCard project={project} />
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Projects;
