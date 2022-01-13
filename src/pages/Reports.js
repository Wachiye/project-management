import React, {Component} from "react";
import ProjectStatusReport from "../components/Reports/ProjectStatusReport";
import GeneralReport from "../components/Reports/GeneralReport";
import FileSubmissionReport from "../components/Reports/FileSubmissionReport";
import ProjectService from "../services/ProjectService";
import isLoading from '../utils/LoadingUtil';

const ShowReport = ({report, projects, users}) => {
    if(report === "Project Status"){
        // let role = AuthService.getUserRole();
        // if(role === 'STUDENT'){
        //     let projects = []
        //     ProjectService.getAll().then(res => {
        //         projects = res.data.data
        //     });

        //     if(projects){
        //         projects = projects.filter(p => p.student?.user?.email === AuthService.getUserEmail)
        //     }
        //     return <ProjectStatusReport projectList={projects} />;
        // } else{
            return <ProjectStatusReport project={projects[0] || null} />;
        // }
    }
      
    else if( report === "File Submission")
        return <FileSubmissionReport />;
    else
        return <GeneralReport projects={projects} users={users} />;
}

class Reports extends Component{
    constructor(props) {
        super(props);

        this.state = {
            reports : ["General", "Project Status","File Submission"],
            report:1,
            projects:[],
            users: []
        }

        this.setReport = this.setReport.bind(this);
        this.getAllProjects = this.getAllProjects.bind(this);
        this.getAllUsers = this.getAllUsers.bind(this);
    }

    setReport = (evt) =>{
        this.setState({
            report:evt.target.value
        });
    };

    async getAllProjects(){
        await ProjectService.getAll().then( res => {
            this.setState({
                projects: res.data?.data || null
            });
        }).catch( err =>{
            console.log({err});
        });
    }

    async getAllUsers(){
        await ProjectService.getAll().then( res => {
            this.setState({
                users: res.data?.data || null
            });
        }).catch( err =>{
            console.log({err});
        });
    }

    async componentDidMount(){
        isLoading(true);
        await this.getAllProjects();
        await this.getAllUsers();
        isLoading(false)
    }

    render() {
        let {reports, report, projects, users} = this.state;
        return(
            <div className="admin-main">
                <div className="container mb-2">
                    <div className="row mb-2">
                        <div className="col-12 mb-2">
                            <div className="d-flex justify-content-between align-items-center">
                                <div> </div>
                                <h3>Reports</h3>
                                <div> </div>
                            </div>
                        </div>
                    </div>
                    <div className="row shadow">
                        <div className="col-12 mb-2">
                            <div className="pull-left">
                                <div className="form-group">
                                    <label htmlFor="report" className="form-label">Select Report</label>
                                    <select name="report" id="report" className="form-control" onChange={this.setReport}>
                                        {reports.map( (report, index) => (
                                            <option value={report} key={index}>{report}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="pull-right pt-4" >
                                <ul className="list-inline">
                                    <li className="list-inline-item">
                                        <button className="btn btn-sm btn-primary" >Download</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <ShowReport report={report} projects={projects} users={users} />
            </div>
        );
    }
}

export default Reports;