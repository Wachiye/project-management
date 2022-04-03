import React, { Component } from "react";
import { Link } from "react-router-dom";
import ProjectFileCard from "../components/ProjectFileCard";

import ProjectService from "../services/ProjectService";
import FileService from "../services/FileService";
import Alert from "../components/Alert/Alert";
import ModalContainer from "../components/Modal/ModalContainer";
import NewFile from "../components/NewFile";
import isLoading from "../utils/LoadingUtil";

import { saveAs } from "file-saver";
import AuthService from "../services/AuthService";

class ProjectFiles extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projectId: this.props.match.params.projectId || null,
      files: [],
      alert: {},
      hasAlert: false,
      active: false
    };

    this.setAlert = this.setAlert.bind(this);
    this.removeAlert = this.removeAlert.bind(this);
    this.setActive = this.setActive.bind(this);
    this.getProjectFiles = this.getProjectFiles.bind(this);
    this.downloadFiles = this.downloadFiles.bind(this);
    this.canApproveFile = this.canApproveFile.bind(this);
    this.approveFile = this.approveFile.bind(this);
    this.isOwner = this.isOwner.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
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

  setActive(active) {
    this.setState({
      active
    });

    if (!active) this.getProjectFiles();
  }

  async getProjectFiles() {
    const projectId = this.props.match.params.projectId;
    const response = await ProjectService.getFiles(projectId);
    if (response.error) {
      this.setAlert(response.error);
    } else {
      this.setState({
        files: response.data?.data
      });
    }
  }

  async downloadFiles() {
    const { files } = this.state;

    if (files) {
      files.forEach((file) => {
        saveAs(file.fileURL, file.name);
      });
    } else {
      return null;
    }
  }

  async approveFile(fileId, status) {
    isLoading(true);
    const response = await FileService.setStatus(fileId, status);
    if (response.error) {
      this.setAlert(response.error);
    } else {
      this.setAlert({
        message: response.data.message,
        type: "success"
      });

      await this.getProjectFiles();
    }
    isLoading(false);
  }

  async deleteFile(fileId) {
    const del = window.confirm("Are you sure you want to delete this file");

    if (del) {
      isLoading(true);
      const response = await FileService.delete(fileId);
      if (response.error) {
        this.setAlert(response.error);
      } else {
        this.setAlert({
          message: response.data.message,
          type: "success"
        });
      }
      await this.getProjectFiles();
      isLoading(false);
    }
  }

  canApproveFile() {
    const email = AuthService.getUserEmail();
    const project = this.state.files[0]?.project || {};

    if (
      project &&
      (email === project?.evaluator?.user?.email || email === project?.supervisor?.user?.email)
    )
      return true;
    else return false;
  }
  isOwner() {
    const email = AuthService.getUserEmail();
    const project = this.state.files[0]?.project || {};

    if (project && email === project?.student?.user?.email) return true;
    else return false;
  }

  async componentDidMount() {
    isLoading(true);
    this.setState({
      projectId: this.props.match.params.projectId
    });
    await this.getProjectFiles();
    isLoading(false);
  }
  render() {
    const { projectId, files, alert, hasAlert, active } = this.state;
    return (
      <div className="admin-main">
        <div className="container-fluid p-1">
          <div className="row">
            <div className="col-12 mb-2">
              <div className="d-flex justify-content-between align-items-center">
                <Link to="/my-projects" className="btn btn-sm btn-outline-secondary">
                  My Projects
                </Link>
                <h3>Project Files</h3>
                <div>
                  {AuthService.getUserRole() === "STUDENT" && (
                    <>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => this.setActive(true)}
                      >
                        New File
                      </button>
                      <ModalContainer
                        id="new-comment"
                        title={"Upload Project file"}
                        active={active}
                        setActive={this.setActive}
                        size="lg"
                      >
                        <NewFile projectId={projectId} />
                      </ModalContainer>
                    </>
                  )}
                  <button className="btn btn-success mx-2" onClick={() => this.downloadFiles()}>
                    <i className="fa fa-download text-light"></i> Download All
                  </button>
                </div>
              </div>
            </div>
            <div className="col-12 mb-2">
              {hasAlert && <Alert alert={alert} onClick={this.removeAlert} />}
              <div className="card">
                <div className="row">
                  {files &&
                    files.map((file) => (
                      <div className="col-sm-6 col-md-4 mb-2" key={file?._id}>
                        <ProjectFileCard
                          file={file}
                          canApprove={this.canApproveFile()}
                          approveFileFun={this.approveFile}
                          canDelete={this.isOwner()}
                          deleteFileFun={this.deleteFile}
                        />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProjectFiles;
