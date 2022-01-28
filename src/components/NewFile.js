import React, { Component} from "react";
import Alert from "./Alert/Alert";
import {Link} from "react-router-dom";
import ProjectService from "../services/ProjectService";
import FileService from "../services/FileService";
import isLoading from "../utils/LoadingUtil";
import RichTextEditor from "./TextEditor/RichTextEditor";

class NewFile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            description:"",
            file:{},
            type:null,
            projectId: this.props.projectId || this.props.match.params.projectId,
            project:{},
            alert:{},
            hasAlert:false,
        };

        this.setAlert = this.setAlert.bind(this);
        this.removeAlert = this.removeAlert.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.setDescription = this.setDescription.bind(this);
        this.onSelectFile = this.onSelectFile.bind(this);
        this.getProject = this.getProject.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
    }

    handleChange(evt) {
        let value = evt.target.value;
        this.setState({
            ...this.state,
            [evt.target.name]: value,
        });
    }

    setDescription(description){
        this.setState({
          description: description
        });
    }
    
    onSelectFile(evt){
        this.setState({ 
            file: evt.target.files[0]
        });
    }

    setAlert(alert) {
        this.setState({
            alert: alert,
            hasAlert: true,
        });
    }
    removeAlert() {
        this.setState({
            alert: null,
            hasAlert: false,
        });
    }

    async getProject(){
        let response = await ProjectService.getOneById( this.state.projectId);

        if(response.error){
            this.setAlert(response.error);
        }
        else{
            this.setState({
                project : response.data?.data
            });
        }
    }

    async uploadFile(){
        isLoading(true);
        let { name, description, file, type, project} = this.state;

        let data = {
            name: name,
            description: description,
            file: file,
            fileType: type,
            projectId: project?._id,
            studentId: project?.student?._id
        }
        
        let response = await FileService.upload( data);
        
        if(response.error){
            this.setAlert(response.error);
        }
        else{
            this.setAlert( {
                title : 'Operation successful',
                message: response.data.message,
                type:"success"
            });
        }
        isLoading(false);
    }

    async componentDidMount(){
        isLoading(true);
        let _id = this.props.projectId || this.props.match.params.projectId;
        this.setState({
            projectId:_id
        });
        await this.getProject();
        isLoading(false);
    }

    render(){
        let {hasAlert, alert, project} = this.state;
        return(
            <div className="admin-main">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 m-auto">
                            <div className="card bg-light border-success">
                                <div className="card-header">
                                    <h4 className="text-muted">Project: {project?.name}</h4>
                                </div>
                                <div className="card-body">
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-12">
                                                {hasAlert && <Alert alert={alert} onClick={this.removeAlert}/>}
                                            </div>
                                            <div className="col-12 m-auto mb-2">
                                                <h3 className="text-success mb-2">File Details</h3>

                                                <div className="form-group">
                                                    <label htmlFor="name" className="form-label">File Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="name"
                                                        name="name"
                                                        placeholder="Enter File Name"
                                                        onChange={this.handleChange}
                                                    />
                                                    <span className="form-text">Eg. Project Proposal for {project?.name || 'xzy'} Project</span>
                                                </div>
                                                <div className="form-group mb-2">
                                                    <label htmlFor="description" className="form-label">Description</label>
                                                    <RichTextEditor  handleChangeFun={this.setDescription} />
                                                </div>
                                                <div className="form-group mb-2">
                                                    <label htmlFor="file" className="form-label">File</label>
                                                    <input className="form-control" type="file" id="file" name='file'
                                                           accept=".pdf,.doc, .docx" multiple={false}
                                                           onChange={this.onSelectFile}/>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="type" className="form-label">File Type</label>
                                                    <select name="type" id="type" className="form-control" onChange={this.handleChange} defaultValue={'PROPOSAL'}>
                                                        <option value="">Select Type</option>
                                                        <option value="PROPOSAL">Project Proposal Document</option>
                                                        <option value="SRS">Software Requirements Specification Document (SRS)</option>
                                                        <option value="SDD">Software Design Document (SDD)</option>
                                                        <option value="TEST_PLAN">Test Plan Document</option>
                                                        <option value="USER_MANUAL">User Manual</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-12 my-2">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <button type="button" id="btnFile" name="btnFile" className="btn btn-success btn-sm" onClick={this.uploadFile}>Upload File</button>
                                                    <Link to={`/projects/${project?._id}/files`}  className="btn btn-outline-secondary btn-sm">All Files</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NewFile;