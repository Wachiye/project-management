import React, { Component } from "react";
import { Link, Redirect} from "react-router-dom";
import Alert from "../components/Alert/Alert";

import AuthService from "../services/AuthService";

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      alert: {},
      hasAlert: false,
    };

    this.setAlert = this.setAlert.bind(this);
    this.removeAlert = this.removeAlert.bind(this);
    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
  async login() {
    let { email, password, role } = this.state;
    let data = {
      email: email,
      password: password
    };
    let response = await AuthService.login(data);
    console.log({ response });

    if (response.error) {
      this.setAlert(response.error);
    } else {
      AuthService.setToken(response.data.data);
      this.props.history.push("/dashboard");
    }
  }
  render() {
    let { alert, hasAlert } = this.state;
    let token = AuthService.getToken();

    if (token) {
      return <Redirect to="/dashboard" />;
    } else {
      return (
        <main className="main">
          <div className="container">
            <div className="row mt-5">
              <div className="col-md-6 m-auto">
                <div className="card bg-light border-success">
                  <div className="card-header bg-success text-light d-flex flex-row justify-content-center align-items-center">
                    <h6 className="text align-content-center">Member Login</h6>
                  </div>
                  <div className="card-body">
                    {hasAlert && <Alert alert={alert} onClick={this.removeAlert}/>}
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control mb-1"
                        id="email"
                        name="email"
                        placeholder="Enter your Email"
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        placeholder="Enter Password"
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="row">
                      <div className="col">
                        <button
                          className="btn btn-success"
                          onClick={this.login}
                        >
                          Login
                        </button>
                      </div>
                      <div className="col">
                        <Link to="/pwd" className="card-link">
                          Forgot Password
                        </Link>
                      </div>
                    </div>
                    <hr className="" />
                    <div className="container-fluid">
                      <p className="">
                        Not yet a member?
                        <Link to="/register">Register Here</Link>
                      </p>
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
}

export default LoginPage;
