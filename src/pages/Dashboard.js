import React, { Component } from "react";
import UserService from "../services/UserService";
import StudentService from "../services/StudentService";
import StaffService from "../services/StaffService";
import ProjectService from "../services/ProjectService";
import AuthService from "../services/AuthService";
import DashboardHeader from "../components/Header/DashboardHeader";
import StudentDashboard from "../components/Dashboard/StudentDashboard";
import EvaluatorDashboard from "../components/Dashboard/EvaluatorDashboard";
import SupervisorDashboard from "../components/Dashboard/SupervisorDashboard";
import isLoading from "../utils/LoadingUtil";

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users:[],
      students:[],
      student:[],
      evaluator:[],
      staff:[],
      projects:[]
    }

    this.getAllUsers = this.getAllUsers.bind(this);
    this.getAllStudents = this.getAllStudents.bind(this);
    this.getAllStaff = this.getAllStaff.bind(this);
    this.getAllProjects = this.getAllProjects.bind(this);
  }

  async getAllUsers(){
    await UserService.getAll().then( res => {
      if(res.error){
        return false;
      } else {
        this.setState({
          users: res.data.data
        });
      }
    });
  }
  async getAllStudents(){
    await StudentService.getAll().then( res => {
      if(res.error){
        return false;
      } else {
        this.setState({
          students: res.data.data
        });
        let student = res.data.data.filter( std => (
            std.user?.email === AuthService.getUserEmail()
        ))[0];

        this.setState({
          student : student
        });
      }
    });
  }

  async getAllStaff(){
    await StaffService.getAll().then( res => {
      if(res.error){
        return false;
      } else {

        let evaluator = res.data.data.filter( s => (
            s.user?.email === AuthService.getUserEmail() && s.user?.role === "EVALUATOR"
        ))[0] || null;

        this.setState({
          staff: res.data.data,
          evaluator: evaluator
        });
      }
    });
  }
  async getAllProjects(){
    await ProjectService.getAll().then( res => {
      if(res.error){
        return false;
      } else {
        this.setState({
          projects: res.data.data
        });
      }
    });
  }

  async componentDidMount(){
    isLoading(true);
    await this.getAllUsers();
    await this.getAllStudents();
    await this.getAllStaff();
    await this.getAllProjects();
    isLoading(false);
  }

  render() {
    let {users, projects, students, staff, student} = this.state;
    return (
      <div className="admin-main">
        <div className="container-fluid p-1">
          <DashboardHeader />
          {AuthService.getUserRole() === 'STUDENT' && <StudentDashboard student={student} projects={projects} />}
          {AuthService.getUserRole() === 'EVALUATOR' && <EvaluatorDashboard users={users} students={students} projects={projects} staff={staff} />}
          {AuthService.getUserRole() === 'SUPERVISOR' && <SupervisorDashboard projects={projects} staff={staff} /> }
        </div>
      </div>
    );
  }
}

export default Dashboard;
