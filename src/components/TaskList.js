import {Link} from "react-router-dom";
import TaskService from "../services/TaskService";
import React, {useState} from "react";
import Alert from "./Alert/Alert";
import DateFormat from "../utils/DateFormat";
import isLoading from "../utils/LoadingUtil";

const DeleteBtn = ({_id, changeStatus, deleteTask, }) => {
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
                <button className="btn btn-danger btn-sm" type={"button"} onClick={()=>deleteTask()}>
                    <i className="fa fa-trash"></i>
                </button>
            </li>
        </>
    );
}
const TaskList = ({tasks, deleteTask}) => {
    const [alert,setAlert] = useState({});
    const [hasAlert, setHasAlert] = useState(false);

    const removeAlert = () => {
        setAlert(null);
        setHasAlert(false);
    }

    const changeStatus = async (taskId, status) =>{
        if(!status)
            return null;
        else {
            isLoading(true);
            console.log("tasks id:" + taskId + " status:" + status)
            let response = await TaskService.setStatus(taskId,status);
            if(response.error){
                setAlert(response.error);
            } else{
                tasks = [...tasks.forEach( t => {
                    if(t._id === taskId)
                        t = response.data.data;
                })];
                

                setAlert({
                    title:"Server Response",
                    message: response.data.message,
                    type:"success"
                });
            }
            isLoading(false);
        }
    }


    const delTask = async ( taskId) => {
        let del = window.confirm("Are you sure you want to delete this items");
        if( del){
            isLoading(true);
            let response = await TaskService.delete( taskId);
            if( response.error){
                setAlert(response.error);
                setHasAlert(true);
            } else {
                this.setState({
                    tasks : this.state.tasks.filter( m => m._id !== taskId)
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
    return (
        <table className="table table-bordered table-success">
            <thead className="bg-light text-dark">
            <tr>
                <th>#</th>
                <th>Task Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td colSpan="5">
                    {hasAlert && <Alert alert={alert} onClick={removeAlert}/>}
                </td>
            </tr>
            {tasks && tasks.map( task => (
                <tr key={task._id}>
                    <td>{task._id}</td>
                    <td>
                        {task.name} <br />
                        <small className="">{task?.description}</small>
                    </td>
                    <td>{DateFormat(task?.startDate).toDateString() || "--"}</td>
                    <td>{DateFormat(task?.endDate).toDateString() || "--"}</td>
                    <td>{task.status}</td>
                    <td className="text-center">
                        <ul className="list-inline">
                            <li className="list-inline-item">
                                <Link className="btn btn-outline-info btn-sm" to={`/task/${task._id}`}>
                                    <i className="fa fa-eye"></i>
                                </Link>
                            </li>
                            {deleteTask && <DeleteBtn _id={task._id} changeStatus={changeStatus} deleteTask={()=>delTask(task._id)}  />}
                        </ul>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default TaskList;