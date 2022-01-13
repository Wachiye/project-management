import React, { Component } from "react";
import { Link } from "react-router-dom";
import { MyDocViewer, MyFileViewer } from "../components/FileViewer/FileViewer";
import FileService from "../services/FileService";
import isLoading from "../utils/LoadingUtil";

class ViewProjectFile extends Component {
    constructor(props){
        super(props);

        this.state = {
            fileId: this.props.match.params.fileId || null,
            file : {},
            project: {},
            alert:{},
            hasAlert: false
        }

        this.setAlert = this.setAlert.bind(this);
        this.removeAlert = this.removeAlert.bind(this);
        this.getFile = this.getFile.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
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

    async getFile(){
        let fileId = this.state.fileId || this.props.match.params.fileId;

        let response = await FileService.getOneById(fileId);

        if(response.error){
            this.setAlert(response.error);
        } else{
            this.setState({
                file: response.data?.data,
                project: response.data?.data?.project
            });
        }
    }

    async deleteFile( fileId){
        let del = window.confirm("Are your sure you want to delete this file?");
        if(del){
            isLoading(true);
            let response = await FileService.delete(fileId);

            if(response.error){
                this.setAlert(response.error);
            } else{
                this.setAlert({
                    title : 'Operation successful',
                    message: response.data?.message,
                    type:"success"
                });
            }
            isLoading(false);
        }
    }

    async componentDidMount(){
        isLoading(true);
        this.setState({
            fileId:this.props.match.params.fileId
        });
        await this.getFile();
        isLoading(false);
    }
    render(){
        let {file, project} = this.state;
        return (
            <div className="admin-main">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 mb-2">
                            <div className="d-flex justify-content-between align-items-center">
                                <Link to={`/projects/${project?._id}/files`} className="btn btn-sm btn-outline-secondary">All Files</Link>
                                <div className="card bg-transparent border-0">
                                    <div className="card-body">
                                        <h4 className="card-title">{`Project: ${project?.name}`}</h4>
                                        <h6 className="text-muted card-subtitle">{`File Name: ${file?.name}`}</h6>
                                    </div>
                                </div>
                                <Link to={`/new-file`} className="btn btn-sm btn-primary">New File</Link>
                            </div>
                        </div>
                        <div className="col-12 mb-2">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                   <tr>
                                        <td>{file?.description}</td>
                                        <td>{file?.status}</td>
                                        <td>
                                            <button type="button" className="btn btn-danger btn-sm" onClick={()=>this.deleteFile(file._id)}>
                                                < i className="fa fa-trash-o"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="col-12 mb-2">
                            {file && <MyFileViewer file={file} />}
                        </div>
                        <div className="col-12">
                            {file && <MyDocViewer file={file} />}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ViewProjectFile;