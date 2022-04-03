import { Status } from "./Status";
import React from "react";

const NotificationList = ({ notifications, canDelete, deleteFun }) => {
  return notifications.map((notification) => (
    <div
      className={`card bg-transparent shadow custom-card ${Status(notification?.type)} mb-2`}
      key={notification._id}
    >
      <div className="card-body">
        <h4 className="card-title">{notification?.title}</h4>
        <p className="card-text small">{notification?.message}</p>
      </div>
      <div className="card-footer">
        <div className="card-text pull-left">
          <i className="fa fa-user"></i>
          <span className="mx-1">{notification?.postedBy?.fullName}</span>
          <small className="text-muted text-italic">({notification?.postedBy?.role})</small>
        </div>
        {canDelete && (
          <div className="pull-right">
            <button className="btn btn-sm btn-danger" onClick={() => deleteFun(notification._id)}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  ));
};

export default NotificationList;
