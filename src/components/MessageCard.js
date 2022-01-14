import React from "react";
import {shortDate} from "../utils/DateFormat";
import TextToHTML from "./TextEditor/TextToHTML";

const MessageCard = ({message}) => {
    return(
        <div className={`card bg-transparent shadow custom-card mb-2`}>
             <div className="card-body">
                <blockquote className="card-text blockquote">
                    <TextToHTML text={message?.message} />
                    <span className="blockquote-footer">Posted On:
                        <span>{shortDate(message?.createdAt)}</span>
                    </span>
                </blockquote>
            </div>
            <div className="card-footer">
                <div className="card-text pull-left">
                    <i className="fa fa-user"></i>
                    <span className="mx-1">{message?.senderName}</span>
                </div>
            </div>
        </div>
    );
}

export default MessageCard;