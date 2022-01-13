const TaskRow = ({tasks}) =>{
    return (
        tasks.map( task => (
            <tr key={task?._id}>
                <td>{task?._id}</td>
                <td>{task?.name}</td>
                <td>{task?.date}</td>
                <td>
                    <input type="checkbox" name="complete" id="complete" checked={task?.complete}/>
                </td>
            </tr>
        ))
    );
}
const SignOffSheet = ({project}) => {
    return(
        <div className="container">
            <div className="row">
                <div className="col-12 mb-2 text-center">
                        <h4 className="text-muted">Project: {project?.name}</h4>
                        <h2 className="text-muted">Sign Off Sheet</h2>
                </div>
                <div className="col-12 mb-2">
                    <div className="card bg-transparent">
                        <div className="card-body">
                            <h4 className="card-title">Project: {project?.name}</h4>
                            <h5 className="card-subtitle">Supervisor: {project?.supervisor?.user?.firstName || "--"} {project?.supervisor?.user?.lastName || "--"}</h5>
                            <div className="card-text">
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>Task</th>
                                        <th>Date</th>
                                        <th>Complete</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignOffSheet;