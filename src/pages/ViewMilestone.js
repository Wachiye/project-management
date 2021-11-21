import React, { Component} from "react";
import { Link } from "react-router-dom";
import Alert from "../components/Alert/Alert";
import MilestoneService from "../services/MilestoneService";
import TaskList from "../components/TaskList";

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

    async componentDidMount() {
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
    render() {
        let { milestone, hasAlert, alert } = this.state;
        return (
            <div className="admin-main">
                <div className="container-fluid p-1">
                    <div className="row">
                        <div className="d-flex justify-content-between align-items-center">
                            <Link to={`/project-milestones/${milestone?.project?._id}`} className="btn btn-sm btn-outline-secondary">All Milestones</Link>
                            <div className="card bg-transparent border-0">
                                <div className="card-body">
                                    <h4 className="card-title">{`Project: ${milestone?.project?.name}`}</h4>
                                    <h6 className="text-muted card-subtitle">{`Milestone: ${milestone?.name}`}</h6>
                                </div>
                            </div>
                            <Link to={`/new-task/${milestone?._id}`} className="btn btn-sm btn-primary">New Task</Link>
                        </div>
                        {hasAlert && <Alert alert={alert} />}
                        <div className="col-md-12">
                            <div className="card border-0">
                                <div className="card-body">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Start Date</th>
                                                <th>End Date</th>
                                                <th>Status</th>
                                                <th>Started On</th>
                                                <th>Finished On</th> 
                                                <th>Tasks</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td>{milestone?._id || '--'}</td>
                                            <td>{milestone?.startDate || '--'}</td>
                                            <td>{milestone?.endDate || '--'}</td>
                                            <td>{milestone?.status || '--'}</td>
                                            <td>{milestone?.startedOn || '--'}</td>
                                            <td>{milestone?.finishedOn || '--'}</td>
                                            <td>{milestone?.tasks?.length || '0'}</td>
                                            <td className="text-center">
                                                <ul className="list-inline">
                                                    <li className="list-inline-item">
                                                        <Link className="btn btn-primary btn-sm" to={`/edit-task/${milestone}`}>
                                                            <i className="fa fa-edit"></i>
                                                        </Link>
                                                    </li>
                                                    <li className="list-inline-item">
                                                        <button className="btn btn-danger btn-sm" type={"button"} >
                                                            <i className="fa fa-trash"></i>
                                                        </button>
                                                    </li>
                                                </ul>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
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
