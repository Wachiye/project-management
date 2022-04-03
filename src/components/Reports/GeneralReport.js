import DateFormat from "../../utils/DateFormat";

const GeneralReport = ({ projects, users }) => {
  const students = users?.filter((u) => u.role === "STUDENTS") || 0;
  const evaluators = users?.filter((u) => u.role === "EVALUATORS");
  const supervisors = users?.filter((u) => u.role === "SUPERVISORS");

  const thisYearProjects = projects?.filter(
    (p) => DateFormat(p.createdAt).getFullYear() === new Date().getFullYear()
  );
  const completeProjects = projects?.filter((p) => p.status === "FINISHED");
  const inProgress = projects?.filter((p) => p.status === "IN_PROGRESS");
  const waitingApproval = projects?.filter((p) => p.status === "WAITING_APPROVAL");
  const overdueProjects = projects?.filter((p) => p.status === "IN_PROGRESS");

  const projectsByCategory = () => {
    const categories = [
      {
        name: "Android",
        projects: projects?.filter((p) => p.category === "ANDROID")
      },
      {
        name: "Desktop",
        projects: projects?.filter((p) => p.category === "DESKTOP")
      },
      {
        name: "Web Based",
        projects: projects?.filter((p) => p.category === "WEB_BASED")
      },
      {
        name: "Networking",
        projects: projects?.filter((p) => p.category === "NETWORKING")
      },
      {
        name: "SECURITY",
        projects: projects?.filter((p) => p.category === "SECURITY")
      },
      {
        name: "OTHER",
        projects: projects?.filter((p) => p.category === "OTHER")
      }
    ];
    return categories;
  };
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 mb-2">
          <div className="card bg-light">
            <div className="card-body">
              <h3 className="card-title">Users</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>All Users</th>
                    <th>Students</th>
                    <th>Evaluators</th>
                    <th>Supervisors</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{users?.length || 0}</td>
                    <td>{students?.length || 0}</td>
                    <td>{evaluators?.length || 0}</td>
                    <td>{supervisors?.length || 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-12 mb-2">
          <div className="card bg-light">
            <div className="card-body">
              <h3 className="card-title">Projects</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>All Time</th>
                    <th>This Year</th>
                    <th>Waiting Approval</th>
                    <th>In Progress</th>
                    <th>Complete</th>
                    <th>Overdue</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{projects?.length || 0}</td>
                    <td>{thisYearProjects?.length || 0}</td>
                    <td>{waitingApproval?.length || 0}</td>
                    <td>{inProgress?.length || 0}</td>
                    <td>{completeProjects?.length || 0}</td>
                    <td>{overdueProjects?.length || 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-12 mb-2">
          <div className="card bg-light">
            <div className="card-body">
              <h3 className="card-title">Projects By Category</h3>
              <table className="table">
                <thead>
                  <tr>
                    {projectsByCategory() && projectsByCategory().map((cat) => <th>{cat.name}</th>)}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {projectsByCategory() &&
                      projectsByCategory().map((cat) => <td>{cat.projects.length}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralReport;
