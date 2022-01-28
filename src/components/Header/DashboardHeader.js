import React from "react";

const DashboardHeader = () => {
    return (
        <div className="row">
            <div className="col-12">
                <div className="welcome">
                    <div className="message float-left">
                        <h3 className="text-dark">Hi, Welcome back,</h3>
                        <p className="lead">Your analytics dashboard</p>
                    </div>
                    <div className="clearfix"></div>
                </div>
            </div>
        </div>
    );
}

export default DashboardHeader;