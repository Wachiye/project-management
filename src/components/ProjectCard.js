import {Link} from "react-router-dom";
import React from "react";

function ProjectCard({project}) {

    return(
        <div className="card bg-transparent shadow h-100 project-card">
            <div className="card-body">
                <h4 className="card-title">{project?.name}</h4>
                <p className="card-text small">{project?.description.substring(0, 100) + "..."}</p>
            </div>
            <div className="card-footer">
                <div className="card-text pull-left">
                    <i className="fa fa-user"></i>
                    <span className="mx-1">{project?.student?.user?.firstName} {project?.student?.user?.lastName }</span>
                </div>
                <Link to={`/project/${project?._id}`} className="pull-right btn btn-outline-primary btn-sm">
                    <i className="fa fa-arrow-circle-o-right"></i>
                </Link>
            </div>
        </div>
    );
}

export default ProjectCard;