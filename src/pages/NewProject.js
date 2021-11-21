import React, { Component} from "react";
import ProjectService from "../services/ProjectService";
import Alert from "../components/Alert/Alert";
import {Link} from "react-router-dom";
import StaffService from "../services/StaffService";
import AuthService from "../services/AuthService";
import StudentService from "../services/StudentService";

class NewProject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      description:"",
      category:"",
      languages:"",
      startDate:"",
      endDate:"",
      studentId:"",
      evaluatorId:"",
      evaluators:[],
      alert:{},
      hasAlert:false,
    };

    this.setAlert = this.setAlert.bind(this);
    this.removeAlert = this.removeAlert.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getEvaluators = this.getEvaluators.bind(this);
    this.createProject = this.createProject.bind(this);
  }

  handleChange(evt) {
    let value = evt.target.value;
    this.setState({
      ...this.state,
      [evt.target.name]: value,
    });
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

  async getStudent(){
    let response = await StudentService.getAll();

    if(response.error){
      this.setAlert(response.error);
    }
    else{
      let student = response.data.data.filter( std => (
          std.user?.email === AuthService.getUserEmail()
      ))[0];

      this.setState({
        studentId : student?._id
      });
    }
  }

  async getEvaluators() {
    let response = await StaffService.getAll();
    if(response.error){
      this.setAlert(response.error);
    }
    else{
      let evaluators = response.data.data.filter( staff => (
          staff.user?.role === 'EVALUATOR'
      ));
      this.setState({
        evaluators : evaluators
      });
    }
  }

  async createProject(){
    let { name, description, category, languages, startDate, endDate, studentId, evaluatorId } = this.state;
    let data = {
      name: name,
      description: description,
      category: category,
      languages: languages,
      startDate: startDate,
      endDate: endDate,
      studentId: studentId,
      evaluatorId: evaluatorId
    }

    let response = await ProjectService.save(data);

    if(response.error){
      this.setAlert(response.error);
    }
    else{
      this.setAlert( {
        title : 'Operation successful',
        message: response.data.message,
        type:"success"
      });
    }
  }

  async componentDidMount(){
    await this.getStudent();
    await this.getEvaluators();
  }

  render(){
      let {hasAlert, alert, evaluators} = this.state;
      return(
        <div className="admin-main">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <div className="card bg-light border-success">
                <div
                  className="
                    card-header
                    bg-success
                    text-light
                    d-flex
                    flex-row
                    justify-content-center
                    align-items-center
                  "
                >
                  <h6 className="text align-content-center">
                    CREATE NEW PROJECT
                  </h6>
                </div>
                <div className="card-body">
                  <div className="container">
                    <div className="row">
                        <div className="col-12">
                            {hasAlert && <Alert alert={alert} onClick={this.removeAlert}/>}
                        </div>
                      <div className="col-md-6 mb-2">
                        <h3 className="text-success mb-2">Basic Details</h3>

                        <div className="form-group">
                          <label htmlFor="name" className="form-label">Project Name</label>
                          <input
                              type="text"
                              className="form-control"
                              id="name"
                              name="name"
                              placeholder="Enter Project Name"
                              onChange={this.handleChange}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="description" className="form-label">Description</label>
                          <textarea className="form-control" id="description" name="description" rows="8"
                                    placeholder="Long Description"
                                    onChange={this.handleChange}
                          ></textarea>
                        </div>
                        <div className="form-group">
                          <label htmlFor="evaluatorId" className="form-label">Project Evaluator</label>
                          <select name="evaluatorId" id="evaluatorId" className="form-control" onChange={this.handleChange}>
                            <option value="">Select Evaluator</option>
                            {evaluators && evaluators.map( evaluator => (
                                <option value={`${evaluator._id}`} key={evaluator._id}> {`${evaluator.user?.firstName } ${evaluator.user?.lastName}`}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6 mb-2">
                        <h3 className="text-success mb-2">Other Details</h3>
                        <div className="form-group">
                          <label htmlFor="languages" className="form-label">Programming Languages</label>
                          <input
                              type="text"
                              className="form-control"
                              id="languages"
                              name="languages"
                              placeholder="Languages eg PHP, ReactJs"
                              onChange={this.handleChange}
                          />
                          <span className="form-text">Separate each language with a comma</span>
                      </div>
                        <div className="form-group">
                          <label htmlFor="category" className="form-label">Project Category</label>
                          <select name="category" id="category" className="form-control" onChange={this.handleChange}>
                            <option value="">Select Category</option>
                            <option value="WEB_BASED">Web Based Application</option>
                            <option value="ANDROID">Android Application</option>
                            <option value="DESKTOP">Desktop Application</option>
                            <option value="SECURITY">Security</option>
                            <option value="NETWORKING">Networking</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label htmlFor="startDate" className="form-label">Start Date</label>
                          <input type="date" className="form-control" id="startDate" name="startDate" onChange={this.handleChange}/>
                        </div>
                        <div className="form-group">
                          <label htmlFor="endDate" className="form-label">End Date</label>
                          <input type="date" className="form-control" id="endDate" name="endDate" onChange={this.handleChange}/>
                        </div>
                    </div>
                      <div className="col-12 my-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <button type="button" id="btnProject" name="btnProject" className="btn btn-success btn-lg" onClick={this.createProject}>Submit Project</button>
                            <Link to="/my-projects" id="btnProjects" name="btnProjects" className="btn btn-outline-secondary btn-lg">My Projects</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      );
  }
}

export default NewProject;