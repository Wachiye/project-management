import React,{Component} from 'react';
import ProjectService from "../services/ProjectService";
import StudentService from "../services/StudentService";
import AuthService from "../services/AuthService";
import Alert from "../components/Alert/Alert";
import {Link} from "react-router-dom";
import DateFormat from "../utils/DateFormat";
import StaffService from "../services/StaffService";

const Project = ({project, student}) => {
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
                    <td>{project.description}</td>
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
                    <td>{`${student?.user?.firstName} ${student?.user?.lastName}`}</td>
                </tr>
                <tr>
                    <th>Evaluator</th>
                    <td>{`${project?.evaluator?.user?.firstName} ${project?.evaluator?.user?.lastName}`}</td>
                </tr>
                <tr>
                    <th>Supervisor</th>
                    <td>{project?.supervisor?.user?.firstName || "--"} {project?.supervisor?.user?.lastName || "--"}</td>
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
            projects:[],
            currentIndex:0,
            currentProject:{},
            projectId:null,
            student:{},
            alert:{},
            hasAlert:false
        }

        this.setAlert = this.setAlert.bind(this);
        this.removeAlert = this.removeAlert.bind(this);
        this.getStudent = this.getStudent.bind(this);
        this.getStaff = this.getStaff.bind(this);
        this.setProjectId = this.setProjectId.bind(this);
        this.loadProject = this.loadProject.bind(this);
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

    async getStudent(){
        let response = await StudentService.getAll();

        if(response.error){
            this.setAlert(response.error);
        }
        else{
            let student = response.data.data.filter( std => (
                std.user?.email === AuthService.getUserEmail()
            ))[0];

            this.setState({
                student : student
            });

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
        this.state.currentProject["evaluator"] = await this.getStaff( this.state.currentProject?.evaluatorId);
        this.state.currentProject["supervisor"] = await this.getStaff( this.state.currentProject?.supervisorId);
    }

    loadProject(){
        this.setState({
            currentProject: this.state.projects[this.state.currentIndex]
        });

    }

    async deleteProject(){
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
    }

    async componentDidMount(){
        await this.getStudent();

        this.setState({
            projects: this.state.student?.projects,
            projectId: 0,
            currentProject: this.state.projects[0]
        });
        this.loadProject();
        this.state.currentProject["evaluator"] = await this.getStaff( this.state.currentProject?.evaluatorId);
        this.state.currentProject["supervisor"] = await this.getStaff( this.state.currentProject?.supervisorId);
    }
    render() {
        let { alert, hasAlert, projects, currentProject, student} = this.state;
        return(
            <div className="admin-main">
                <div className="container-fluid p-1">
                    <div className="row">
                        <div className="col-12 mb-2">
                            <div className="d-flex justify-content-between align-items-center">
                                <Link to="/projects" className="btn btn-sm btn-outline-secondary">All Projects</Link>
                                <h3>My Projects</h3>
                                <Link to="/new-project" className="btn btn-sm btn-primary">New Project</Link>
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
                                        <Link className="btn btn-secondary mx-2" to="/new-milestone/">
                                            <i className="fa fa-plus"></i>
                                            <span className="mx-1">New Milestone</span>
                                        </Link>
                                        <Link className="btn btn-primary mx-2" to={`/edit-project/${currentProject?._id}`}>
                                            <i className="fa fa-edit"></i>
                                        </Link>
                                        <button className="btn btn-success mx-2">
                                            <i className="fa fa-download text-light"></i>
                                        </button>
                                        <button className="btn btn-danger" onClick={this.deleteProject}>
                                            <i className="fa fa-trash text-light"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {hasAlert && <Alert alert={alert} />}
                        <div className="col-12 my-2">
                            <ul className="nav nav-tabs">
                                <li className="nav-item">
                                    <Link className="nav-link active" data-toggle="tab" to="#details">Details</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" data-toggle="tab" to={`/project-milestones/${currentProject?._id}`}>Milestones</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" data-toggle="tab" to={`/project-files/${currentProject?._id}`}>Files</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" data-toggle="tab" to={`/projects-comments/${currentProject?._id}`}>Comments</Link>
                                </li>
                            </ul>
                            <div className="tab-content">
                                <div className="tab-pane container active" id="details">
                                    <div className="row">
                                        <div className="col-md-8 mb-2 py-1">
                                            {currentProject && <Project project={currentProject} student={student} />}
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
                                                            <span className="mx-1">Tasks</span>: <span className="pull-right">{currentProject?.tasks}</span>
                                                        </li>
                                                        <li className="list-group-item">
                                                            <span className="mx-1">Tasks</span>: <span className="pull-right">{currentProject?.ongoingTasks}</span>
                                                        </li>
                                                        <li className="list-group-item">
                                                            <span className="mx-1">Started On</span>: <span className="pull-right">{DateFormat(currentProject?.startedOn)?.toDateString() || "--"}</span>
                                                        </li>
                                                        <li className="list-group-item">
                                                            <span className="mx-1">Finished On</span>: <span className="pull-right">{DateFormat(currentProject?.finishedOn)?.toDateString() || "--"}</span>
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