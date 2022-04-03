import React, { useState } from "react";
import { shortDate } from "../utils/DateFormat";
import MessageReplyForm from "./MessageReplyForm";
import ModalContainer from "./Modal/ModalContainer";
import TextToHTML from "./TextEditor/TextToHTML";

const MessageCard = ({ user, message, refreshFun }) => {
  const [active, setActive] = useState(false);
  return (
    <div className={"card bg-transparent shadow custom-card mb-2"}>
      <div className="card-body">
        <blockquote className="card-text blockquote">
          <TextToHTML text={message?.message} />
          <span className="blockquote-footer">
            Posted On:
            <span>{shortDate(message?.createdAt)}</span>
          </span>
        </blockquote>
        {/*{message?.replies && (*/}
        {/*    <div className="reply-list" id={`replies-${message._id}`}>*/}
        {/*       <div className="container">*/}
        {/*           re*/}
        {/*       </div>*/}
        {/*   </div>*/}
        {/*)}*/}
      </div>
      <div className="card-footer">
        <div className="card-text pull-left">
          <i className="fa fa-user"></i>
          <span className="mx-1">{message?.senderName}</span>
        </div>
        <div className="pull-right">
          <button className="btn btn-sm" onClick={() => setActive(true)}>
            {" "}
            <i className="fa fa-reply"></i>
          </button>
          <ModalContainer
            title={"Reply to Message"}
            active={active}
            setActive={setActive}
            id={"new-reply"}
          >
            <MessageReplyForm user={user} message={message} refreshFun={refreshFun} />
          </ModalContainer>
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
