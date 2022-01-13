import MilestoneService from "../services/MilestoneService";
import React, {useState} from "react";
import Alert from "./Alert/Alert";
import {shortDate} from "../utils/DateFormat";
import isLoading from "../utils/LoadingUtil";

import $ from 'jquery';
import TaskList from "./TaskList";
import AuthService from "../services/AuthService";
import ModalContainer from "./Modal/ModalContainer";
import NewTask from "../pages/NewTask";

const Milestone = ({milestone, _id, changeStatus, deleteMilestone, delMilestone}) => {
    const [active, setActive] = useState( false);

    const showHelp = (evt) =>{
        let targetId = evt.target.getAttribute("data-target");
        toggleClass('task-list', targetId);
    }

    const toggleClass = (groupClass, targetId) =>{
        $(`.${groupClass}`).removeClass('active');
        $(`#${targetId}`).toggleClass("active");
    }

    const isOwner = () =>{
        let email = AuthService.getUserEmail();
        if(email === milestone?.project?.student?.user?.email)
            return true;
        else
            return false;
    }

    return (
        <>
            <tr>
                <td>{milestone._id}</td>
                <td>{milestone.name}</td>
                <td>{ shortDate(milestone.startDate) || "--"}</td>
                <td>{ shortDate(milestone.endDate) || "--"}</td>
                <td>{milestone.status}</td>
                <td>{milestone.tasks?.length}</td>
                <td className="text-center">
                    <ul className="list-inline">
                        <li className="list-inline-item">
                            <button className="btn btn-outline-primary btn-sm" data-target={`tasks-list-${milestone._id}`} onClick={ (evt)=>showHelp(evt)}>
                                <i className="fa fa-plus"></i>
                            </button>
                        </li>
                        {deleteMilestone && <DeleteBtn deleteMilestone={()=>delMilestone(milestone._id)} _id={milestone._id} changeStatus={changeStatus} />}
                    </ul>
                </td>
            </tr>
            <tr>
                <td colSpan={7} >
                    <div id={`tasks-list-${milestone._id}`}  className="task-list">
                        <div className="card-title">
                            Milestone Tasks
                            <button className="btn btn-sm btn-success mx-3" onClick={ () => setActive(true)}>New Task</button>
                            <ModalContainer title={"Add New Task"} id={_id} active={active} setActive={setActive} size="md">
                                <NewTask milestoneId={_id} isModal={true} />
                            </ModalContainer>
                        </div>
                        {milestone.tasks && <TaskList tasks={milestone.tasks} deleteTask={isOwner} /> }
                    </div>
                </td>
            </tr>
        </>
    )
}
const DeleteBtn = ({deleteMilestone, changeStatus, _id}) => {
    return(
        <>
        <li className="list-inline-item">
            <select className="form-control form-control-sm" onChange={(evt)=> changeStatus(_id, evt.target.value)}>
                <option value="">Change Status</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="FINISHED">Finished</option>
            </select>
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
            isLoading(true);
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
            isLoading(false);
        }

    }

    const changeStatus = async (milestoneId, status) =>{
        if(!status)
            return null;
        else {
            isLoading(true);
            let response = await MilestoneService.setStatus(milestoneId,status);
            if(response.error){
                setAlert(response.error);
            } else{
                milestones.forEach( m => {
                    if(m._id === milestoneId)
                        m = response.data.data;
                });

                setAlert({
                    title:"Server Response",
                    message: response.data.message,
                    type:"success"
                });
            }
            isLoading(false);
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
                <Milestone key={milestone._id} milestone={milestone} _id={milestone._id}  changeStatus={changeStatus} delMilestone={delMilestone} deleteMilestone={deleteMilestone} /> 
            ))}
            </tbody>
        </table>
    );
}

export default MilestoneList;