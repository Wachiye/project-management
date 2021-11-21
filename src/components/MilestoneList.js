import {Link} from "react-router-dom";
import MilestoneService from "../services/MilestoneService";
import React, {useState} from "react";
import Alert from "./Alert/Alert";
import DateFormat from "../utils/DateFormat";

const DeleteBtn = ({deleteMilestone, _id}) => {
    return(
        <>
        <li className="list-inline-item">
            <Link className="btn btn-primary btn-sm" to={`/edit-milestone/${_id}`}>
                <i className="fa fa-edit"></i>
            </Link>
        </li>
        <li className="list-inline-item">
            <button className="btn btn-danger btn-sm" type={"button"} onClick={()=>deleteMilestone()}>
                <i className="fa fa-trash"></i>
            </button>
        </li>
        </>
    );
}
const MilestoneList = ({milestones, deleteMilestone}) => {
    const [alert,setAlert] = useState({});
    const [hasAlert, setHasAlert] = useState(false);

    const removeAlert = () => {
        setAlert(null);
        setHasAlert(false);
    }

    const delMilestone = async ( milestoneId) => {
        let del = window.confirm("Are you sure you want to delete this items");
        if( del){
            let response = await MilestoneService.delete( milestoneId);
            if( response.error){
                setAlert(response.error);
                setHasAlert(true);
            } else {
                this.setState({
                    milestones : this.state.milestones.filter( m => m._id !== milestoneId)
                });
                setAlert({
                    title : 'Operation successful',
                    message: response.data.message,
                    type:"success"
                });
                setHasAlert(true);
            }
        }

    }
    return (
        <table className="table table-bordered">
            <thead className="bg-dark text-light">
            <tr>
                <th>#</th>
                <th>Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Tasks</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td colSpan="7">
                    {hasAlert && <Alert alert={alert} onClick={removeAlert}/>}
                </td>
            </tr>
            {milestones && milestones.map( milestone => (
                <tr key={milestone._id}>
                    <td>{milestone._id}</td>
                    <td>{milestone.name}</td>
                    <td>{ DateFormat(milestone.startDate)?.toDateString() || "--"}</td>
                    <td>{ DateFormat(milestone.endDate)?.toDateString() || "--"}</td>
                    <td>{milestone.status}</td>
                    <td>{milestone.tasks?.length}</td>
                    <td className="text-center">
                        <ul className="list-inline">
                            <li className="list-inline-item">
                                <Link className="btn btn-outline-info btn-sm" to={`/milestone/${milestone._id}`}>
                                    <i className="fa fa-eye"></i>
                                </Link>
                            </li>
                            {deleteMilestone && <DeleteBtn deleteMilestone={()=>delMilestone(milestone._id)} _id={milestone._id} />}
                        </ul>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default MilestoneList;