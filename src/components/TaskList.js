import {Link} from "react-router-dom";
import TaskService from "../services/TaskService";
import React, {useState} from "react";
import Alert from "./Alert/Alert";

const DeleteBtn = ({deleteTask, _id}) => {
    return(
        <>
            <li className="list-inline-item">
                <Link className="btn btn-primary btn-sm" to={`/edit-task/${_id}`}>
                    <i className="fa fa-edit"></i>
                </Link>
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

    const delTask = async ( taskId) => {
        let del = window.confirm("Are you sure you want to delete this items");
        if( del){
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
                <th>Started On</th>
                <th>Finished On</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td colSpan="7">
                    {hasAlert && <Alert alert={alert} onClick={removeAlert}/>}
                </td>
            </tr>
            {tasks && tasks.map( task => (
                <tr key={task._id}>
                    <td>{task._id}</td>
                    <td>{task.name}</td>
                    <td>{task.startDate}</td>
                    <td>{task.endDate}</td>
                    <td>{task.status}</td>
                    <td>{task.startedOn}</td>
                    <td>{task.finishedOn}</td>
                    <td className="text-center">
                        <ul className="list-inline">
                            <li className="list-inline-item">
                                <Link className="btn btn-outline-info btn-sm" to={`/task/${task._id}`}>
                                    <i className="fa fa-eye"></i>
                                </Link>
                            </li>
                            {deleteTask && <DeleteBtn deleteTask={()=>delTask(task._id)} _id={task._id} />}
                        </ul>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default TaskList;