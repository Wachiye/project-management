import React from "react";
import {saveAs} from "file-saver";

import {Status, StatusIndicator} from "./Status";
import TextToHTML from "./TextEditor/TextToHTML";

const ProjectFileCard = ({file}) => {
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
                    <span className="mx-1">{file?.student?.user?.fullName }</span>
                </div>
                <div className="card-text pull-right">
                    <button className="btn btn-sm btn-primary" title="Download" onClick={()=> saveFile(file)}>
                        Download <i className="fa fa-download"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProjectFileCard;