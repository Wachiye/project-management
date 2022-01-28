import {Link} from "react-router-dom";
import React, {useState} from "react";
import {Status, StatusIndicator} from "./Status";
import ProfileCard from "./ProfileCard";
import ModalContainer from "./Modal/ModalContainer";
import TextToHTML from "./TextEditor/TextToHTML";

function ProjectCard({project}) {
    const [active, setActive] = useState(false);

    return(
        <div className={`card bg-transparent shadow h-100 custom-card ${Status(project?.status)}`}>
            <div style={{position:"absolute", top:"-3px", right:"2px"}}>
                <StatusIndicator status={project?.status} />
            </div>
            <div className="card-body">
                <h4 className="card-title">{project?.name}</h4>
                <TextToHTML text={project?.description?.substring(0, 100) } />
            </div>
            <div className="card-footer">
                <div className="card-text pull-left">
                    <button className="btn btn-sm" onClick={()=>setActive(true)}> <i className="fa fa-user"></i></button>
                    <span className="mx-1">{project?.student?.user?.fullName }</span>
                    <ModalContainer title={`User Profile`} active={active} setActive={setActive} id={project._id} >
                        <ProfileCard profileData={project?.student}  userRole={"STUDENT"} />
                    </ModalContainer>
                </div>
                <div>
                    <Link to={`/projects/${project?._id}`} className="pull-right btn btn-outline-primary btn-sm">
                        <i className="fa fa-arrow-circle-o-right"> View </i>
                    </Link>
                </div>
                
            </div>
        </div>
    );
}

export default ProjectCard;