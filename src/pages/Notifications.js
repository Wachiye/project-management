import React, { Component } from "react";
import NotificationList from "../components/NotificationList";
import Alert from "../components/Alert/Alert";
import NotificationService from "../services/NotificationService";
import ModalContainer from "../components/Modal/ModalContainer";
import NewNotification from "../components/NewNotification";
import AuthService from "../services/AuthService";
import isLoading from "../utils/LoadingUtil";

class Notifications extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notifications: [],
      canDelete: false,
      alert: {},
      hasAlert: false,
      active: false
    };
    this.setAlert = this.setAlert.bind(this);
    this.removeAlert = this.removeAlert.bind(this);
    this.setActive = this.setActive.bind(this);
    this.getNotifications = this.getNotifications.bind(this);
    this.deleteNotification = this.deleteNotification.bind(this);
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
  setActive(active) {
    this.setState({
      active
    });

    if (!active) this.getNotifications();
  }

  async getNotifications() {
    const role = AuthService.getUserRole();

    const response = await NotificationService.getAll();

    if (response.error) {
      this.setAlert(response.error);
    } else {
      let notifications = response.data.data;

      if (role === "STUDENT" || role === "SUPERVISOR")
        notifications = notifications.filter((n) => n.type === role || n.type === "SYSTEM");
      else {
        this.setState({
          canDelete: true
        });
      }
      this.setState({
        notifications
      });
    }
  }

  async deleteNotification(notificationId) {
    isLoading(true);
    await NotificationService.delete(notificationId).then((response) => {
      if (response.error) {
        this.setAlert(response.error);
      } else {
        this.setState({
          notifications: this.state.notifications.filter((n) => n._id !== notificationId)
        });
        this.setAlert({
          message: response.data.message,
          type: "info"
        });
      }
    });
    isLoading(false);
  }
  async componentDidMount() {
    isLoading(true);
    await this.getNotifications();
    isLoading(false);
  }

  render() {
    const { notifications, alert, hasAlert, active, canDelete } = this.state;
    console.log({ notifications });
    return (
      <div className="admin-main">
        <div className="container">
          <div className="row">
            <div className="col-12 mb-2">
              <div className="d-flex justify-content-between align-items-center">
                <div> </div>
                <h3>Notifications</h3>
                {AuthService.getUserRole() === "ADMINISTRATOR" ||
                AuthService.getUserRole() === "EVALUATOR" ? (
                  <>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => this.setActive(true)}
                    >
                      New Notification
                    </button>
                    <ModalContainer
                      id="new-notification"
                      title="New Notification"
                      active={active}
                      setActive={this.setActive}
                      size="md"
                    >
                      <NewNotification />
                    </ModalContainer>
                  </>
                ) : null}
                <div></div>
              </div>
            </div>
            <div className="col-12 mb-2">
              {hasAlert && <Alert alert={alert} onClick={this.removeAlert} />}
            </div>
            <div className="col-md-8 mx-auto mb-2">
              {notifications && (
                <NotificationList
                  notifications={notifications}
                  canDelete={canDelete}
                  deleteFun={this.deleteNotification}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Notifications;
