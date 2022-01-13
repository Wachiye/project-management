import React, { Component} from "react";
import { Link } from "react-router-dom";
import Alert from "../components/Alert/Alert";
import MilestoneService from "../services/MilestoneService";
import TaskList from "../components/TaskList";
import {shortDate} from "../utils/DateFormat";
import isLoading from "../utils/LoadingUtil";

const Milestone = ({milestone}) => {
    return (
        <div className="mb-2 p-2">
            <table className="table">
                <thead>
                <tr>
                    <th colSpan="2">Milestone Details</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th>Name</th>
                    <td>{milestone.name}</td>
                </tr>
                <tr>
                    <th>Created On</th>
                    <td>{ shortDate(milestone.createdAt)}</td>
                </tr>
                <tr>
                    <th>Expected Start Date</th>
                    <td>{ shortDate(milestone.startDate)}</td>
                </tr>
                <tr>
                    <th>Status</th>
                    <td>{milestone.status}</td>
                </tr>
                <tr>
                    <th>Project</th>
                    <td>{milestone?.project?.name}</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}

class ViewMilestone extends Component {
    constructor(props) {
        super(props);

        this.state = {
            milestoneId: this.props.match.params.milestoneId,
            milestone: {},
            alert:{},
            hasAlert: false
        };

        this.setAlert = this.setAlert.bind(this);
        this.removeAlert = this.removeAlert.bind(this);
        this.getMilestone = this.getMilestone.bind(this);
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
        let milestoneId = this.props.match.params.milestoneId;
        let response = await MilestoneService.getOneById(milestoneId);

        if (response.error) {
            this.setAlert(response.error);
        } else {
            this.setState({
                milestone: response.data.data,
            });
        }
    }
    async componentDidMount() {
        isLoading(true);
        await this.getMilestone();
        isLoading(false);
    }
    
    render() {
        let { milestone, hasAlert, alert } = this.state;
        return (
            <div className="admin-main">
                <div className="container-fluid p-1">
                    <div className="row">
                        <div className="d-flex justify-content-between align-items-center">
                            <Link to={`/projects/${milestone?.project?._id}/milestones`} className="btn btn-sm btn-outline-secondary">All Milestones</Link>
                            <div className="card bg-transparent border-0">
                                <div className="card-body">
                                    <h4 className="card-title">{`Project: ${milestone?.project?.name}`}</h4>
                                    <h6 className="text-muted card-subtitle">{`Milestone: ${milestone?.name}`}</h6>
                                </div>
                            </div>
                            <Link to={`/new-task/${milestone?._id}`} className="btn btn-sm btn-primary">New Task</Link>
                        </div>
                        {hasAlert && <Alert alert={alert} onClick={this.removeAlert}/>}
                        <div className="col-md-12">
                            <div className="card border-0">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <Milestone milestone={milestone} />
                                        </div>
                                    </div>
                                    <div className="milestone-tasks">
                                        <h5 className="card-title">Milestone Tasks</h5>
                                        {milestone.tasks && <TaskList tasks={milestone.tasks} /> }
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

export default ViewMilestone;
