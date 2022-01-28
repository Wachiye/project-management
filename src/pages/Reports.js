import React, {Component} from "react";
import GeneralReport from "../components/Reports/GeneralReport";
import ProjectService from "../services/ProjectService";
import isLoading from '../utils/LoadingUtil';
import ProjectReport from "../components/Reports/ProjectReport";
import AuthService from "../services/AuthService";

const ShowReport = ({report, projects, users}) => {
    if(report === "Project Status"){
        let role = AuthService.getUserRole();

        if(role !== 'STUDENT') {
            return <ProjectReport projects={projects} projectId={projects[0]?._id} showProjects={true}/>;
        }
        else {
            return  null;
        }
    }
    else
        return <GeneralReport projects={projects} users={users} />;
}

class Reports extends Component{
    constructor(props) {
        super(props);

        this.state = {
            reports : ["General", "Project Status"],
            report:1,
            projects:[],
            project:0,
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
                        </div>
                    </div>
                </div>
                <ShowReport report={report} projects={projects} users={users} />
            </div>
        );
    }
}

export default Reports;