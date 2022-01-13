import React, {useState} from "react";
import UpdateCard from "./UpdateCard";
import {QuickUpdate} from "../../utils/ProjectUtil";
import Alert from "../Alert/Alert";
import {shortDate} from "../../utils/DateFormat";
import ModalContainer from "../Modal/ModalContainer";
import ProjectStatusReport from "../Reports/ProjectStatusReport";

const ProjectRow = ({project}) => {
    const [active, setActive] = useState(false);
    return(
        <tr key={project?._id}>
            <td>{project?._id}</td>
            <td>
                <h6>{project?.name}</h6>
                <span className="small text-muted">{project?.description?.substring(0, 70) + "..."}</span>
            </td>
            <td>{project?.category}</td>
            <td>
                {project?.student?.user?.firstName + " " + project?.student?.user?.lastName}
                <h6 className="small">{project?.student?.regNo}</h6>
            </td>
            <td>{shortDate( project?.startDate)}</td>
            <td>{shortDate( project?.endDate)}</td>
            <td>{project?.status}</td>
            <td>{project?.daysLeft}</td>
            <td className="text-center">
                <button className="btn btn-sm" onClick={()=>setActive(true)}>View</button>
                <ModalContainer title={'Project Report'} id={project?._id} active={active} setActive={setActive} size={"lg"}>
                    <ProjectStatusReport project={project}  showSelect={false}/>
                </ModalContainer>
            </td>
        </tr>
    );
}
const SupervisorDashboard = ({ projects, staff }) => {
    const [alert,setAlert] = useState({});
    const [hasAlert, setHasAlert] = useState(false);

    // const myProjects = projects.filter( p=> p.evaluator?.user?.email === AuthService.getUserEmail() && DateFormat(p.startDate).getFullYear() === new Date().getFullYear());

    const removeAlert = () => {
        setAlert(null);
        setHasAlert(false);
    }
    const data =  [
        {
            title: "All Projects",
            text: projects?.length || 0,
            link:"/projects"
        },
        {
            title:"Assigned Projects",
            text: projects?.length || 0,
            link: "/students"
        },
        {
            title:"Students",
            text: staff?.length || 0,
            link: "/students"
        },
    ];
    return(
        <>
            <div className="row mb-2">
                <div className="col-12">
                    {hasAlert && <Alert alert={alert} onClick={removeAlert}  />}
                </div>
                <div className="col-md-8 mb-2">
                    <div className="container">
                        <div className="row">
                            { data.map( (update, index) =>(
                                <UpdateCard key={index} update={update} className="col-sm-12 col-md-4" />
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
            <div className="row mb-2">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h5>My Projects</h5>
                        </div>
                        <div className="card-body">
                            <table className="table table-bordered">
                                <thead>
                                <tr>
                                    <th>Project ID</th>
                                    <th>Project Name</th>
                                    <th>Category</th>
                                    <th>Student</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Status</th>
                                    <th>Days Left</th>
                                    <th>View</th>
                                </tr>
                                </thead>
                                <tbody>
                                {projects?.map( project => (
                                    <ProjectRow project={project} key={project?._id} />
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}

export default SupervisorDashboard;