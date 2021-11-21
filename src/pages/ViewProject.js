import React, { Component} from "react";
import { Link } from "react-router-dom";
import Alert from "../components/Alert/Alert";
import ProjectService from "../services/ProjectService";
import DateFormat from "../utils/DateFormat";
class ViewProject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      project: {},
      alert:{},
      hasAlert: false
    };

    this.setAlert = this.setAlert.bind(this);
    this.removeAlert = this.removeAlert.bind(this);
  }

  setAlert(alert) {
    this.setState({
      alert: alert,
      hasAlert: true,
    });
  }

  removeAlert() {
    this.setState({
      alert: null,
      hasAlert: false,
    });
  }

  async componentDidMount() {
    let projectId = this.props.match.params.id;
    let response = await ProjectService.getOneById(projectId);
    
    if (response.error) {
     this.setAlert(response.error);
    } else {
      this.setState({
        project: response.data.data,
      });
    }
  }
  render() {
    let { project, hasAlert, alert } = this.state;
    return (
      <div className="admin-main">
        <div className="container-fluid p-1">
          <div className="row">
            <div className="col-12 text-center mb-2">
              <h3>{project?.name}</h3>
            </div>
            {hasAlert && <Alert alert={alert} />}
            <div className="col-md-8">
              <div className="card bg-transparent border-0">
                <div className="card-header bg-transparent my-2">
                  <div className="owner shadow p-2">
                    <h4 className="card-title text-primary">
                      By {project?.student?.user?.firstName} {project?.student?.user?.lastName }
                    </h4>
                    <div
                      className="
                        d-flex
                        justify-content-between
                        align-items-center
                      "
                    >
                      <span className="text-muted">
                        <i className="fa fa-envelope"></i>
                       <span className="mx-1">{project?.student?.user?.email}</span>
                      </span>
                      <span className="text-muted">{DateFormat(project?.startDate).getFullYear() || '--'}</span>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="projects">
                    <div className="mb-2 p-2">
                      <h4 className="card-title text-primary">Project Title</h4>
                      <h6 className="card-subtitle">{project.name}</h6>
                      <h4 className="card-title text-primary">
                        Project Description
                      </h4>
                      <p className="card-text lead">{project.description}</p>
                      <h4 className="card-title text-primary">
                        Programming languages
                      </h4>
                      <p className="card-text lead">{project.languages}</p>
                      <Link to="#" className="card-link btn btn-primary">
                        Downlaod
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="well bg-light p-2">
                <h4 className="text-primary">Related Projects</h4>
                <ul className="list-unstyled px-2">
                  <li className="">
                    <Link to="#">Project One</Link>
                  </li>
                  <li className="">
                    <Link to="#">Project One</Link>
                  </li>
                  <li className="">
                    <Link to="#">Project One</Link>
                  </li>
                  <li className="">
                    <Link to="#">Project One</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ViewProject;
