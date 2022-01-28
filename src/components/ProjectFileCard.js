import React from "react";
import {saveAs} from "file-saver";

import {Status, StatusIndicator} from "./Status";
import TextToHTML from "./TextEditor/TextToHTML";
import { Link } from "react-router-dom";

const ProjectFileCard = ({file, canApprove = false, approveFileFun, canDelete = false, deleteFileFun}) => {
    const saveFile = (file) => {
       saveAs(
          file.fileURL,
          file.name
        );
    };

    return(
        <div className={`card bg-transparent shadow h-100 custom-card ${Status(file?.status)}`}>
            <div style={{position:"absolute", top:"-3px", right:"2px"}}>
                <StatusIndicator status={file?.status} />
            </div>
            <div className="card-body">
                <h4 className="card-title">{file?.name}</h4>
                <TextToHTML text={file?.description.substring(0, 100)} />
            </div>
            <div className="card-footer">
                <div className="card-text pull-left">
                    <i className="fa fa-user"></i>
                    <span className="mx-1">{file?.project?.student?.user?.fullName }</span>
                </div>
                <div className="card-text pull-right">
                    <div className="btn-group">
                        <button className="btn btn-sm btn-primary" title="Download" onClick={()=> saveFile(file)}>
                        <i className="fa fa-download"></i>
                        </button>
                        { (canApprove && file.status === 'PENDING') && (
                            <>
                                <button className="btn btn-sm btn-success" title="Approve" onClick={()=> approveFileFun(file._id, 'ACCEPTED')}>
                                    Approve
                                </button>
                                <button className="btn btn-sm btn-warning" title="Reject" onClick={()=> approveFileFun(file._id, 'REJECTED')}>
                                    Reject
                                </button>
                            </>
                        )}
                        <Link className="btn btn-sm btn-secondary" to={`/projects/${file?.project?._id}/files/${file._id}`}>View</Link>
                        {canDelete && (
                            <button className="btn btn-sm btn-danger" title="Delete" onClick={()=> deleteFileFun(file._id)}>
                                Delete
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectFileCard;