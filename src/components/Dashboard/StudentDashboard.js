import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { shortDate } from "../../utils/DateFormat";
import StudentService from "../../services/StudentService";
import AuthService from "../../services/AuthService";
import ProjectService from "../../services/ProjectService";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    StudentService.getAll().then((res) => {
      if (!res.error) {
        const userEmail = AuthService.getUserEmail();
        const student = res.data.data.filter((std) => std.user?.email === userEmail)[0];

        setStudent(student);
      }
    });

    ProjectService.getAll().then((res) => {
      if (!res.error) {
        setProjects(res.data.data);
      }
    });
  }, []);

  const activeProject = student?.projects?.filter((p) => p.status === "IN_PROGRESS")[0];

  const tasks = () => {
    let count = 0;

    activeProject?.milestones?.forEach((m) => {
      count += m?.tasks?.length;
    });
    return count;
  };

  const pendingMilestones = () => {
    let count = 0;

    activeProject?.milestones?.forEach((m) => {
      if (m.status !== "FINISHED") count += 1;
    });

    return count;
  };

  const pendingTasks = () => {
    let count = 0;

    activeProject?.milestones?.tasks?.forEach((t) => {
      if (t.status !== "FINISHED") count += 1;
    });

    return count;
  };

  const timeUsedInPercentage = () => {
    const daysUsed = activeProject?.projectDays - activeProject?.daysLeft;
    return Math.ceil(daysUsed / activeProject?.projectDays) * 100;
  };

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="updates mb-2">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Quick Updates</h5>
                <div className="card-text">
                  <div className="row">
                    <div className="col-6 col-md-3 ">
                      <Link to="/projects" className="update">
                        <div className="icon d-flex justify-content-center align-items-center">
                          <img src="" alt="" width="35" height="35" />
                        </div>
                        <h6 className="title">All Projects</h6>
                        <p className="text">{projects?.length || 0}</p>
                      </Link>
                    </div>
                    <div className="col-6 col-md-3 ">
                      <Link to="/my-projects" className="update">
                        <div className="icon d-flex justify-content-center align-items-center">
                          <img src="" alt="" width="35" height="35" />
                        </div>
                        <h6 className="title">My Projects</h6>
                        <p className="text">{student?.projects?.length || 0}</p>
                      </Link>
                    </div>
                    <div className="col-6 col-md-3  ">
                      <Link to={`/project-milestones/${activeProject?._id}`} className="update">
                        <div className="icon d-flex justify-content-center align-items-center">
                          <img src="" alt="" width="35" height="35" />
                        </div>
                        <h6 className="title">Milestones</h6>
                        <p className="text">{activeProject?.milestones?.length || 0}</p>
                      </Link>
                    </div>
                    <div className="col-6 col-md-3 ">
                      <div className="update">
                        <div className="icon d-flex justify-content-center align-items-center">
                          <img src="" alt="" width="35" height="35" />
                        </div>
                        <h6 className="title">Project Files</h6>
                        <p className="text">{activeProject?.files?.length || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 my-2">
          <div className="quick-reports">
            <div className="time-spend">
              <h6 className="title">Time spend on project</h6>
              <div className="progress" style={{ height: "30px" }}>
                <div
                  className="progress-bar progress-bar-striped"
                  style={{ width: `${timeUsedInPercentage() || 0}%` }}
                >
                  ${timeUsedInPercentage() || 0}%
                </div>
              </div>
              <h6 className="title">Time Available</h6>
              <p className="lead">{activeProject?.daysLeft} Days</p>
            </div>
            <div className="pending-tasks">
              <h6 className="title">Pending Tasks</h6>
              <p className="lead">{pendingTasks || 0}</p>
            </div>
            <div className="finished-tasks">
              <h6 className="title">Finished Tasks</h6>
              <p className="lead">{tasks - pendingTasks || 0}</p>
            </div>
            <div className="finished-milestones">
              <h6 className="title">Finished Milestones</h6>
              <p className="lead">{activeProject?.milestones?.length - pendingMilestones || 0}</p>
            </div>
            <div className="project-report">
              <div className="card border-info h-100">
                <div className="card-header bg-info">
                  <h6>Project Report</h6>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled">
                    <li className="">
                      Start Date:
                      <span className="pull-right">
                        {shortDate(activeProject?.startDate) || "--"}
                      </span>
                    </li>
                    <li className="">
                      End Date:
                      <span className="pull-right">
                        {shortDate(activeProject?.endDate) || "--"}
                      </span>
                    </li>
                    <li className="">
                      Project Status:
                      <span className="pull-right">{activeProject?.status || "--"}</span>
                    </li>
                    <li className="">
                      All Milestones:
                      <span className="pull-right">{activeProject?.milestones?.length || 0}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>Recent Tasks</h5>
            </div>
            <div className="card-body">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Task ID</th>
                    <th>Task Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activeProject?.milestones?.forEach((m) =>
                    m.task?.map((t) => (
                      <tr>
                        <td>{t?._id}</td>
                        <td>{t?.name}</td>
                        <td>{shortDate(t?.startDate)}</td>
                        <td>{shortDate(t?.startDate)}</td>
                        <td>{t?.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
