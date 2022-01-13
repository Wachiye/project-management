import React, {useEffect, useState} from "react";
import Alert from "./Alert/Alert";
import CommentService from "../services/CommentService";
import UserService from "../services/UserService";
import AuthService from "../services/AuthService";
import isLoading from "../utils/LoadingUtil";
import RichTextEditor from "./TextEditor/RichTextEditor";

const NewComment = ({ projectId}) => {
    const [alert,setAlert] = useState({});
    const [hasAlert, setHasAlert] = useState(false);
    const [message, setMessage] = useState(null);
    const [user, setUser] = useState(null);

    useEffect( ()=>{
        UserService.getOneByEmail( AuthService.getUserEmail()).then( res => {
            setUser(res.data?.data);
        }).catch( err => {
            setAlert(err);
        })
    }, []);

    const removeAlert = () => {
        setAlert(null);
        setHasAlert(false);
    }

    const postComment = async () => {
        isLoading(true);
      let data = {
          projectId : projectId,
          message: message,
          userId: user?._id,
      }
      let response = await CommentService.save(data);

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
                        <div className="form-group">
                            <label htmlFor="message" className="form-label">Message</label>
                            <RichTextEditor handleChangeFun={setMessage} />
                        </div>
                        <button className="btn btn-primary my-1" onClick={postComment}>Post Comment</button>
                    </div>
                </div>
            </div>
    );
}

export default NewComment;