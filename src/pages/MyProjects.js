import React, {Component, useState} from 'react';
import ProjectService from "../services/ProjectService";
import AuthService from "../services/AuthService";
import Alert from "../components/Alert/Alert";
import {Link} from "react-router-dom";
import DateFormat from "../utils/DateFormat";
import StaffService from "../services/StaffService";
import NewProject from "./NewProject";
import ModalContainer from "../components/Modal/ModalContainer";
import UserService from "../services/UserService";
import isLoading from "../utils/LoadingUtil";
import {saveAs} from 'file-saver';

const StudentActions =({project, student, changeStatus, deleteProject}) => {
    const [status, setStatus] = useState(null);

    const statuses = [{
        name: "IN_PROGRESS",
        displayName :"In Progress"
        }, {
        name: "FINISHED",
        displayName : "Finished"
    }];

    if(student?.user?.email === AuthService.getUserEmail()){
        return(
            <>
                <button className="btn btn-danger" onClick={() => deleteProject()}>Delete</button>
                <button className="btn btn-outline-secondary mx-1">Comment</button>
                {['ACCEPTED','IN_PROGRESS'].includes(project?.status) && (
                    <div className="input-group my-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Change Status</span>
                        </div>
                        <select name="supervisor" id="supervisor" className="form-control form-control-sm" onChange={(evt)=>setStatus(evt.target.value )}>
                            {statuses && statuses.map( (s, index) => (
                                <option value={s.name} key={index}>{s.displayName}</option>
                            ))}
                        </select>
                        <div className="input-group-append">
                            <span style={{cursor:"pointer", backgroundColor:"green", color:"white"}} className="input-group-text bg-success text-light" onClick={() => changeStatus(project, status)}>Update</span>
                        </div>
                    </div>
                )}
            </>
        );
    } else {
        return null;
    }
}
const Project = ({project, changeStatus, deleteProject}) => {
    return (
        <div className="mb-2 p-2">
            <table className="table">
                <thead>
                <tr>
                    <th colSpan="2">Project Details</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th>Name</th>
                    <td>{project.name}</td>
                </tr>
                <tr>
                    <th>Description</th>
                    <td>
                        <div className="lead" dangerouslySetInnerHTML={{__html:project?.description}} />
                    </td>
                </tr>
                <tr>
                    <th>Languages</th>
                    <td>{project.languages}</td>
                </tr>
                <tr>
                    <th>Category</th>
                    <td>{project.category}</td>
                </tr>
                <tr>
                    <th>Student</th>
                    <td>{project?.student?.user?.fullName}</td>
                </tr>
                <tr>
                    <th>Evaluator</th>
                    <td>{project?.evaluator?.user?.fullName}</td>
                </tr>
                <tr>
                    <th>Supervisor</th>
                    <td>{project?.supervisor?.user?.fullName || "--"}</td>
                </tr>
                <tr>
                    <td colSpan={2}>
                        <StudentActions project={project} student={project?.student} changeStatus={changeStatus} deleteProject={deleteProject}/>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}


class MyProjects extends Component{
    constructor(props) {
        super(props);

        this.state = {
            allProjects:[],
            projects:[],
            currentIndex:0,
            currentProject:{},
            projectId:null,
            user:{},
            staff:{},
            alert:{},
            hasAlert:false,
            active:false
        }

        this.setAlert = this.setAlert.bind(this);
        this.removeAlert = this.removeAlert.bind(this);
        this.setActive = this.setActive.bind(this);
        this.getAllProjects = this.getAllProjects.bind(this);
        this.getUserByEmail = this.getUserByEmail.bind(this);
        this.getStaff = this.getStaff.bind(this);
        this.setProjectId = this.setProjectId.bind(this);
        this.loadProject = this.loadProject.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
        this.downloadFiles = this.downloadFiles.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
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

    setActive(active){
        this.setState({
            active:active
        });

        if(!active)
            this.getAllProjects();
    }

    async getAllProjects (){
        let response = await ProjectService.getAll();

        if(response.error){
            this.setAlert(response.error);
        }
        else{

            this.setState({
                allProjects : response.data.data
            });
        }
    }

    async getUserByEmail(email){
        let response = await UserService.getOneByEmail( email)

        if(response.error){
            return null;
        }
        else{
            return response?.data?.data;
        }
    }

    async getStaff( id){
        let response = await StaffService.getOneById(id);

        if(response.error){
            return null;
        }
        else{
            return response?.data?.data;
        }
    }
    async setProjectId(evt){
        this.setState({
            currentIndex: evt.target.value,
            currentProject: this.state.projects[evt.target.value]
        });
        // this.state.currentProject["evaluator"] = await this.getStaff( this.state.currentProject?.evaluatorId);
        // this.state.currentProject["supervisor"] = await this.getStaff( this.state.currentProject?.supervisorId);
    }

    loadProject(){
        this.setState({
            currentProject: this.state.projects[this.state.currentIndex]
        });

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

    async downloadFiles(){
        let { currentProject} = this.state;
        let projectFiles = currentProject?.projectFiles || [];

        if(projectFiles){
            projectFiles.forEach(file => {
                saveAs( file.fileURL,file.name);
            });
        } else{
            return null;
        }
    }

    async deleteProject(){
        isLoading(true);
        let response = await ProjectService.delete( this.state.projects[this.state.currentIndex]._id);
        if( response.error){
            this.setAlert(response.error);
        } else {
            this.setState({
                projects : this.state.projects.filter( p => p._id !== this.state.projectId)
            });

            this.setAlert({
                title : 'Operation successful',
                message: response.data.message,
                type:"success"
            });
        }
        isLoading(false);
    }

    async componentDidMount(){
        isLoading(true);
        let userRole = AuthService.getUserRole();
        let userEmail = AuthService.getUserEmail();

        let user = await  this.getUserByEmail( userEmail);

        await this.getAllProjects();

        if( userRole === 'EVALUATOR'){
            this.setState({
                projects: this.state.allProjects.filter( p => p.evaluator?.user?.email === userEmail)
            })
        } else if( userRole === 'SUPERVISOR'){
            this.setState({
                projects: this.state.allProjects.filter( p => p.supervisor?.user?.email === userEmail)
            })
        } else if( userRole === 'STUDENT'){
            this.setState({
                projects: this.state.allProjects.filter( p => p.student?.user?.email === userEmail)
            });
        } else {
            this.setState({
                projects: this.state.allProjects
            })
        }

        this.setState({
            projectId: 0,
            user: user,
            currentProject: this.state.projects[0]
        });

        this.loadProject();

        isLoading(false);
    }
    render() {
        let { alert, hasAlert, active, projects, currentProject, user} = this.state;
        return(
            <div className="admin-main">
                <div className="container-fluid p-1">
                    <div className="row">
                        <div className="col-12 mb-2">
                            <div className="d-flex justify-content-between align-items-center">
                                <Link to="/projects" className="btn btn-sm btn-outline-secondary">All Projects</Link>
                                <h3>My Projects</h3>
                                {  user?.role === 'STUDENT' ? (
                                <Link to="/new-project" className="btn btn-sm btn-primary">New Project</Link>
                                ): <div> </div>}
                            </div>
                        </div>
                        <div className="col-12 mb-2">
                            <div className="card bg-light shadow">
                                <div className="card-body">
                                    <h4 className="text-body">Select Project</h4>
                                    <div className="btn-group">
                                        <select name="currentProject" id="currentProject" className="form-control" onChange={this.setProjectId}>
                                            {projects && projects.map( (project, index) => (
                                                <option value={`${index}`} key={project._id}>{project.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="pull-right">
                                        {  user?.role === 'STUDENT' ? (
                                            <>
                                                <Link className="btn btn-secondary mx-2" to="/new-milestone/">
                                                    <i className="fa fa-plus"></i>
                                                    <span className="mx-1">New Milestone</span>
                                                </Link>
                                                <button className="btn btn-primary mx-2" onClick={()=>this.setActive(true)}>
                                                    <i className="fa fa-edit"></i>
                                                </button>
                                                <ModalContainer id="new-project-container" title={`Edit Project: ${currentProject?.name}`} active={active} setActive={this.setActive} size="lg">
                                                    <NewProject project={currentProject} />
                                                </ModalContainer>
                                            </>
                                        ): <div> </div>}

                                        <button className="btn btn-success mx-2" onClick={() => this.downloadFiles()}>
                                            <i className="fa fa-download text-light"></i>
                                        </button>
                                        {  user?.role === 'STUDENT' ? (
                                            <button className="btn btn-danger" onClick={this.deleteProject}>
                                                <i className="fa fa-trash text-light"></i>
                                            </button>
                                        ): null}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {hasAlert && <Alert alert={alert} onClick={this.removeAlert} />}
                        <div className="col-12 my-2">
                            <ul className="nav nav-tabs">
                                <li className="nav-item">
                                    <Link className="nav-link active" data-toggle="tab" to="#details">Details</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" data-toggle="tab" to={`/projects/${currentProject?._id}/milestones`}>Milestones</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" data-toggle="tab" to={`/projects/${currentProject?._id}/files`}>Files</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" data-toggle="tab" to={`/projects/${currentProject?._id}/comments`}>Comments</Link>
                                </li>
                            </ul>
                            <div className="tab-content">
                                <div className="tab-pane container active" id="details">
                                    <div className="row">
                                        <div className="col-md-8 mb-2 py-1">
                                            {currentProject && <Project project={currentProject} changeStatus={this.changeStatus} deleteProject={this.deleteProject} />}
                                        </div>
                                        <div className="col-md-4">
                                            <div className="card bg-light border-info">
                                                <div className="card-header bg-info">
                                                    <h5 className="text-light">Quick Stats</h5>
                                                </div>
                                                <div className="card-body">
                                                    <ul className="list-group list-group-flush">
                                                        <li className="list-group-item">
                                                            <span className="mx-1">Start Date</span>: <span className="pull-right">{DateFormat(currentProject?.startDate).toDateString()}</span>
                                                        </li>
                                                        <li className="list-group-item">
                                                            <span className="mx-1">End Date</span>: <span className="pull-right">{DateFormat(currentProject?.endDate).toDateString()}</span>
                                                        </li>
                                                        <li className="list-group-item">
                                                            <span className="mx-1">Status</span>: <span className="pull-right">{currentProject?.status}</span>
                                                        </li>
                                                        <li className="list-group-item">
                                                            <span className="mx-1">Milestones</span>: <span className="pull-right">{currentProject?.milestones?.length || 0}</span>
                                                        </li>
                                                        <li className="list-group-item">
                                                            <span className="mx-1">Time frame(days)</span>: <span className="pull-right">{currentProject?.projectDays || 0}</span>
                                                        </li>
                                                        <li className="list-group-item">
                                                            <span className="mx-1">Time left(days)</span>: <span className="pull-right">{currentProject?.daysLeft}</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/*<div className="tab-pane container fade" id="milestones">*/}
                                {/*    <h4 className="text-primary">Project Milestones</h4>*/}
                                {/*    {currentProject?.milestones &&  <MilestoneList milestones={currentProject?.milestones} /> }*/}
                                {/*</div>*/}
                                {/*<div className="tab-pane container fade" id="files">*/}
                                {/*    <h4 className="text-primary">Project Files</h4>*/}
                                {/*</div>*/}
                                {/*<div className="tab-pane container fade" id="comments">*/}
                                {/*    <h4 className="text-primary">Project Comments</h4>*/}
                                {/*</div>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MyProjects;