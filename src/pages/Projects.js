import React, { Component } from "react";
import Alert from "../components/Alert/Alert";
import ProjectService from "../services/ProjectService";
import ProjectCard from "../components/ProjectCard";

class Projects extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: [],
      alert:{},
      hasAlert:false
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

  async componentDidMount(){
      let response = await ProjectService.getAll();
      console.log({response})
      if(response.error){
        this.setAlert(response.error);
      }
      else{
        this.setState({
            projects: response.data.data
        });
      }
  }

  render() {
      let {projects, alert, hasAlert} = this.state;
    return (
      <div className="admin-main">
        <div className="container-fluid p-1">
          <div className="row">
            <div className="col-12 text-center mb-2">
              <h3>Projects</h3>
            </div>
            <div className="col-md-8 my-2 mx-auto">
              <div className="card bg-transparent shadow">
                <div className="card-body">
                    <div className="input-group">
                      <input type="text" className="form-control" name="search" id="search" placeholder="Search"/>
                      <div className="input-group-append">
                        <button className="btn btn-success">
                          Search
                        </button>
                      </div>
                    </div>
                </div>
              </div>
            </div>
            <div className="col-md-12">
                {hasAlert && <Alert alert={alert} />}
            </div>
          </div>
          <div className="row">
            {projects && projects.map(project => (
                <div className="col-sm-6 col-md-4 mb-2" key={project._id}>
                  <ProjectCard project={project} />
                </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Projects;
