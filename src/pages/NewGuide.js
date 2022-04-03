import React, { Component } from "react";
import GuideService from "../services/GuideService";
import Alert from "../components/Alert/Alert";
import { Link } from "react-router-dom";
import StaffService from "../services/StaffService";
import AuthService from "../services/AuthService";
import isLoading from "../utils/LoadingUtil";
import RichTextEditor from "../components/TextEditor/RichTextEditor";

class NewGuide extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      content: "",
      staffId: "",
      allStaff: [],
      guide: this.props.guide || null,
      alert: {},
      hasAlert: false
    };

    this.setAlert = this.setAlert.bind(this);
    this.removeAlert = this.removeAlert.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setContent = this.setContent.bind(this);
    this.getAllStaff = this.getAllStaff.bind(this);
    this.createOrEditGuide = this.createOrEditGuide.bind(this);
  }

  handleChange(evt) {
    const value = evt.target.value;
    this.setState({
      ...this.state,
      [evt.target.name]: value
    });
  }

  setContent(content) {
    this.setState({
      content
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

  async getAllStaff() {
    const response = await StaffService.getAll();
    if (response.error) {
      this.setAlert(response.error);
    } else {
      this.setState({
        allStaff: response.data.data,
        staffId:
          response.data?.data?.filter(
            (staff) => staff?.user?.email === AuthService.getUserEmail()
          )[0]?._id || null
      });
    }
  }

  async createOrEditGuide(edit = false) {
    isLoading(true);
    const { title, content, staffId, guide } = this.state;
    const data = {
      title: title || guide.title,
      content: content || guide.content,
      staffId: staffId || guide.createdBy?._id
    };

    const response = edit
      ? await GuideService.updateGuide(guide?._id, data)
      : await GuideService.postGuide(data);

    if (response.error) {
      this.setAlert(response.error);
    } else {
      this.setAlert({
        title: "Operation successful",
        message: response.data.message,
        type: "success"
      });
    }
    isLoading(false);
  }

  async componentDidMount() {
    isLoading(true);
    await this.getAllStaff();
    isLoading(false);
  }

  render() {
    const { hasAlert, alert, guide } = this.state;
    return (
      <div className="admin-main">
        <div className={guide === null ? "container" : "container-fluid"}>
          <div className="row">
            <div className={guide === null ? "col-lg-8 m-auto" : "col-12"}>
              <div className={guide === null ? "card bg-light border-success" : "card bg-light"}>
                {guide === null ? (
                  <div className="card-header bg-success text-light d-flex flex-row justify-content-center align-items-center">
                    <h6 className="text align-content-center"> NEW GUIDE</h6>
                  </div>
                ) : null}
                <div className="card-body">
                  <div className={guide === null ? "container" : "container-fluid"}>
                    <div className="row">
                      <div className="col-12">
                        {hasAlert && <Alert alert={alert} onClick={this.removeAlert} />}
                      </div>
                      <div className="col-lg-10 offset-lg-1 mb-2">
                        <div className="form-group">
                          <label htmlFor="title" className="form-label">
                            Guide Title
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="title"
                            name="title"
                            placeholder="Enter Guide Title"
                            defaultValue={guide?.title}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="content" className="form-label">
                            Content
                          </label>
                          <RichTextEditor
                            text={guide?.content}
                            height={350}
                            handleChangeFun={this.setContent}
                          />
                        </div>
                      </div>
                      <div className="col-12 my-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <button
                            type="button"
                            id="btnGuide"
                            name="btnGuide"
                            className="btn btn-success btn-lg"
                            onClick={() => this.createOrEditGuide(guide !== null)}
                          >
                            Submit Guide
                          </button>
                          <Link
                            to="/guides"
                            id="btnGuides"
                            name="btnGuides"
                            className="btn btn-outline-secondary btn-lg"
                          >
                            View Guides
                          </Link>
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

export default NewGuide;
