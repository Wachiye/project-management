import React, { Component } from "react";
import { Link} from "react-router-dom";
import Alert from "../components/Alert/Alert";
import StudentService from "../services/StudentService";
import StaffService from "../services/StaffService";
import AuthService from "../services/AuthService";
import UserList from "../components/UserList";
import UserService from "../services/UserService";
import isLoading from "../utils/LoadingUtil";

class Users extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allUsers:[],
            users:[],
            students:[],
            staff:[],
            userRole: this.props.role || "ALL",
            alert:{},
            hasAlert:false,
            showSelect: this.props.canSelect || true
        }
        this.setAlert = this.setAlert.bind(this);
        this.removeAlert = this.removeAlert.bind(this);
        this.setUserRole = this.setUserRole.bind(this);
        this.setUsers = this.setUsers.bind(this);
        this.getAllStudents = this.getAllStudents.bind(this);
        this.getAllStaff = this.getAllStaff.bind(this);
        this.getAllUsers = this.getAllUsers.bind(this);
        this.canDeleteUsers = this.canDeleteUsers.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.deleteAllUsers = this.deleteAllUsers.bind(this);
        this.removeFromList = this.removeFromList.bind(this);

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

    setUserRole(evt){
        let role = evt.target.value;
        this.setState({
            userRole: role
        });
        this.setUsers(role);
    }

    setUsers(role){
        if(role === "STAFF"){
            this.setState({
                users: this.state.staff
            });
        } else if(role === "STUDENT"){
            let students = this.state.students;
            let userEmail = AuthService.getUserEmail();

            if( AuthService.getUserRole() === 'SUPERVISOR'){
                students = students?.filter( std => {
                  return std.projects?.filter(p => (
                    p.supervisor?.user?.email === userEmail
                  ));
                })
            }
            this.setState({
                users: students
            });
        } else{
            this.setState({
                users: this.state.allUsers
            });
        }
    }
    
    async getAllStudents(){
       await StudentService.getAll().then( res =>{
           if(res.error){
               this.setAlert(res.error);
           }else{
               this.setState({
                   students: res.data.data
               });
           }
       });
    }

    async getAllStaff(){
        await StaffService.getAll().then( res =>{
            if(res.error){
                this.setAlert(res.error);
            }else{
                this.setState({
                    staff: res.data.data
                });
            }
        });
    }
    async getAllUsers(){
        await UserService.getAll().then( res =>{
            if(res.error){
                this.setAlert(res.error);
            }else{
                this.setState({
                    allUsers: res.data.data
                });
            }
        });
    }
    async deleteUser(userId, role){
        let del = window.confirm(`Are you sure you want to delete this ${role}?`);
        if( del) {
            isLoading(true);
            let response = null;
            if (role === 'STUDENT')
                response = await StudentService.delete(userId);
            else if( ['EVALUATOR', 'SUPERVISOR', "STAFF"].includes(role))
                response = await StaffService.delete(userId);
            else
                response = await UserService.delete(userId);
            
            if(response.error){
                this.setAlert(response.error);
            }else{
                this.setAlert({
                    message: response.data.message,
                    type:"success"
                })
                this.removeFromList(role, userId);
            }
            await this.getAllUsers();
            isLoading(false);
        }
    }
    removeFromList(role, userId){
        if( role === "STUDENT") {
            this.setState({
                students: this.state.students.filter(s => s._id !== userId)
            });
        } else{
            this.setState({
                staff: this.state.staff.filter(s => s._id !== userId)
            });
        }
    }

    canDeleteUsers(){
        let role = AuthService.getUserRole();
        
        if(['ADMINISTRATOR','EVALUATOR'].includes(role))
            return true;
        else
            return false;
    }

    async deleteAllUsers(role){
        let del = window.confirm(`Are you sure you want to delete all ${role} ?`);
        if( del) {
            isLoading(true);
            let response = null;
            if (role === 'STUDENT')
                response = await StudentService.deleteAll();
            else
                response = await StaffService.deleteAll();
            if(response.error){
                this.setAlert(response.error);
            }else{
                if(role === 'STUDENTS')
                    await this.getAllStudents();
                else
                    await this.getAllStaff();
            }
            await this.getAllUsers();
            isLoading(false);
        }
    }

    async componentDidMount(){
        isLoading(true);
        await this.getAllUsers();
        await this.getAllStudents();
        await this.getAllStaff();
        this.setUsers( this.props.role || this.state.userRole);
        isLoading(false);
    }
    render(){
       let {users, alert, hasAlert, userRole, canSelect} = this.state;
       
        return(
            <div className="admin-main">
                <div className="container-fluid p-1">
                    <div className="row">
                        <div className="col-12 mb-2">
                            <div className="d-flex justify-content-between align-items-center">
                                <div></div>
                                <h3>Users</h3>
                                <div></div>
                            </div>
                        </div>
                        <div className="col-md-12 my-2 mx-auto">
                            <div className="card bg-transparent shadow">
                                <div className="card-body">
                                    {canSelect && (
                                        <div className="card-text pull-left">
                                            <div className="d-flex d-inline align-items-center">
                                                <label htmlFor="userRole" style={{width:"120px"}}>User Role</label>
                                                <select name="userRole" id="userRole" className="form-control mx-1" defaultValue={userRole} onChange={this.setUserRole}>
                                                    <option value="STUDENT">Students</option>
                                                    <option value="STAFF">Staff</option>
                                                    <option value="ALL">ALL</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                    <div className="card-text pull-right">
                                        {this.canDeleteUsers() && (
                                            <div className="btn-group">
                                                <Link className="btn btn-secondary mx-2" to="/new-user">
                                                    <i className="fa fa-plus"></i>
                                                    <span className="mx-1">New User</span>
                                                </Link>
                                                <button className="btn btn-danger" onClick={()=>this.deleteAllUsers(userRole)} >
                                                    <i className="fa fa-trash text-light"></i> Delete All
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            {hasAlert && <Alert alert={alert} onClick={this.removeAlert()} /> }
                        </div>
                        <div className="col-12">
                            <UserList userRole={userRole} users={users} canDelete={this.canDeleteUsers()} deleteFn={this.deleteUser} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Users;