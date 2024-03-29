
import TaskService from "../services/TaskService";
import React, { Component} from "react";
import Alert from "./Alert/Alert";
import { shortDate } from "../utils/DateFormat";
import isLoading from "../utils/LoadingUtil";

class TaskList extends Component{
  constructor(props){
    super(props);

    this.state = {
      alert: null,
      hasAlert: false,
      tasks: this.props.tasks || [],
      deleteTask: this.props.deleteTask || false
    };

    this.setAlert = this.setAlert.bind(this);
    this.removeAlert = this.removeAlert.bind(this);
    this.changeStatusHandler = this.changeStatusHandler.bind(this);
    this.deleteTaskHandler = this.deleteTaskHandler.bind(this);
  }

  setAlert(alert) {
    this.setState({
      alert,
      hasAlert: true
    });
  }

  removeAlert() {
    this.setState({
      alert: null,
      hasAlert: false
    });
  }
  
  async changeStatusHandler(taskId, status){
    if (!status) return null;
    else {
      isLoading(true);
      const response = await TaskService.setStatus(taskId, status);
      if (response.error) {
        this.setAlert(response.error);
      } else {
        isLoading(false);
        window.reload();
        
      }
      isLoading(false);
    }
  };

  async deleteTaskHandler(taskId) {
    const del = window.confirm("Are you sure you want to delete this items");
    if (del) {
      isLoading(true);
      const response = await TaskService.delete(taskId);
      if (response.error) {
        this.setAlert(response.error);
      } else {
        isLoading(false);
        window.reload();
      }
      isLoading(false);
    }
    
  };

  render(){
    let {deleteTask, tasks, alert, hasAlert} = this.state;
    return (
      
      <table className="table table-bordered table-success">
        <thead className="bg-light text-dark">
          <tr>
            <th>#</th>
            <th>Task Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            {deleteTask && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="6">{hasAlert && <Alert alert={alert} onClick={this.removeAlert} />}</td>
          </tr>
          {tasks &&
            tasks.map((task) => (
              <tr key={task._id}>
                <td>{task._id}</td>
                <td>
                  {task.name} <br />
                  <small className="">{task?.description}</small>
                </td>
                <td>{shortDate(task?.startDate) || "--"}</td>
                <td>{shortDate(task?.endDate) || "--"}</td>
                <td>{task.status}</td>
                {deleteTask && (
                  <td className="text-center">
                    <ul className="list-inline">
                      <li className="list-inline-item">
                        <select
                          className="form-control form-control-sm"
                          onChange={(evt) => this.changeStatusHandler(task._id, evt.target.value)}
                        >
                          <option value="">Change Status</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="FINISHED">Finished</option>
                        </select>
                      </li>
                      <li className="list-inline-item">
                        <button className="btn btn-danger btn-sm" type={"button"} onClick={() => this.deleteTaskHandler(task._id)}>
                          <i className="fa fa-trash"></i>
                        </button>
                      </li>
                    </ul>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
    );
  }
}
// const TaskList = ({ tasks, deleteTask }) => {
//   const [alert, setAlert] = useState({});
//   const [hasAlert, setHasAlert] = useState(false);

//   const removeAlert = () => {
//     setAlert(null);
//     setHasAlert(false);
//   };

//   const DeleteBtn = ({ _id, changeStatus, deleteTask }) => {
//     return (
//       <>
//         <li className="list-inline-item">
//           <select
//             className="form-control form-control-sm"
//             onChange={(evt) => changeStatus(_id, evt.target.value)}
//           >
//             <option value="">Change Status</option>
//             <option value="IN_PROGRESS">In Progress</option>
//             <option value="FINISHED">Finished</option>
//           </select>
//         </li>
//         <li className="list-inline-item">
//           <button className="btn btn-danger btn-sm" type={"button"} onClick={() => deleteTask()}>
//             <i className="fa fa-trash"></i>
//           </button>
//         </li>
//       </>
//     );
//   };

//   const changeStatus = async (taskId, status) => {
//     if (!status) return null;
//     else {
//       isLoading(true);
//       const response = await TaskService.setStatus(taskId, status);
//       if (response.error) {
//         setAlert(response.error);
//       } else {
//         tasks.forEach((t) => {
//           if (t._id === taskId) 
//             t = response.data.data;
//         });
//         setAlert({
//           message: response.data.message,
//           type: "success"
//         });
//         setHasAlert(true);
//       }
//       isLoading(false);
//     }
//   };

//   const delTask = async (taskId) => {
//     const del = window.confirm("Are you sure you want to delete this items");
//     if (del) {
//       isLoading(true);
//       const response = await TaskService.delete(taskId);
//       if (response.error) {
//         setAlert(response.error);
//         setHasAlert(true);
//       } else {
//         tasks = [...tasks.filter((m) => m._id !== taskId)];
//         setAlert({
//           title: "Operation successful",
//           message: response.data.message,
//           type: "success"
//         });
//         setHasAlert(true);
//         setHasAlert(true);
//       }
      
//       isLoading(false);
//     }
    
//   };
//   return (
//     <table className="table table-bordered table-success">
//       <thead className="bg-light text-dark">
//         <tr>
//           <th>#</th>
//           <th>Task Name</th>
//           <th>Start Date</th>
//           <th>End Date</th>
//           <th>Status</th>
//           {deleteTask && <th>Action</th>}
//         </tr>
//       </thead>
//       <tbody>
//         <tr>
//           <td colSpan="6">{hasAlert && <Alert alert={alert} onClick={removeAlert} />}</td>
//         </tr>
//         {tasks &&
//           tasks.map((task) => (
//             <tr key={task._id}>
//               <td>{task._id}</td>
//               <td>
//                 {task.name} <br />
//                 <small className="">{task?.description}</small>
//               </td>
//               <td>{shortDate(task?.startDate) || "--"}</td>
//               <td>{shortDate(task?.endDate) || "--"}</td>
//               <td>{task.status}</td>
//               {deleteTask && (
//                 <td className="text-center">
//                   <ul className="list-inline">
//                     <DeleteBtn
//                       _id={task._id}
//                       changeStatus={changeStatus}
//                       deleteTask={() => delTask(task._id)}
//                     />
//                   </ul>
//                 </td>
//               )}
//             </tr>
//           ))}
//       </tbody>
//     </table>
//   );
// };

export default TaskList;
