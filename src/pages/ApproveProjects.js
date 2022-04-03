import { useState, useEffect } from "react";
import PendingProjectList from "../components/PendingProjectList";
import ProjectService from "../services/ProjectService";
import isLoading from "../utils/LoadingUtil";
import Alert from "../components/Alert/Alert";

const ApproveProjects = () => {
  const [pendingProjects, setPendingProjects] = useState([]);
  const [alert, setAlert] = useState({});
  const [hasAlert, setHasAlert] = useState(false);

  useEffect(() => {
    getPendingProjects();
  }, []);

  const removeAlert = () => {
    setAlert(null);
    setHasAlert(false);
  };

  const getPendingProjects = async () => {
    isLoading(true);
    await ProjectService.getAllByStatus("WAITING_APPROVAL")
      .then((response) => {
        if (response.error) {
          setAlert(response.error);
          setHasAlert(true);
        } else {
          setPendingProjects(response.data?.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    isLoading(false);
  };

  const approveProject = async (projectId) => {
    isLoading(true);
    const response = await ProjectService.setStatus(projectId, "ACCEPTED");
    if (response.error) {
      setAlert(response.error);
    } else {
      setAlert({
        message: response.data.message,
        type: "success"
      });
      setHasAlert(true);
      await getPendingProjects();
    }
    isLoading(false);
  };

  return (
    <div className="admin-main">
      <div className="container-fluid p-1">
        <div className="row">
          <div className="col-12 text-center mb-2">
            <h3>Approve Pending Projects</h3>
          </div>
          <div className="col-md-12 my-2 ">
            <div className="card bg-transparent shadow">
              <div className="card-body">
                {hasAlert && <Alert alert={alert} onClick={removeAlert} />}
                {pendingProjects?.length > 0 ? (
                  <PendingProjectList
                    pendingProjects={pendingProjects}
                    approveProjectFun={approveProject}
                  />
                ) : (
                  <p className="card-text">No Pending Projects</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproveProjects;
