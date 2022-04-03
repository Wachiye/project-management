import React, { Component } from "react";
import MilestoneService from "../services/MilestoneService";
import Alert from "../components/Alert/Alert";
import StudentService from "../services/StudentService";
import AuthService from "../services/AuthService";
import { shortDate } from "../utils/DateFormat";
import isLoading from "../utils/LoadingUtil";

class NewMilestone extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      startDate: "",
      endDate: "",
      projectId: this.props.projectId || "",
      projects: [],

      currentIndex: 0,
      currentProject: {},

      student: {},

      alert: {},
      hasAlert: false,
      isModal: this.props.isModal || false
    };

    this.setAlert = this.setAlert.bind(this);
    this.removeAlert = this.removeAlert.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setIndexAndProject = this.setIndexAndProject.bind(this);
    this.createMilestone = this.createMilestone.bind(this);
    this.getStudent = this.getStudent.bind(this);
  }

  handleChange(evt) {
    const value = evt.target.value;
    this.setState({
      ...this.state,
      [evt.target.name]: value
    });
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
  async getStudent() {
    const response = await StudentService.getAll();

    if (response.error) {
      this.setAlert(response.error);
    } else {
      const student = response.data.data.filter(
        (std) => std.user?.email === AuthService.getUserEmail()
      )[0];

      this.setState({
        student
      });
    }
  }
  setIndexAndProject(evt) {
    this.setState({
      currentIndex: evt.target.value,
      currentProject: this.state.projects[evt.target.value]
    });
  }
  async createMilestone() {
    isLoading(true);
    const { name, startDate, endDate, currentProject } = this.state;
    const data = {
      name,
      startDate,
      endDate,
      projectId: currentProject?._id
    };

    const response = await MilestoneService.save(data);
    if (response.error) {
      this.setAlert(response.error);
    } else {
      this.setAlert({
        title: "Operation successful",
        message: response.data.message,
        type: "success"
      });
    }
    isLoading(false);
  }

  async componentDidMount() {
    isLoading(true);
    await this.getStudent();
    this.setState({
      projects: this.state.student?.projects,
      currentProject: this.state.student?.projects[0] || {}
    });
    isLoading(false);
  }

  render() {
    const { hasAlert, alert, projects, currentProject, projectId, isModal } = this.state;
    return (
      <div className="admin-main">
        <div className="container">
          <div className="row">
            <div className={isModal ? "col-12" : "col-md-8 m-auto"}>
              <div className="card bg-light border-info">
                {!isModal && (
                  <div className="card-header bg-info d-flex flex-row justify-content-center align-items-center ">
                    <h6 className="text align-content-center">CREATE NEW MILESTONE</h6>
                  </div>
                )}
                <div className="card-body">
                  {hasAlert && <Alert alert={alert} onClick={this.removeAlert} />}
                  <div className="form-group">
                    <label htmlFor="projectId" className="form-label">
                      Select Project
                    </label>
                    <select
                      name="currentProject"
                      id="currentProject"
                      className="form-control"
                      onChange={this.setIndexAndProject}
                      defaultValue={projectId}
                    >
                      {projects &&
                        projects.map((project, index) => (
                          <option value={`${index}`} key={project._id}>
                            {project.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      Milestone Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="startDate" className="form-label">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="startDate"
                      name="startDate"
                      min={shortDate(currentProject?.startDate)}
                      max={shortDate(currentProject?.endDate)}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="endDate" className="form-label">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="endDate"
                      name="endDate"
                      min={shortDate(currentProject?.startDate)}
                      max={shortDate(currentProject?.endDate)}
                      onChange={this.handleChange}
                    />
                  </div>
                  {/*<div className="form-group">*/}
                  {/*    <label htmlFor="status" className="form-label">Select Status</label>*/}
                  {/*    <select name="status" id="status" className="form-control" onChange={this.handleChange}>*/}
                  {/*        <option value="PENDING">Pending</option>*/}
                  {/*        <option value="IN_PROGRESS">In Progress</option>*/}
                  {/*        <option value="FINISHED">Finished</option>*/}
                  {/*    </select>*/}
                  {/*</div>*/}
                  <div className="my-2">
                    <button
                      className="btn btn-success"
                      type="button"
                      onClick={this.createMilestone}
                    >
                      Create Milestone
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NewMilestone;
