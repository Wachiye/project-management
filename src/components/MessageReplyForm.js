import React, {useState} from "react";
import MessageService from "../services/MessageService";
import Alert from "./Alert/Alert";
import isLoading from "../utils/LoadingUtil";
import RichTextEditor from "./TextEditor/RichTextEditor";

const MessageReplyForm = ({user, message, refreshFun}) => {
    const [alert,setAlert] = useState({});
    const [hasAlert, setHasAlert] = useState(false);
    const [reply, setReply] = useState(null);

    const removeAlert = () => {
        setAlert(null);
        setHasAlert(false);
    }

    const sendReply = async () => {
        isLoading(true);

        let data = {
            messageId: message._id,
            userId:user._id,
            reply: reply
        }

        await MessageService.sendReply(data).then( response => {
            if(response.error){
                setAlert(response.error);
                setHasAlert(true)
            } else{
               setAlert({
                    title: "Server Response",
                    message: response.data?.message,
                    type:"success"
                });
               setHasAlert(true);
            }
        });
        refreshFun();
        isLoading(false);
    }

    return(
        <>
            {hasAlert && <Alert alert={alert} onClick={removeAlert} /> }
            <div className="form-group">
                <label htmlFor="reply" className="form-label">
                    Reply
                </label>
                <RichTextEditor handleChangeFun={setReply} />
            </div>
            <div className="my-2">
                <button name="btnSend" id="btnSend" className="btn btn-success"  type="button" onClick={()=>sendReply()}>Send Reply</button>
            </div>
        </>
    );
}

export  default MessageReplyForm;