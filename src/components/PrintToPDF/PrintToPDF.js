import React from "react";
import ReactToPrint  from "react-to-print";
import ProjectStatusReport from "../Reports/ProjectStatusReport";

const printBtn = () => {
    return(
        <div className="my-2 p-1">
            <button className="btn btn-sm btn-primary pull-right mr-1">
                <i className="fa fa-print"> Print </i>
            </button>
            <div className="clearfix"></div>
        </div>
    );
}

class PrintProjectReport extends React.PureComponent {
    render(){
        return (
            <div>
                <ReactToPrint
                    trigger={() => printBtn()}
                    content={() => this.componentRef}
                    documentTitle={'Academic Project Approval and Management System: Report for ' + this.props.project.name  + ' Project'}
                    
                />
                
                <div
                    ref={el => (this.componentRef = el) }>
                    <ProjectStatusReport 
                        project={this.props.project}
                        user={this.props.user}
                        projectSetting={this.props.projectSetting}
                        thisYearSettings={this.props.thisYearSettings}
                    />
                </div>
            </div>
        );
    }
};

export default PrintProjectReport;