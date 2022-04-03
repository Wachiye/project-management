import React from "react";
import AuthService from "../services/AuthService";
import Alert from "../components/Alert/Alert";
import { Link } from "react-router-dom";
import isLoading from "../utils/LoadingUtil";

class Verify extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      code: this.props.match.params.code,
      alert: {},
      hasAlert: false,
      isVerified: false
    };

    this.setAlert = this.setAlert.bind(this);
    this.removeAlert = this.removeAlert.bind(this);
    this.verifyAccount = this.verifyAccount.bind(this);
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

  async verifyAccount() {
    isLoading(true);
    const { code } = this.state;
    await AuthService.verifyAccount(code).then((res) => {
      if (res.error) {
        this.setAlert(res.error);
        this.setState({
          isVerified: false
        });
      } else {
        this.setAlert({
          message: res.data.message,
          type: "success"
        });
        this.setState({
          isVerified: true
        });
      }
    });
    isLoading(false);
  }

  async componentDidMount() {
    await this.verifyAccount();
  }

  render() {
    const { alert, hasAlert, isVerified } = this.state;
    return (
      <div className="main">
        <div className="container">
          <div className="row my-5">
            <div className="col-12 col-md-6 offset-md-2">
              <div className="card bg-transparent shadow">
                <div className="card-body ">
                  <div className="card-text">
                    {hasAlert && <Alert alert={alert} onClick={this.removeAlert} />}
                  </div>
                  <div className="card-text">
                    {isVerified ? (
                      <Link to="/login" className="card-link btn btn-sm btn-primary">
                        Login
                      </Link>
                    ) : (
                      <>
                        <p>
                          Auto Verification failed. Please click the button bellow to verify your
                          account.
                        </p>
                        <button className="btn btn-sm btn-secondary" onClick={this.verifyAccount}>
                          Verify
                        </button>
                      </>
                    )}
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

export default Verify;
