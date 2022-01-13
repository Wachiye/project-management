import React from "react";
import DateFormat from "../utils/DateFormat";

const ProfileCard =({profileData, userRole}) => {
    return(
        <div className="card bg-transparent">
            <div className="card-body">
                <h4 className="card-title">{profileData?.user?.fullName}</h4>
                <p className="card-text">
                    <i className="fa fa-user-circle"></i>
                    <span className="mx-1"> {`${userRole === 'STUDENT' ? 'Reg No' : 'Staff ID'}`}: {profileData?.regNo || profileData?.staffId}</span>
                </p>
                <p className="card-text">
                    <i className="fa fa-envelope"></i>
                    <span className="mx-1">Email: {profileData?.user?.email}</span>
                </p>
                <p className="card-text">
                    <i className="fa fa-calendar"></i>
                    <span className="mx-1">Joined: {DateFormat(profileData?.user?.createdAt).toDateString()}</span>
                </p>

            </div>
        </div>
    );
}

export default ProfileCard;