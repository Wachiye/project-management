import { shortDate } from "../utils/DateFormat";
import { Link } from "react-router-dom";

const PendingProjectList = ({ pendingProjects, approveProjectFun }) => {
  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Project ID</th>
          <th>Project Name</th>
          <th>Category</th>
          <th>Student</th>
          <th>Date Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {pendingProjects?.map((project) => (
          <tr key={project?._id}>
            <td>{project?._id}</td>
            <td>
              <h6>{project?.name}</h6>
              <span className="small text-muted">
                {project?.description?.substring(0, 70) + "..."}
              </span>
            </td>
            <td>{project?.category}</td>
            <td>
              {project?.student?.user?.firstName +
                " " +
                project?.student?.user?.lastName}
              <h6 className="small">{project?.student?.regNo}</h6>
            </td>
            <td>{shortDate(project?.createdAt)}</td>
            <td className="text-center">
              <ul className="list-inline">
                <li className="list-inline-item">
                  <button
                    className="btn btn-sm btn-primary"
                    id={project?._id}
                    onClick={(evt) => approveProjectFun(evt.target.id)}
                  >
                    Approve
                  </button>
                </li>
                <li className="list-inline-item">
                  <Link
                    to={`/projects/${project?._id}`}
                    className={"card-link btn btn-sm btn-outline-secondary"}
                  >
                    View
                  </Link>
                </li>
              </ul>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PendingProjectList;