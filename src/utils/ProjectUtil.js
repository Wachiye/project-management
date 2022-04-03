import DateFormat from "./DateFormat";
import React from "react";

const groupProjects = (projects) => {
  const pendingProjects = projects?.filter((p) => p.status === "WAITING_APPROVAL");
  const completeProjects = projects?.filter((p) => p.status === "FINISHED");
  const overdueProjects = projects?.filter(
    (p) =>
      p.status === "IN_PROGRESS" && DateFormat(p.endDate).toDateString() > new Date().toDateString()
  );
  const inProgress = projects?.filter((p) => p.status === "IN_PROGRESS");

  return {
    pendingProjects,
    completeProjects,
    overdueProjects,
    inProgress
  };
};
const QuickUpdate = ({ projects }) => {
  const { pendingProjects, completeProjects, inProgress, overdueProjects } =
    groupProjects(projects);
  return (
    <div className="card border-info h-100">
      <div className="card-header bg-info">
        <h6>Quick Updates</h6>
      </div>
      <div className="card-body">
        <ul className="list-unstyled">
          <li className="">
            Complete Projects:
            <span className="pull-right">{completeProjects?.length}</span>
          </li>
          <li className="">
            In Progress:
            <span className="pull-right">{inProgress?.length}</span>
          </li>
          <li className="">
            Over due:
            <span className="pull-right">{overdueProjects?.length}</span>
          </li>
          <li className="">
            Pending:
            <span className="pull-right">{pendingProjects?.length}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default groupProjects;

export { QuickUpdate };
