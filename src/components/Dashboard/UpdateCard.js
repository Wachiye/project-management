import { Link } from "react-router-dom";
import React from "react";

const UpdateCard = ({ update, className = "col-sm-6 col-md-3" }) => {
  return (
    <div className={className}>
      <Link to={update?.link} className="update custom-card border-top shadow">
        <div className="icon d-flex justify-content-center align-items-center">
          <i className={`fa fa-2x fa-${update?.icon}`}></i>
        </div>
        <h4 className="title">{update?.title}</h4>
        <p className="text">{update?.text || 0}</p>
      </Link>
    </div>
  );
};

export default UpdateCard;
