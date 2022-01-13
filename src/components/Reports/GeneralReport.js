import DateFormat from "../../utils/DateFormat";

const GeneralReport = ({projects, users}) => {
    let students = users?.filter( u => u.role === 'STUDENTS') || 0;
    let evaluators = users?.filter( u => u.role === 'EVALUATORS');
    let supervisors = users?.filter( u => u.role === 'SUPERVISORS');

    let thisYearProjects = projects?.filter( p => DateFormat(p.createdAt).getFullYear() === (new Date().getFullYear()));
    let completeProjects = projects?.filter( p => p.status === 'FINISHED');
    let inProgress = projects?.filter( p => p.status === 'IN_PROGRESS');
    let waitingApproval = projects?.filter( p => p.status === 'WAITING_APPROVAL');
    let overdueProjects = projects?.filter( p => p.status === 'IN_PROGRESS');
    return(
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
                                    <th>Web Based</th>
                                    <th>Desktop</th>
                                    <th>Android</th>
                                    <th>Networking</th>
                                    <th>Artificial Intelligence</th>
                                    <th>Database</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>[web]</td>
                                    <td>[desktop]</td>
                                    <td>[android]</td>
                                    <td>[networking]</td>
                                    <td>[ai]</td>
                                    <td>[database]</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export  default GeneralReport;