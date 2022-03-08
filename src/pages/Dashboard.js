import React, { useEffect, useState } from "react";
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

async function getAllUsers(){
  let res = await UserService.getAll();

  if(res.error){
    return false;
  } else {
    return res.data.data
  }
}

async function getAllStudents(){
  let res = await StudentService.getAll();

  if(res.error){
    return false;
  } else {
    let userEmail = AuthService.getUserEmail();
    let students = res.data.data;

    if( AuthService.getUserRole() === 'SUPERVISOR'){
      students = students?.filter( std => {
        return std.projects?.filter(p => (
          p.supervisor?.user?.email === userEmail
        ));
      })
    }

    let student = res.data.data.filter( std => (
        std.user?.email === userEmail
    ))[0];

    return {
      students: students,
      student : student
    };
  }
}

async function getAllStaff(){
  let res = await StaffService.getAll();

  if(res.error){
    return false;
  } else {
    return res.data.data;
  }
}
async function getAllProjects(){
  let res = await ProjectService.getAll();

  if(res.error){
    return false;
  } else {
    return res.data.data;
  }
}

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [student , setStudent] = useState([]);
  const [staff, setStaff] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    
    const fetchData = async () => {
        isLoading(true);

        setUsers( await getAllUsers());

        let studentsData = await getAllStudents();
        setStudents( studentsData.students);
        setStudent( studentsData.student);

        setProjects( await getAllProjects());

        setStaff( await getAllStaff());

        isLoading(false);
    }
    
    fetchData();
  }, []);

  return (
    <div className="admin-main">
      <div className="container-fluid p-1">
        <DashboardHeader />
        {AuthService.getUserRole() === 'STUDENT' && <StudentDashboard student={student} projects={projects} />}
        {AuthService.getUserRole() === 'EVALUATOR' && <EvaluatorDashboard users={users} students={students} projects={projects} staff={staff} />}
        {AuthService.getUserRole() === 'SUPERVISOR' && <SupervisorDashboard projects={projects} students={students} /> }
      </div>
    </div>
  );
}

// class Dashboard extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       users:[],
//       students:[],
//       student:[],
//       evaluator:[],
//       staff:[],
//       projects:[]
//     }

//     this.getAllUsers = this.getAllUsers.bind(this);
//     this.getAllStudents = this.getAllStudents.bind(this);
//     this.getAllStaff = this.getAllStaff.bind(this);
//     this.getAllProjects = this.getAllProjects.bind(this);
//   }

//   async getAllUsers(){
//     let res = await UserService.getAll();

//     if(res.error){
//       return false;
//     } else {
//       this.setState({
//         users: res.data.data
//       });
//     }
//   }
//   async getAllStudents(){
//     let res = await StudentService.getAll();

//     if(res.error){
//       return false;
//     } else {
//       let userEmail = AuthService.getUserEmail();
//       let students = res.data.data;

//       if( AuthService.getUserRole() === 'SUPERVISOR'){
//         students = students?.filter( std => {
//           return std.projects?.filter(p => (
//             p.supervisor?.user?.email === userEmail
//           ));
//         })
//       }

//       let student = res.data.data.filter( std => (
//           std.user?.email === userEmail
//       ))[0];

//       this.setState({
//         students: students,
//         student : student
//       });
//     }
//   }

//   async getAllStaff(){
//     let res = await StaffService.getAll();

//     if(res.error){
//       return false;
//     } else {

//       let evaluator = res.data.data.filter( s => (
//           s.user?.email === AuthService.getUserEmail() && s.user?.role === "EVALUATOR"
//       ))[0] || null;

//       this.setState({
//         staff: res.data.data,
//         evaluator: evaluator
//       });
//     }
//   }
//   async getAllProjects(){
//     let res = await ProjectService.getAll();

//     if(res.error){
//       return false;
//     } else {
//       this.setState({
//         projects: res.data.data
//       });
//     }
//   }

//   async componentDidMount(){
//     isLoading(true);
//     await this.getAllUsers();
//     await this.getAllStudents();
//     await this.getAllStaff();
//     await this.getAllProjects();
//     isLoading(false);
//   }

//   render() {
//     let {users, projects, students, staff, student} = this.state;
//     return (
//       <div className="admin-main">
//         <div className="container-fluid p-1">
//           <DashboardHeader />
//           {AuthService.getUserRole() === 'STUDENT' && <StudentDashboard student={student} projects={projects} />}
//           {AuthService.getUserRole() === 'EVALUATOR' && <EvaluatorDashboard users={users} students={students} projects={projects} staff={staff} />}
//           {AuthService.getUserRole() === 'SUPERVISOR' && <SupervisorDashboard projects={projects} students={students} /> }
//         </div>
//       </div>
//     );
//   }
// }

export default Dashboard;
