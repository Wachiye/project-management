import React, {Component} from "react";
import StudentService from "../services/StudentService";
import AuthService from "../services/AuthService";
import StaffService from "../services/StaffService";
import {Link} from "react-router-dom";
import Alert from "../components/Alert/Alert";
import RegistrationForm from "../components/RegistrationForm";
import DateFormat from "../utils/DateFormat";
import isLoading from "../utils/LoadingUtil";

const Text = ({role, profileData}) =>{
    if(role === 'STUDENT') {
        return (
            <>
                <p className="card-text">
                    <i className="fa fa-files-o"></i>
                    <span className="mx-1">Projects: {profileData?.projects?.length}</span>
                    <span className="pull-right">
                        <Link to="/my-projects" className="card-link">View</Link>
                    </span>
                </p>
                <p className="card-text">
                    <i className="fa fa-upload"></i>
                    <span className="mx-1">Files: {profileData?.projectFiles?.length}</span>
                    <span className="pull-right">
                        <Link to="/my-files" className="card-link">View</Link>
                    </span>
                </p>
                <p className="card-text">
                    <i className="fa fa-comments-o"></i>
                    <span className="mx-1">Comments: {profileData?.comments?.length}</span>
                    <span className="pull-right">
                        <Link to="/my-comments" className="card-link">View</Link>
                    </span>
                </p>
            </>
        );
    }
    return null;
}
class Profile extends Component{
      constructor(props) {
          super(props);

          this.state = {
              firstName: "",
              lastName: "",
              email: "",
              regNo:"",
              staffId: "",

              oldPassword:"",
              password: "",
              confirmPassword: "",

              userRole: AuthService.getUserRole(),
              profileData:{},
              alert:{},
              hasAlert:false
          }
          this.setAlert = this.setAlert.bind(this);
          this.removeAlert = this.removeAlert.bind(this);
          this.handleChange = this.handleChange.bind(this);
          this.getProfileData = this.getProfileData.bind(this);
          this.updateProfile = this.updateProfile.bind(this);
          this.doUpdate = this.doUpdate.bind(this);
          this.changePassword = this.changePassword.bind(this);
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

    handleChange(evt) {
        let value = evt.target.value;
        this.setState({
            ...this.state,
            [evt.target.name]: value,
        });
    }

    async getProfileData(){
        let {userRole} = this.state;
        let response = null;

        if( userRole === 'STUDENT')
            response = await StudentService.getAll();
        else
          response = await StaffService.getAll();

        if(response.error){
            this.setAlert(response.error);
        }
        else{
            let profileData = response.data.data.filter( user => (
                user.user?.email === AuthService.getUserEmail()
            ))[0];

            this.setState({
                profileData : profileData
            });
        }
    }
    async updateProfile(){
        isLoading(true);
          let{ firstName, lastName, email, regNo, staffId, profileData, userRole} = this.state;
          let data = {
              firstName: firstName,
              lastName: lastName,
              email: email,
              regNo: regNo,
              staffId: staffId
          }

        await this.doUpdate(profileData._id, userRole, data);
        isLoading(false);
    }
    async doUpdate(_id, role, data){
        let response = null;

        if( role === 'STUDENT')
            response = await StudentService.update(_id, data);
        else
            response = await StaffService.update( _id, data);

        if(response.error){
            this.setAlert(response.error);
        }else{
            this.setAlert( {
                title : 'Operation successful',
                message: response.data.message,
                type:"success"
            });
            this.setState({
                profileData: response.data.data
            });
        }

        await this.getProfileData();
    }

    async changePassword() {
        isLoading(true);
        let{  profileData, oldPassword, password, confirmPassword} = this.state;
        let data = {
            oldPassword: oldPassword,
            password: password,
            email: profileData?.user?.email,
        }
        if (confirmPassword !== password){
            this.setAlert({
                "type":"danger",
                "message":"Passwords don't match.",
                "title":"Error"
            });
            return false;
        } else {
            let response = await AuthService.changePassword(data);

            if(response.error){
                this.setAlert(response.error);
            }
            else{
                this.setAlert({
                    "type":"success",
                    "message":response.data?.message,
                    "title":"Server Response"
                });
            }
        }
        isLoading(false);
    }

    async componentDidMount(){
        isLoading(true);
        await this.getProfileData();
        isLoading(false);
    }

    render() {
          let { userRole, profileData, alert, hasAlert} = this.state;
          return(
             <div className="admin-main">
                 <div className="container">
                     <div className="row">
                         <div className="col-12 mb-2">
                             <div className="d-flex justify-content-between align-items-center">
                                 <div></div>
                                 <h3>My Profile</h3>
                                 <div></div>
                             </div>
                         </div>
                     </div>
                     <div className="row">
                         <div className="col-lg-4 mb-3">
                             <div className="card bg-transparent border-0 shadow" style={{position:"relative"}}>
                                 <div className="card-header bg-info text-light py-2">
                                     <h3 className="text-center text-uppercase">{userRole || 'USER'}</h3>
                                 </div>
                                 <div className="card-body">
                                     <h3 className="card-title">{`${profileData?.user?.firstName} ${profileData?.user?.lastName}`}</h3>
                                     <p className="card-text">
                                         <i className="fa fa-user-circle"></i>
                                         <span className="mx-1"> {`${userRole === 'STUDENT' ? 'Reg No' : 'Staff ID'}`}: {profileData?.regNo || profileData?.staffId}</span>
                                     </p>
                                     <p className="card-text">
                                         <i className="fa fa-envelope"></i>
                                         <span className="mx-1">Email: {profileData?.user?.email}</span>
                                     </p>
                                     <p className="card-text">
                                         <i className="fa fa-calendar"></i>
                                         <span className="mx-1">Joined: {DateFormat(profileData?.user?.createdAt).toDateString()}</span>
                                     </p>
                                     <Text role={userRole} profileData={profileData} />
                                     {/*<div style={{position:"absolute", left:"50%", bottom:"-30px", transform:"translate(-50%,-50%)"}}>*/}
                                     {/*    <button type="button" className="btn btn-danger btn-sm">Delete</button>*/}
                                     {/*</div>*/}
                                 </div>
                             </div>

                         </div>
                         <div className="col-lg-8 mb-3">
                             {hasAlert && <Alert alert={alert} onClick={this.removeAlert} />}
                             <div className="card bg-transparent border-1">
                                 <div className="card-body">
                                     <p className="card-text">Update Details</p>
                                     <RegistrationForm changeHandler={this.handleChange} names={true} email={true} regNo={userRole === 'STUDENT'} staffId={userRole !== 'STUDENT'} disabled={false}/>
                                    <div className="my-2">
                                        <button className="btn btn-success btn-sm" type="button" onClick={this.updateProfile}>Update Details</button>
                                    </div>
                                 </div>
                             </div>
                             <div className="card bg-transparent border-1 mt-2">
                                 <div className="card-body">
                                     <p className="card-text">Change Password</p>
                                     <div className="form-group mb-2">
                                         <label htmlFor="oldPassword" className="form-label">Old Password</label>
                                         <input
                                             type="password"
                                             className="form-control"
                                             id="oldPassword"
                                             name="oldPassword"
                                             placeholder="oldPassword"
                                             required
                                             onChange={this.handleChange}
                                         />
                                     </div>
                                     <RegistrationForm changeHandler={this.handleChange} pwd={true}/>
                                     <div className="my-2">
                                         <button className="btn btn-success btn-sm" type="button" onClick={this.changePassword}>Change Password</button>
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

export default Profile;