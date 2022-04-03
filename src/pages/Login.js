import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Alert from "../components/Alert/Alert";

import AuthService from "../services/AuthService";
import delay from "../utils/delay";
import isLoading from "../utils/LoadingUtil";

const LoginDiv = ({ handleChange, loginFun, setPwdFun }) => {
  return (
    <>
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
          onChange={(evt) => handleChange(evt)}
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
          onChange={(evt) => handleChange(evt)}
        />
      </div>
      <div className="row">
        <div className="col">
          <button className="btn btn-success btn-sm" onClick={() => loginFun()}>
            Login
          </button>
        </div>
        <div className="col">
          <button
            className="card-link btn btn-sm btn-outline-secondary"
            onClick={() => setPwdFun()}
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </>
  );
};

const PwdDiv = ({ handleChange, resetPasswordFun, setPwdFun }) => {
  return (
    <>
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
          onChange={(evt) => handleChange(evt)}
        />
      </div>
      <div className="row">
        <div className="col">
          <button className="btn btn-success btn-sm" onClick={() => resetPasswordFun()}>
            Reset Password
          </button>
        </div>
        <div className="col">
          <button
            className="card-link btn btn-sm btn-outline-secondary"
            onClick={() => setPwdFun()}
          >
            Login
          </button>
        </div>
      </div>
    </>
  );
};

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      alert: {},
      hasAlert: false,
      pwd: false
    };

    this.setAlert = this.setAlert.bind(this);
    this.removeAlert = this.removeAlert.bind(this);
    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setPwd = this.setPwd.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }

  handleChange(evt) {
    const value = evt.target.value;
    this.setState({
      ...this.state,
      [evt.target.name]: value
    });
  }

  setAlert(alert) {
    this.setState({
      alert,
      hasAlert: true
    });
  }
  removeAlert() {
    this.setState({
      alert: null,
      hasAlert: false
    });
  }

  setPwd() {
    this.setState({
      pwd: !this.state.pwd
    });
  }

  async login() {
    const { email, password } = this.state;

    const data = {
      email,
      password
    };
    if (!email || !password) {
      this.setAlert({
        message: "Email and Password are required",
        type: "danger"
      });
    } else {
      isLoading(true);

      const response = await AuthService.login(data);

      if (response.error) {
        this.setAlert(response.error);
      } else {
        AuthService.setToken(response.data.data);
        delay(2000);
        this.props.history.push("/dashboard");
      }
      isLoading(false);
    }
  }

  async resetPassword() {
    const { email } = this.state;
    if (!email) {
      return this.setAlert({
        message: "Email is required",
        type: "danger"
      });
    } else {
      isLoading(true);
      await AuthService.pwd(email).then((response) => {
        if (response.error) {
          this.setAlert(response.error);
        } else {
          this.setAlert({
            message: response.data?.message,
            type: "success"
          });
        }
      });
      isLoading(false);
    }
  }

  render() {
    const { alert, hasAlert, pwd } = this.state;
    const token = AuthService.getToken();

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
                    <h6 className="text align-content-center">
                      {pwd ? "Reset Password" : "Member Login"}
                    </h6>
                  </div>
                  <div className="card-body">
                    {hasAlert && <Alert alert={alert} onClick={this.removeAlert} />}
                    {pwd ? (
                      <PwdDiv
                        handleChange={this.handleChange}
                        resetPasswordFun={this.resetPassword}
                        setPwdFun={this.setPwd}
                      />
                    ) : (
                      <LoginDiv
                        handleChange={this.handleChange}
                        loginFun={this.login}
                        setPwdFun={this.setPwd}
                      />
                    )}
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
