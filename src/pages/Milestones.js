import React, { Component } from "react";
import { Link } from "react-router-dom";
import Alert from "../components/Alert/Alert";
import MilestoneList from "../components/MilestoneList";
import ModalContainer from "../components/Modal/ModalContainer";
import AuthService from "../services/AuthService";
import ProjectService from "../services/ProjectService";
import isLoading from "../utils/LoadingUtil";
import NewMilestone from "./NewMilestone";

class Milestones extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projectId: this.props.match.params.projectId,
      title: "",
      milestones: [],
      alert: {},
      hasAlert: false,
      active: false
    };

    this.setAlert = this.setAlert.bind(this);
    this.removeAlert = this.removeAlert.bind(this);
    this.getMilestones = this.getMilestones.bind(this);
    this.setActive = this.setActive.bind(this);
    this.isOwner = this.isOwner.bind(this);
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
    if (!active) {
      this.getMilestones();
    }
  }

  async getMilestones() {
    const response = await ProjectService.getMilestones(this.state.projectId);
    if (response.error) {
      this.setAlert(response.error);
    } else {
      const title = response.data.data[0]?.project?.name;

      this.setState({
        milestones: response.data.data,
        title
      });
    }
  }

  isOwner() {
    const email = AuthService.getUserEmail();
    const project = this.state.milestones[0]?.project || {};

    if (project && email === project?.student?.user?.email) return true;
    else return false;
  }

  async componentDidMount() {
    isLoading(true);
    const _id = this.props.match.params.projectId;
    this.setState({
      projectId: _id
    });
    await this.getMilestones();
    isLoading(false);
  }

  static getDerivedStateFromProps(nextProps, prevState){
    if(nextProps.projectId !== prevState.projectId){
      return {projectId: nextProps.projectId}
    }else{
      return null;
    }
  }
  // async componentWillUpdate(prevProps, prevState){
  //   if(prevState.projectId !== this.state.projectId){
  //     const _id = this.props.match.params.projectId;
  //     this.setState({
  //       projectId: _id
  //     });
  //     await this.getMilestones();
  //   }
  // }

  async componentWillUpdate(prevProps){
    if(this.props.match.params.projectId !== prevProps.match.params.projectId){
      const _id = this.props.match.params.projectId;
      this.setState({
        projectId: _id
      });
      await this.getMilestones();
    }
  }
  render() {
    const { title, milestones, alert, hasAlert, projectId, active } = this.state;
    return (
      <div className="admin-main">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center">
                <Link to="/my-projects" className="btn btn-sm btn-outline-secondary">
                  My Projects
                </Link>
                <h3>Project Milestones</h3>
                {this.isOwner() ? (
                  <>
                    <button className="btn btn-sm btn-primary" onClick={() => this.setActive(true)}>
                      New Milestone
                    </button>
                    <ModalContainer
                      title={"Create Project Milestone"}
                      active={active}
                      setActive={this.setActive}
                      size="md"
                    >
                      <NewMilestone projectId={projectId} isModal={true} />
                    </ModalContainer>
                  </>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
            <div className="col-12">
              <div className="card bg-light my-2">
                <div className="card-header">
                  <h4 className="text-muted">Project: {title}</h4>
                </div>
                <div className="card-body">
                  {hasAlert && <Alert alert={alert} onClick={this.removeAlert} />}
                  {milestones && (
                    <MilestoneList
                      milestones={milestones}
                      deleteMilestone={this.isOwner()}
                      refreshFun={this.getMilestones()}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Milestones;
