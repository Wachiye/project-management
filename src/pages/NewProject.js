import React, { Component } from "react";
import ProjectService from "../services/ProjectService";
import Alert from "../components/Alert/Alert";
import { Link } from "react-router-dom";
import StaffService from "../services/StaffService";
import AuthService from "../services/AuthService";
import StudentService from "../services/StudentService";
import { shortDate } from "../utils/DateFormat";
import isLoading from "../utils/LoadingUtil";
import RichTextEditor from "../components/TextEditor/RichTextEditor";
import SettingService from "../services/SettingService";

class NewProject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      description: "",
      category: "",
      languages: "",
      startDate: "",
      endDate: "",
      studentId: "",
      evaluatorId: "",
      evaluators: [],
      project: this.props.project || null,
      alert: {},
      hasAlert: false,
      settings: []
    };

    this.setAlert = this.setAlert.bind(this);
    this.removeAlert = this.removeAlert.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setDescription = this.setDescription.bind(this);
    this.getThisYearProjectSettings = this.getThisYearProjectSettings.bind(this);
    this.getEvaluators = this.getEvaluators.bind(this);
    this.createOrEditProject = this.createOrEditProject.bind(this);
  }

  handleChange(evt) {
    const value = evt.target.value;
    this.setState({
      ...this.state,
      [evt.target.name]: value
    });
  }

  setDescription(description) {
    this.setState({
      description
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
  async getThisYearProjectSettings() {
    const thisYear = new Date().getFullYear();
    await SettingService.getAllByYear(thisYear).then((res) => {
      if (res.error) {
        this.setAlert(res.error);
      } else {
        this.setState({
          settings: res.data.data?.filter((s) => s.category === "PROJECT")[0] || null
        });
      }
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
        studentId: student?._id
      });
    }
  }

  async getEvaluators() {
    const response = await StaffService.getAll();
    if (response.error) {
      this.setAlert(response.error);
    } else {
      const evaluators = response.data.data.filter((staff) => staff.user?.role === "EVALUATOR");
      this.setState({
        evaluators
      });
    }
  }

  async createOrEditProject(edit = false) {
    isLoading(true);
    const {
      name,
      description,
      category,
      languages,
      startDate,
      endDate,
      studentId,
      evaluatorId,
      project
    } = this.state;
    const data = {
      name,
      description: description || project?.description,
      category: category || project?.category,
      languages: languages || project?.languages,
      startDate: startDate || project.startDate,
      endDate: endDate || project.endDate,
      studentId: studentId || project?.student?._id,
      evaluatorId: evaluatorId || project?.evaluator?._id
    };

    const response = edit
      ? await ProjectService.update(project?._id, data)
      : await ProjectService.save(data);

    if (response.error) {
      this.setAlert(response.error);
    } else {
      console.log({ response });
      this.setAlert({
        message: response.data.message,
        type: "success"
      });
    }
    isLoading(false);
  }

  async componentDidMount() {
    isLoading(true);
    await this.getThisYearProjectSettings();
    await this.getStudent();
    await this.getEvaluators();
    isLoading(false);
  }

  render() {
    const { hasAlert, alert, evaluators, project, settings } = this.state;
    return (
      <div className="admin-main">
        <div className={project === null ? "container" : "container-fluid"}>
          <div className="row">
            <div className={project === null ? "col-lg-8 m-auto" : "col-12"}>
              <div className={project === null ? "card bg-light border-success" : "card bg-light"}>
                {project === null ? (
                  <div className="card-header bg-success text-light d-flex flex-row justify-content-center align-items-center">
                    <h6 className="text align-content-center"> NEW PROJECT</h6>
                  </div>
                ) : null}
                <div className="card-body">
                  <div className={project === null ? "container" : "container-fluid"}>
                    <div className="row">
                      <div className="col-12">
                        {hasAlert && <Alert alert={alert} onClick={this.removeAlert} />}
                      </div>
                      <div className="col-lg-6 mb-2">
                        <h3 className="text-success mb-2">Basic Details</h3>

                        <div className="form-group">
                          <label htmlFor="name" className="form-label">
                            Project Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            placeholder="Enter Project Name"
                            defaultValue={project?.name}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="description" className="form-label">
                            Description
                          </label>
                          <RichTextEditor
                            text={project?.description}
                            height={350}
                            handleChangeFun={this.setDescription}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="evaluatorId" className="form-label">
                            Project Evaluator
                          </label>
                          <select
                            name="evaluatorId"
                            id="evaluatorId"
                            className="form-control"
                            onChange={this.handleChange}
                            defaultValue={project?.evaluator?._id}
                          >
                            <option value="">Select Evaluator</option>
                            {evaluators &&
                              evaluators.map((evaluator) => (
                                <option value={`${evaluator._id}`} key={evaluator._id}>
                                  {" "}
                                  {`${evaluator.user?.firstName} ${evaluator.user?.lastName}`}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-6 mb-2">
                        <h3 className="text-success mb-2">Other Details</h3>
                        <div className="form-group">
                          <label htmlFor="languages" className="form-label">
                            Programming Languages
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="languages"
                            name="languages"
                            defaultValue={project?.languages}
                            placeholder="Languages eg PHP, ReactJs"
                            onChange={this.handleChange}
                          />
                          <span className="form-text">Separate each language with a comma</span>
                        </div>
                        <div className="form-group">
                          <label htmlFor="category" className="form-label">
                            Project Category
                          </label>
                          <select
                            name="category"
                            id="category"
                            className="form-control"
                            onChange={this.handleChange}
                            defaultValue={project?.category}
                          >
                            <option value="">Select Category</option>
                            <option value="WEB_BASED">Web Based Application</option>
                            <option value="ANDROID">Android Application</option>
                            <option value="DESKTOP">Desktop Application</option>
                            <option value="SECURITY">Security</option>
                            <option value="NETWORKING">Networking</option>
                            <option value="OTHER">Other</option>
                          </select>
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
                            defaultValue={shortDate(project?.startDate)}
                            min={shortDate(settings?.startDate)}
                            max={shortDate(settings?.endDate)}
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
                            onChange={this.handleChange}
                            defaultValue={shortDate(project?.endDate)}
                            min={shortDate(settings?.startDate)}
                            max={shortDate(settings?.endDate)}
                          />
                        </div>
                      </div>
                      <div className="col-12 my-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <button
                            type="button"
                            id="btnProject"
                            name="btnProject"
                            className="btn btn-success btn-lg"
                            onClick={() => this.createOrEditProject(project !== null)}
                          >
                            Submit Project
                          </button>
                          <Link
                            to="/my-projects"
                            id="btnProjects"
                            name="btnProjects"
                            className="btn btn-outline-secondary btn-lg"
                          >
                            My Projects
                          </Link>
                        </div>
                      </div>
                    </div>
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

export default NewProject;
