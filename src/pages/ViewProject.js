import React, {Component, useState} from "react";
import { Link } from "react-router-dom";
import Alert from "../components/Alert/Alert";
import ProjectService from "../services/ProjectService";
import DateFormat from "../utils/DateFormat";
import AuthService from "../services/AuthService";
import StaffService from "../services/StaffService";
import ModalContainer from "../components/Modal/ModalContainer";
import NewComment from "../components/NewComment";
import isLoading from "../utils/LoadingUtil";
import TextToHTML from "../components/TextEditor/TextToHTML";

import {saveAs} from 'file-saver';

const EvaluatorActions =({project, supervisors, changeStatus, setSupervisor}) => {
  const [supervisorId, setSupervisorId] = useState(null);
  const [active, setActive] = useState(false);

  if(project?.evaluator?.user?.email === AuthService.getUserEmail()){
    return(
        <>
          {['WAITING_APPROVAL','REJECTED'].includes(project?.status) && (
              <>
                <button className="btn btn-success mx-1" onClick={() => changeStatus(project,'ACCEPTED')}>Accept</button>
                <button className="btn btn-danger" onClick={() => changeStatus( project,'REJECTED')}>Reject</button>
              </>
          )}
          <button className="btn btn-outline-secondary mx-1" onClick={()=>setActive(true)}>Comment</button>
          <ModalContainer id="new-comment" title={`Project: ${project?.name}`} active={active} setActive={setActive} size="md">
            <NewComment projectId={project?._id} />
          </ModalContainer>
          {['ACCEPTED','IN_PROGRESS'].includes(project?.status) && (
              <div className="input-group my-3">
                <div className="input-group-prepend">
                  <span className="input-group-text">Supervisors</span>
                </div>
                <select name="supervisor" id="supervisor" className="form-control form-control-sm" onChange={(evt)=>setSupervisorId(evt.target.value )}>
                  {supervisors && supervisors.map( (supervisor) => (
                      <option value={supervisor?._id} key={supervisor?._id}>{supervisor?.user?.firstName || "--"} {supervisor?.user?.lastName || "--"}</option>
                  ))}
                </select>
                <div className="input-group-append">
                    <span style={{cursor:"pointer", backgroundColor:"green", color:"white"}} className="input-group-text bg-success text-light" onClick={() => setSupervisor(project, supervisorId)}>Assign</span>
                </div>
              </div>
          )}
        </>
    );
  } else {
    return null;
  }
}
class ViewProject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      supervisor:[],
      projectId:  this.props.match.params.projectId,
      project: {},
      relatedProjects:[],
      alert:{},
      hasAlert: false
    };

    this.setAlert = this.setAlert.bind(this);
    this.removeAlert = this.removeAlert.bind(this);
    this.getSupervisors = this.getSupervisors(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.setSupervisor = this.setSupervisor.bind(this);
    this.getProject = this.getProject.bind(this);
    this.getProjectsByCategory = this.getProjectsByCategory.bind(this);
    this.downloadFiles = this.downloadFiles.bind(this);
  }

  setAlert(alert) {
    this.setState({
      alert: alert,
      hasAlert: true,
    });
  }

  removeAlert() {
    this.setState({
      alert: null,
      hasAlert: false,
    });
  }

  async getSupervisors(){
    let response = await StaffService.getAll();
    if(response.error){
      return null
    } else{
      this.setState({
        supervisors: response.data.data?.filter( supervisor => supervisor?.user?.role === 'SUPERVISOR')
      });
    }
  }

  async changeStatus(project, status){
    isLoading(true);
    let response = await ProjectService.setStatus(project?._id,status);
    if(response.error){
      this.setAlert(response.error);
    } else{
      this.setState({
        project: response.data.data
      });
      this.setAlert({
        title:"Server Response",
        message: response.data.message,
        type:"success"
      });
    }
    isLoading(false);
  }

  async setSupervisor(project, supervisorId){

    if(project?.evaluator?.user?.email === AuthService.getUserEmail()){
      let response = await ProjectService.setSupervisor(project?._id,supervisorId);
      if(response.error){
        this.setAlert(response.error);
      } else{
        this.setState({
          project: response.data.data
        });
        this.setAlert({
          title:"Server Response",
          message: response.data.message,
          type:"success"
        });
      }
    } else {
      this.setAlert({
        title:"Permission Denied",
        message:"Sorry, but only the project evaluator can a assign a supervisor to this project",
        type:"danger"
      });
    }
  }

  async getProjectsByCategory( category, id){
    let res = await ProjectService.getAllByCategory( category);
    this.setState({
      relatedProjects : res.data?.data?.filter( p => p._id !== id)
    });
  }

  async getProject(){
    let projectId = this.state.projectId;
    let response = await ProjectService.getOneById(projectId);

    if (response.error) {
      this.setAlert(response.error);
    } else {
      let project = response.data.data
      this.setState({
        project: project
      });
      await this.getProjectsByCategory( project.category, project._id);
    }
  }

  async downloadFiles(){
    let { projectFiles} = this.state.project;

    if(projectFiles){
      projectFiles.forEach(file => {
        saveAs( file.fileURL,file.name);
      });
    } else{
        return null;
    }
  }

  async componentDidMount() {
    isLoading(true);
    await this.getProject();
    isLoading(false);
  }

  render() {
    let { project, hasAlert, alert, supervisors, relatedProjects} = this.state;
    return (
      <div className="admin-main">
        <div className="container-fluid p-1">
          <div className="row">
            <div className="col-12 text-center mb-2">
              <h3>{project?.name}</h3>
            </div>
            {hasAlert && <Alert alert={alert} onClick={this.removeAlert}/>}
            <div className="col-md-8">
              <div className="card bg-transparent border-0">
                <div className="card-header bg-transparent my-2">
                  <div className="owner shadow p-2">
                    <h4 className="card-title text-primary">
                      By {project?.student?.user?.firstName} {project?.student?.user?.lastName }
                      <span className="text-muted">({project?.student?.regNo})</span>
                    </h4>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">
                        <i className="fa fa-envelope"></i>
                       <span className="mx-1">{project?.student?.user?.email} </span>
                      </span>
                      <span className="text-muted">{DateFormat(project?.startDate).getFullYear() || '--'}</span>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="card-text mb-1">
                    <h6 className="card-title text-success">Project Title</h6>
                    <p className="lead">{project?.name}</p>
                  </div>
                  <article className="card-text mb-1">
                    <h6 className="card-title text-success">
                      Project Description
                    </h6>
                    <TextToHTML text={project?.description} />
                  </article>
                  <div className="card-text mb-1">
                    <h6 className="card-title text-success">
                      Programming languages
                    </h6>
                    <p className="lead">{project?.languages}</p>
                  </div>
                  <div className="card-text mb-1">
                    <h6 className="card-title text-success">
                      Project Category
                    </h6>
                    <p className="lead">{project?.category}</p>
                  </div>
                </div>
                <div className="card-footer">
                  <button className="btn btn-success mx-2" onClick={() => this.downloadFiles()}>
                    <i className="fa fa-download text-light"></i> Download
                  </button>
                  <EvaluatorActions project={project} supervisors={supervisors} changeStatus={this.changeStatus} setSupervisor={this.setSupervisor}/>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="well bg-light p-2">
                <h4 className="text-primary">Related Projects</h4>
                <ul className="list-unstyled px-2">
                  {relatedProjects.map( project => (
                      <li key={project?._id}>
                        <Link to={`/projects/${project?._id}`} target={"_parent"}>{project.name}</Link>
                      </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ViewProject;
