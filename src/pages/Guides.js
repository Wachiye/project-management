import React, {Component} from "react";
import Alert from "../components/Alert/Alert";
import isLoading from "../utils/LoadingUtil";
import GuideService from "../services/GuideService";
import AuthService from "../services/AuthService";
import GuideList from "../components/GuideList";
import {Link} from "react-router-dom";

class Guides extends Component{
    constructor(props) {
        super(props);

        this.state = {
            guides:[],
            alert:{},
            hasAlert:false,
            active:false,
            userRole: AuthService.getUserRole()
        }

        this.setAlert = this.setAlert.bind(this);
        this.removeAlert = this.removeAlert.bind(this);
        this.canDelete = this.canDelete.bind(this);
        this.deleteGuide = this.deleteGuide.bind(this);
        this.getGuides  = this.getGuides.bind(this);
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
    
    canDelete(){
        let role = AuthService.getUserRole();
        if(['EVALUATOR', 'ADMINISTRATOR'].includes(role))
            return true;
        else
            return false;

    }

    async deleteGuide(guideId){
        let del = window.confirm("Are you sure you want to delete this items");
        if( del) {
            isLoading(true);
            await GuideService.delete(guideId).then(res => {
                if (res.error) {
                    this.setAlert(res.error);
                } else {
                    this.setAlert({
                        title : 'Operation successful',
                        message: res.data.message,
                        type:"success"
                    });

                }

            }).catch( err =>{
                console.log(err);
            });

            await this.getGuides();
            isLoading(false);
        }
    }
    async getGuides(){
        let response = await GuideService.getAll();

        if (response.error) {
            this.setAlert(response.error);
        } else {
            this.setState({
                guides: response.data?.data,
            });
        }
    }
    async componentDidMount(){
        isLoading(true);
        await this.getGuides();
        this.canDelete();
        isLoading(false);
    }

    render() {
        let { guides, alert, hasAlert} = this.state;
        return(
            <div className="admin-main">
                <div className="container">
                    <div className="row">
                        <div className="col-12 mb-2">
                            <div className="d-flex justify-content-between align-items-center">
                                <div> </div>
                                <h3>Guides</h3>
                                <div>
                                    {this.canDelete() && (
                                        <Link to="/new-guide" className="btn btn-sm btn-primary">New Guide</Link>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="col-12 mb-2">
                            {hasAlert && <Alert alert={alert} onClick={this.removeAlert} /> }
                        </div>
                        <div className="col-12 mb-2">
                            {guides ? (
                                <GuideList guides={guides} canDelete={this.canDelete()} deleteFun={this.deleteGuide} />
                            ) : (
                                <div className="shadow">
                                    <p>No Guides found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Guides;