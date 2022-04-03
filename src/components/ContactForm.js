import React, { useEffect, useState } from "react";
import MessageService from "../services/MessageService";
import Alert from "./Alert/Alert";
import isLoading from "../utils/LoadingUtil";
import RichTextEditor from "./TextEditor/RichTextEditor";
import UserService from "../services/UserService";
import AuthService from "../services/AuthService";

const ContactForm = ({ user, inMessage = false, receiverEmail, receiverName }) => {
  const [alert, setAlert] = useState({});
  const [hasAlert, setHasAlert] = useState(false);
  const [senderName, setSenderName] = useState(null);
  const [senderEmail, setSenderEmail] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setSenderName(user.fullName);
      setSenderEmail(user.email);
    }
  }, [user]);

  const removeAlert = () => {
    setAlert(null);
    setHasAlert(false);
  };

  const sendMessage = async () => {
    isLoading(true);
    let user = null;

    if (inMessage) {
      await UserService.getOneByEmail(AuthService.getUserEmail()).then((res) => {
        console.log(res);
        user = res.data.data;
      });
    }
    const data = {
      senderName: user.fullName || senderName,
      senderEmail: user.email || senderEmail,
      receiverName: receiverName || null,
      receiverEmail: receiverEmail || null,
      message
    };
    await MessageService.sendMessage(data).then((response) => {
      if (response.error) {
        setAlert(response.error);
        setHasAlert(true);
      } else {
        setAlert({
          title: "Server Response",
          message: response.data?.message,
          type: "success"
        });
        setHasAlert(true);
      }
    });
    isLoading(false);
  };

  return (
    <>
      {hasAlert && <Alert alert={alert} onClick={removeAlert} />}
      {!inMessage && (
        <>
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
              defaultValue={senderName}
              onChange={(evt) => setSenderName(evt.target.value)}
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
              defaultValue={senderEmail}
              onChange={(evt) => setSenderEmail(evt.target.value)}
            />
          </div>
        </>
      )}
      <div className="form-group">
        <label htmlFor="message" className="form-label">
          Message
        </label>
        <RichTextEditor handleChangeFun={setMessage} />
      </div>
      <div className="my-2">
        <button
          name="btnSend"
          id="btnSend"
          className="btn btn-success"
          type="button"
          onClick={() => sendMessage()}
        >
          Send Message
        </button>
      </div>
    </>
  );
};

export default ContactForm;
