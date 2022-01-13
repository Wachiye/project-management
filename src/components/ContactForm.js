import React, {useState} from "react";
import MessageService from "../services/MessageService";
import Alert from "./Alert/Alert";
import isLoading from "../utils/LoadingUtil";
import RichTextEditor from "./TextEditor/RichTextEditor";

const ContactForm = () => {
    const [alert,setAlert] = useState({});
    const [hasAlert, setHasAlert] = useState(false);
    const [senderName, setSenderName] = useState(null);
    const [senderEmail, setSenderEmail] = useState(null);
    const [message, setMessage] = useState(null);

    const removeAlert = () => {
        setAlert(null);
        setHasAlert(false);
    }


    const sendMessage = async () => {
        isLoading(true);
        let data = {
            senderName: senderName,
            senderEmail: senderEmail,
            message: message
        }

        await MessageService.sendMessage(data).then( response => {
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
        isLoading(false);
    }

    return(
        <>
            {hasAlert && <Alert alert={alert} onClick={removeAlert} /> }
            <div className="form-group">
                <label htmlFor="senderName" className="form-label">
                    Your Full Name
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="senderName"
                    name="senderName"
                    placeholder="Enter your full name"
                    onChange={(evt)=>setSenderName(evt.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="senderEmail" className="form-label">
                    Email
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="senderEmail"
                    name="senderEmail"
                    placeholder="Enter email"
                    onChange={(evt)=>setSenderEmail(evt.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="message" className="form-label">
                    Message
                </label>
                <RichTextEditor handleChangeFun={setMessage} />
            </div>
            <div className="my-2">
                <button name="btnSend" id="btnSend" className="btn btn-success"  type="button" onClick={()=>sendMessage()}>Send Message</button>
            </div>
        </>
    );
}

export  default ContactForm;