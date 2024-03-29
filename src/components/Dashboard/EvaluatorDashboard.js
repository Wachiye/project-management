import React, { useState, useEffect } from "react";
import ProjectService from "../../services/ProjectService";
import UserService from "../../services/UserService";
import StudentService from "../../services/StudentService";
import StaffService from "../../services/StaffService";

import Alert from "../Alert/Alert";
import UpdateCard from "./UpdateCard";
import groupProjects, { QuickUpdate } from "../../utils/ProjectUtil";
import PendingProjectList from "../PendingProjectList";

const EvaluatorDashboard = () => {

  const [students, setStudents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    ( async () => {
      let stdRes = await StudentService.getAll();

      if(!stdRes.error) {
        setStudents(stdRes.data.data);
      }
  
      let proRes = await ProjectService.getAll();

      if (!proRes.error) {
        setProjects(proRes.data.data);
      }
  
      let userRes = await UserService.getAll();
      if(!userRes.error){
        setUsers(userRes.data.data)
      };
  
      let staffRes = await StaffService.getAll();

      if(!staffRes.error){
        setStaff(staffRes.data.data);
      }
    }) ();
   
    
  }, []);

  let { pendingProjects } = groupProjects(projects);

  const [alert, setAlert] = useState({});
  const [hasAlert, setHasAlert] = useState(false);

  const removeAlert = () => {
    setAlert(null);
    setHasAlert(false);
  };

  const data = [
    {
      title: "All Projects",
      text: projects?.length || 0,
      link: "/projects"
    },
    {
      title: "All Users",
      text: users?.length || 0,
      link: "/users"
    },
    {
      title: "Students",
      text: students?.length || 0,
      link: "/students"
    },
    {
      title: "Staff",
      text: staff?.length || 0,
      link: "/staff"
    }
  ];

  const approveProject = async (projectId) => {
    const response = await ProjectService.setStatus(projectId, "ACCEPTED");
    if (response.error) {
      setAlert(response.error);
    } else {
      setAlert({
        message: response.data.message,
        type: "success"
      });
      setHasAlert(true);
      pendingProjects = projects.filter((p) => p._id !== projectId);
    }
  };
  return (
    <>
      <div className="row mb-2">
        <div className="col-md-8 mb-2">
          <div className="container">
            <div className="row">
              {data.map((update, index) => (
                <UpdateCard key={index} update={update} />
              ))}
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-2">
          <div className="project-report">
            <QuickUpdate projects={projects} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>Pending Projects</h5>
            </div>
            <div className="card-body">
              {hasAlert && <Alert alert={alert} onClick={removeAlert} />}
              {pendingProjects && (
                <PendingProjectList
                  pendingProjects={pendingProjects}
                  approveProjectFun={approveProject}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EvaluatorDashboard;
