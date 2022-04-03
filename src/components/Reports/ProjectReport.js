import React, { Component } from "react";
import AuthService from "../../services/AuthService";
import ProjectService from "../../services/ProjectService";
import SettingService from "../../services/SettingService";
import UserService from "../../services/UserService";
import isLoading from "../../utils/LoadingUtil";
import PrintProjectReport from "../PrintToPDF/PrintToPDF";

class ProjectReport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projectId: this.props.projectId || this.props.match.params.projectId,
      project: {},
      user: {},
      thisYearSettings: [],
      projectSetting: {},
      projects: this.props.projects || [],
      showProjects: this.props.showProjects || false,
      alert: {},
      hasAlert: false
    };

    this.setAlert = this.setAlert.bind(this);
    this.removeAlert = this.removeAlert.bind(this);
    this.setCurrentProject = this.setCurrentProject.bind(this);
    this.getProject = this.getProject.bind(this);
    this.getUser = this.getUser.bind(this);
    this.getThisYearSettings = this.getThisYearSettings.bind(this);
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

  async setCurrentProject(projectIndex) {
    this.setState({
      project: this.state.projects[projectIndex] || {}
    });
    await this.getThisYearSettings();
  }

  async getProject() {
    const projectId = this.state.projectId || this.props.match.params.projectId;
    const response = await ProjectService.getOneById(projectId);

    if (response.error) {
      this.setAlert(response.error);
    } else {
      const project = response.data.data;
      this.setState({
        project
      });
    }
  }

  async getUser() {
    await UserService.getOneByEmail(AuthService.getUserEmail())
      .then((response) => {
        this.setState({
          user: response.data?.data
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async getThisYearSettings() {
    const projectYear = new Date(this.state.project?.createdAt).getFullYear();

    await SettingService.getAllByYear(projectYear)
      .then((response) => {
        this.setState({
          thisYearSettings: response?.data?.data || [],
          projectSetting: response?.data?.data?.filter((s) => s.category === "PROJECT")[0] || null
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async componentDidMount() {
    isLoading(true);
    await this.getProject();
    await this.getUser();
    await this.getThisYearSettings();
    isLoading(false);
  }

  render() {
    const { projects, showProjects, project, user, thisYearSettings, projectSetting } = this.state;
    return (
      <div className="admin-main">
        <div className="mb-2">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              {showProjects && (
                <div className="form-group">
                  <label htmlFor="projectId" className="form-label">
                    Select Project
                  </label>
                  <select
                    name="projectId"
                    id="projectId"
                    className="form-control"
                    onChange={(evt) => this.setCurrentProject(evt.target.value)}
                  >
                    {projects.map((project, index) => (
                      <option value={index} key={index}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <h3>Project Report</h3>
            <div></div>
          </div>
        </div>
        <PrintProjectReport
          project={project}
          user={user}
          thisYearSettings={thisYearSettings}
          projectSetting={projectSetting}
        />
      </div>
    );
  }
}

export default ProjectReport;
