import React from "react";
import { shortDate } from "../utils/DateFormat";
import TextToHTML from "./TextEditor/TextToHTML";

const CommentCard = ({ comment }) => {
  return (
    <div className={"card bg-transparent shadow custom-card mb-2"}>
      <div className="card-body">
        <blockquote className="card-text blockquote">
          <TextToHTML text={comment?.message} />
          <span className="blockquote-footer">
            Posted On:
            <span>{shortDate(comment?.createdAt)}</span>
          </span>
        </blockquote>
      </div>
      <div className="card-footer">
        <div className="card-text pull-left">
          <i className="fa fa-user"></i>
          <span className="mx-1">{comment?.user?.fullName}</span>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
