import React, {Component} from "react";
import Alert from "../components/Alert/Alert";
import GuideService from "../services/GuideService";
import DateFormat from "../utils/DateFormat";
import isLoading from "../utils/LoadingUtil";
import TextToHTML from "../components/TextEditor/TextToHTML";

class ViewGuide extends Component {
    constructor(props) {
        super(props);

        this.state = {
            guideId:  this.props.match.params.guideId,
            guide: {},
            alert:{},
            hasAlert: false
        };

        this.setAlert = this.setAlert.bind(this);
        this.removeAlert = this.removeAlert.bind(this);
        this.getGuide = this.getGuide.bind(this);
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

    async getGuide(){
        let guideId = this.state.guideId || this.props.match.params.guideId;
        let response = await GuideService.getOneById(guideId);

        if (response.error) {
            this.setAlert(response.error);
        } else {
            this.setState({
                guide: response.data.data
            });
        }
    }

    async componentDidMount() {
        isLoading(true);
        await this.getGuide();
        isLoading(false);
    }

    render() {
        let { guide, hasAlert, alert} = this.state;
        return (
            <div className="admin-main">
                <div className="container p-1">
                    <div className="row">
                        <div className="col-12 text-center mb-2">
                            <h3>{guide?.title}</h3>
                        </div>
                        {hasAlert && <Alert alert={alert} onClick={this.removeAlert}/>}
                        <div className="col-12">
                            <div className="card bg-transparent border-0">
                                <div className="card-header bg-transparent my-2">
                                    <div className="owner shadow p-2">
                                        <h4 className="card-title text-primary">
                                            By {guide?.createdBy?.user?.fullName }
                                            <span className="mx-1 small">({guide?.createdBy?.user?.role})</span>
                                        </h4>
                                        <div className="d-flex justify-content-between align-items-center">
                                              <span className="text-muted">
                                                <i className="fa fa-envelope"></i>
                                               <span className="mx-1">{guide?.createdBy?.user?.email} </span>
                                              </span>
                                            <span className="text-muted">{DateFormat(guide?.createdAt).toDateString() || '--'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <article className="card-text mb-1">
                                        <TextToHTML text={guide?.content} />
                                    </article>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ViewGuide;
