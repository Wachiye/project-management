import React, { Component} from "react";
import MilestoneService from "../services/MilestoneService";
import Alert from "../components/Alert/Alert";
import StudentService from "../services/StudentService";
import AuthService from "../services/AuthService";
class NewMilestone extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            startDate:"",
            endDate:"",
            projectId:"",
            projects: [],
            
            currentIndex:0,
            currentProject:{},
            
            student:{},
            
            alert:{},
            hasAlert:false,
        };

        this.setAlert = this.setAlert.bind(this);
        this.removeAlert = this.removeAlert.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.setIndexAndProject = this.setIndexAndProject.bind(this);
        this.createMilestone = this.createMilestone.bind(this);
        this.getStudent = this.getStudent.bind(this);
    }

    handleChange(evt) {
        let value = evt.target.value;
        this.setState({
            ...this.state,
            [evt.target.name]: value,
        });
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
    setIndexAndProject(evt){
        this.setState({
            currentIndex: evt.target.value,
            currentProject: this.state.projects[evt.target.value]
        });
    }
    async createMilestone(){
        let { name, startDate, endDate, currentProject} = this.state;
        let data = {
            name: name,
            startDate: startDate,
            endDate: endDate,
            projectId: currentProject?._id,
        }

        let response = await MilestoneService.save(data);
        if(response.error){
            this.setAlert(response.error);
        }
        else{
            this.setAlert( {
                title : 'Operation successful',
                message: response.data.message,
                type:"success"
            });
        }
    }
    
    async componentDidMount() {
        await this.getStudent();
        this.setState({
            projects: this.state.student?.projects,
        });
    }
    
    render(){
        let {hasAlert, alert, projects, currentProject} = this.state;
        return(
            <div className="admin-main">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <div className="card bg-light border-info">
                                <div className="card-header bg-info d-flex flex-row justify-content-center align-items-center ">
                                    <h6 className="text align-content-center">
                                        CREATE NEW MILESTONE
                                    </h6>
                                </div>
                                <div className="card-body">
                                    {hasAlert && <Alert alert={alert} onClick={this.removeAlert}/>}
                                    <div className="form-group">
                                        <label htmlFor="projectId" className="form-label">Select Project</label>
                                        <select name="currentProject" id="currentProject" className="form-control" onChange={this.setIndexAndProject}>
                                            {projects && projects.map( (project, index) => (
                                                <option value={`${index}`} key={project._id}>{project.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="name" className="form-label">Milestone Name</label>
                                        <input type="text" className="form-control" id="name" name='name' onChange={this.handleChange}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="startDate" className="form-label">Start Date</label>
                                        <input type="date" className="form-control" id="startDate" name='startDate'
                                               min={currentProject?.startDate}  max={currentProject?.endDate}
                                               onChange={this.handleChange}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="endDate" className="form-label">End Date</label>
                                        <input type="date" className="form-control" id="endDate" name='endDate' onChange={this.handleChange}/>
                                    </div>
                                    {/*<div className="form-group">*/}
                                    {/*    <label htmlFor="status" className="form-label">Select Status</label>*/}
                                    {/*    <select name="status" id="status" className="form-control" onChange={this.handleChange}>*/}
                                    {/*        <option value="1">Status</option>*/}
                                    {/*        <option value="2">Status 2</option>*/}
                                    {/*        <option value="3">Status 3</option>*/}
                                    {/*        <option value="4">Status 4</option>*/}
                                    {/*    </select>*/}
                                    {/*</div>*/}
                                    <div className="my-2">
                                        <button className="btn btn-success" type="button" onClick={this.createMilestone}>Create Milestone</button>
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