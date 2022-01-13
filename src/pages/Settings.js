import React, {Component} from "react";
import Alert from "../components/Alert/Alert";
import SettingService from "../services/SettingService";
import SettingList from "../components/SettingList";
import ModalContainer from "../components/Modal/ModalContainer";
import NewSetting from "../components/NewSetting";
import AuthService from "../services/AuthService";
import isLoading from "../utils/LoadingUtil";

class Settings extends Component{
    constructor(props) {
        super(props);

        this.state = {
            settings:[],
            alert:{},
            hasAlert: false,
        }
        this.setAlert = this.setAlert.bind(this);
        this.removeAlert = this.removeAlert.bind(this);
        this.setActive = this.setActive.bind(this);
        this.isSuperUser = this.isSuperUser.bind(this);
        this.getAllSettingsByYear = this.getAllSettingsByYear.bind(this);
        this.deleteSetting = this.deleteSetting.bind(this);
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

    setActive(active){
        this.setState({
            active:active
        });
        
        if(!active)
            this.getAllSettingsByYear();
    }

    async getAllSettingsByYear(){
        let thisYear = new Date().getFullYear();
        await SettingService.getAllByYear(thisYear).then( res => {
            if(res.error){
                this.setAlert(res.error);
            } else {
                this.setState({
                    settings: res.data.data
                });
            }
        });
    }

    isSuperUser(){
        return AuthService.getUserRole() === 'EVALUATOR' || AuthService.getUserRole() === 'ADMINISTRATOR';
    }

    async componentDidMount(){
        isLoading(true);
        await this.getAllSettingsByYear();
        isLoading(false);
    }

    async deleteSetting( settingId){
        let del = window.confirm("Are you sure you want to delete this setting");
        if( del){
            isLoading(true);
            let response = await SettingService.delete(settingId);
            if( response.error){
                this.setAlert(response.error);
            } else {
                this.state.settings = this.state.settings.filter( m => m._id !==settingId);
                this.setAlert({
                    title : 'Operation successful',
                    message: response.data.message,
                    type:"success"
                });
            }
            this.getAllSettingsByYear();
            isLoading(false);
        }
    }
    render() {
        let { settings, alert, hasAlert, active} = this.state
        return(
            <div className="admin-main">
                <div className="container">
                    <div className="row mb-2">
                        <div className="col-12 mb-2">
                            <div className="d-flex justify-content-between align-items-center">
                                <div> </div>
                                <h3>Settings</h3>
                                <div> </div>
                            </div>
                        </div>
                    </div>
                    <div className="row shadow">
                        <div className="col-12 mb-2">
                            <div className="pull-right pt-4" >
                                <ul className="list-inline">
                                    <li className="list-inline-item">
                                        <button className="btn btn-primary mx-2" onClick={()=>this.setActive(true)}>
                                            <i className="fa fa-plus"></i> New Setting
                                        </button>
                                        <ModalContainer active={active} setActive={this.setActive} size={"md"} title="New Settings" id="new-setting">
                                            <NewSetting />
                                        </ModalContainer>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-12">
                            {hasAlert && <Alert alert={alert} onClick={this.removeAlert} /> }
                        </div>
                    </div>
                </div>
                <SettingList settings={settings} canDelete={ this.isSuperUser} deleteFun={this.deleteSetting} />
            </div>
        );
    }
}

export default Settings;