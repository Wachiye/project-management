import React, {useEffect, useState} from "react";
import Alert from "./Alert/Alert";
import NotificationService from "../services/NotificationService";
import AuthService from "../services/AuthService";
import UserService from "../services/UserService";
import isLoading from "../utils/LoadingUtil";
import RichTextEditor from "./TextEditor/RichTextEditor";

const NewNotification = () => {
    const [alert,setAlert] = useState({});
    const [hasAlert, setHasAlert] = useState(false);
    const [title, setTitle] = useState(null);
    const [notificationType, setNotificationType] = useState("SYSTEM");
    const [message, setMessage] = useState(null);
    const [user, setUser] = useState(null);

    const notificationTypes = ['SYSTEM','EVALUATOR', 'SUPERVISOR', 'STUDENT'];

    const loadUser = () =>{
        UserService.getOneByEmail(AuthService.getUserEmail()).then( res => {
            setUser( res.data.data);
        }).catch( err => {
            setAlert(err);
        })
    }
    useEffect( ()=>{
        loadUser();
    }, []);

    const removeAlert = () => {
        setAlert(null);
        setHasAlert(false);
    }

    const postNotification = async () => {
        isLoading(true);
        let data = {
            title : title,
            message: message,
            userId: user?._id,
            type: notificationType
        }
        let response = await NotificationService.save(data);

        if(response.error){
            setAlert(response.error);
            setHasAlert( true);
        }
        else{
            setAlert( {
                title : 'Operation successful',
                message: response.data.message,
                type:"success"
            });
            setHasAlert( true);
        }
        isLoading(false);
    }
    return(
        <div className="container">
            <div className="row">
                <div className="col-12">
                    {hasAlert && <Alert alert={alert} onClick={removeAlert} /> }
                </div>
                <div className="col-12 my-2">
                    <div className="form-group mb-1">
                        <label htmlFor="type" className="form-label">Notification Type</label>
                        <select name="type" id="type" className="form-control"
                                defaultValue={notificationType}
                                onChange={(evt)=>setNotificationType(evt.target.value)} >
                            {notificationTypes.map( type => (
                                <option value={type}> {type}</option>
                            ))}
                        </select>
                        {notificationType === 'SYSTEM' ? (
                            <span className="form-text tex-info">Notification will be send to all users</span>
                        ) : (
                            <span className="form-text tex-info">Notification will be send to users with role: {notificationType}</span>
                        )}
                    </div>
                    <div className="form-group mb-1">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input type="text" name="title" id="year" className="form-control"
                               onChange={(evt)=>setTitle(evt.target.value)}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="message" className="form-label">Message</label>
                        <RichTextEditor handleChangeFun={setMessage} />
                    </div>
                    <button className="btn btn-primary my-1" onClick={postNotification}>Post Notification</button>
                </div>
            </div>
        </div>
    );
}

export default NewNotification;