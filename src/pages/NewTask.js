import React, { Component} from "react";
import TaskService from "../services/TaskService";
import Alert from "../components/Alert/Alert";
import {Link} from "react-router-dom";
import MilestoneService from "../services/MilestoneService";

class NewTask extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            description:"",
            startDate:"",
            endDate:"",
            milestoneId:this.props.match.params.milestoneId,
            milestoneName:"",
            projectName:"",
            milestone:{},
            alert:{},
            hasAlert:false,
        };

        this.setAlert = this.setAlert.bind(this);
        this.removeAlert = this.removeAlert.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getMilestone = this.getMilestone.bind(this);
        this.createTask = this.createTask.bind(this);
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

    async getMilestone(){
        let response = await MilestoneService.getOneById( this.state.milestoneId);

        if(response.error){
            this.setAlert(response.error);
        }
        else{
            this.setState({
                milestone : response.data?.data,
                milestoneName: response.data?.data?.name,
                projectName: response.data?.data?.project?.name
            });
        }
    }

    async createTask(){
        let { name, description, startDate, endDate, milestoneId} = this.state;
        let data = {
            name: name,
            description: description,
            startDate: startDate,
            endDate: endDate,
            milestoneId: milestoneId
        }

        let response = await TaskService.save(data);

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

    async componentDidMount(){
        let _id = this.props.match.params.milestoneId;
        this.setState({
            milestoneId:_id
        });
        await this.getMilestone();
    }

    render(){
        let {hasAlert, alert, milestone, projectName, milestoneName} = this.state;
        return(
            <div className="admin-main">
                <div className="container">
                    <div className="row">
                        <div className="col-12 mb-2">
                            <div className="d-flex justify-content-between align-items-center">
                                <Link to={`/project-tasks/${milestone?._id}`} className="btn btn-sm btn-outline-secondary">All Tasks</Link>
                                <h3>CREATE NEW PROJECT TASK</h3>
                                <Link to={`/project-milestones/${milestone.project?._id}`} className="btn btn-sm btn-primary">Milestones</Link>
                            </div>
                        </div>
                        <div className="col-md-8 m-auto">
                            <div className="card bg-light border-success">
                                <div className="card-header">
                                    <h4 className="text-muted">Project: {projectName}</h4>
                                    <h6 className="text-muted">Milestone: {milestoneName}</h6>
                                </div>
                                <div className="card-body">
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-12">
                                                {hasAlert && <Alert alert={alert} onClick={this.removeAlert}/>}
                                            </div>
                                            <div className="col-md-6 mb-2">
                                                <h3 className="text-success mb-2">Basic Details</h3>

                                                <div className="form-group">
                                                    <label htmlFor="name" className="form-label">Task Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="name"
                                                        name="name"
                                                        placeholder="Enter Task Name"
                                                        onChange={this.handleChange}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="description" className="form-label">Description</label>
                                                    <textarea className="form-control" id="description" name="description" rows="5"
                                                              placeholder="Long Description"
                                                              onChange={this.handleChange}
                                                    ></textarea>
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-2">
                                                <h3 className="text-success mb-2">Other Details</h3>
                                                <div className="form-group">
                                                    <label htmlFor="startDate" className="form-label">Start Date</label>
                                                    <input type="date" className="form-control" id="startDate" name="startDate" onChange={this.handleChange}/>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="endDate" className="form-label">End Date</label>
                                                    <input type="date" className="form-control" id="endDate" name="endDate" onChange={this.handleChange}/>
                                                </div>
                                            </div>
                                            <div className="col-12 my-2">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <button type="button" id="btnTask" name="btnTask" className="btn btn-success btn-lg" onClick={this.createTask}>Submit Task</button>
                                                    <Link to={`/project-tasks/${milestone?._id}`} id="btnTasks" name="btnTasks" className="btn btn-outline-secondary btn-lg">All Tasks</Link>
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

export default NewTask;