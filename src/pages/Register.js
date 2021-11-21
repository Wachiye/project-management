import React, { Component } from "react";
import { Link } from "react-router-dom";
import Alert from "../components/Alert/Alert";
import AuthService from "../services/AuthService";
import * as $ from 'jquery';
import RegistrationForm from "../components/RegistrationForm";
import StudentService from "../services/StudentService";
import StaffService from "../services/StaffService";

class RegisterPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
        regNo:"",
        staffId:"",
      alert: {},
      hasAlert: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.setAlert = this.setAlert.bind(this);
    this.removeAlert = this.removeAlert.bind(this);
    this.register = this.register.bind(this);
    this.doRegister = this.doRegister.bind(this);
  }

  handleChange(evt) {
    let value = evt.target.value;
    this.setState({
      ...this.state,
      [evt.target.name]: value,
    });
  }

  setAlert( alert){
      this.setState({
          alert: alert,
          hasAlert: true
      });
  }
  removeAlert(){
    this.setState({
        alert: null,
        hasAlert: false
    });
  }
  async register() {
      $('#btnRegister').addClass('loading');
    let { firstName, lastName, email, role, regNo, staffId, password, confirmPassword } =
      this.state;

    if (confirmPassword !== password){
        this.setAlert({
                "type":"danger",
                "message":"Passwords don't match.",
                "title":"Error"
            });
        $('#btnRegister').removeClass('loading');
        return false;
    } else {
        this.removeAlert();
        let data = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        role: role,
            regNo: regNo,
            staffId: staffId
        };

        await this.doRegister(role, data);
    }

  }
    async doRegister(role, data){
      let response = null;

        if( role === "STUDENT")
            response = await StudentService.register(data);
        else if( role === "EVALUATOR" || role === "SUPERVISOR")
            response = await StaffService.register(data);
        else
            response = await AuthService.register(data);

        if( response.error){
            this.setAlert(response.error);
        }
        else{
            this.setAlert( {
                title : 'Operation successful',
                message: response.data.message,
                type:"success"
            });
        }
        $('#btnRegister').removeClass('loading');
    }
  render() {
    let { alert, hasAlert, role } = this.state;
    return (
      <main className="main">
        <div className="container">
          <div className="row pt-2">
            <div className="col-md-8 col-lg-6 m-auto">
              <div className="card bg-light border-success">
                <div
                  className="
                        card-header
                        d-flex
                        flex-row
                        justify-content-center
                        align-items-center
                      "
                >
                  <h6 className="text align-content-center">
                    New Account Registration
                  </h6>
                </div>
                <div className="card-body">
                 
                      {hasAlert && <Alert alert={alert} onClick={this.removeAlert} />}
                    <RegistrationForm changeHandler={this.handleChange} names={true} email={true} pwd={true} disabled={false} regNo={false} staffId={false} role={true} />
                    {role && (
                        <div className="form-group mb-2">
                            <label htmlFor={`${(role === 'STUDENT' || role === "") ? 'regNo' : 'staffId'}`} className="form-label">
                                {`${role === 'STUDENT' ? 'Registration No' : 'Staff ID'}`}
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id={`${role === 'STUDENT' ? 'regNo' : 'staffId'}`}
                                name={`${role === 'STUDENT' ? 'regNo' : 'staffId'}`}
                                placeholder={`Enter ${role === 'STUDENT' ? 'Registration No' : 'Staff ID'}`}
                                required
                                onChange={this.handleChange}
                            />
                        </div>
                    )}
                    <div className="row mt-1">
                      <div className="col-xs-1-12">
                        <button type="submit" className="btn btn-success btn-lg" id="btnRegister" name="btnRegister" onClick={this.register}>
                          Register
                        </button>
                      </div>
                      <div className="col-12 my-1">
                        <p className="">
                          Already a member?
                          <Link to="/login">Login Here</Link>
                        </p>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default RegisterPage;
