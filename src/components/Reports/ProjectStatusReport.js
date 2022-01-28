import React from "react";
import groupMilestones from "../../utils/MilestoneUtil";
import groupTasks from "../../utils/TaskUtil";
import {shortDate} from "../../utils/DateFormat";

const  getAllTasks = (milestones) => {
    let tasks = [];
    if(milestones){
        milestones.forEach( milestone => {
            milestone.tasks?.forEach( task => {
                tasks.push( task);
            });
        });
    }
    return tasks;
}

const ProjectStatusReport = ({project, projectSetting, thisYearSettings, user}) => {
    
    let {milestones, pendingMilestones, completeMilestones, milestonesInProgress, milestonesProgressInPercentage} = groupMilestones(project?.milestones);
    let {tasks, pendingTasks, completeTasks, tasksInProgress, taskProgressInPercentage} = groupTasks( getAllTasks(project?.milestones));
    
    let files = project?.projectFiles;
        
    return(
        <div className="container py-1">
            <div className="row">
                <div className="col-12 mb-2">
                    <div className="card bg-transparent border-0">
                        <div className="card-body">
                            <div className="card-text mb-2">
                                <h4 className="card-title">Project Summary</h4>
                                <table className="table table-bordered table-responsive table-sm">
                                    <thead>
                                    <tr>
                                        <th>Report Date</th>
                                        <th>Project Name</th>
                                        <th>Prepared By</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>{new Date().toDateString()}</td>
                                        <td>{project?.name}</td>
                                        <td>{user?.firstName + " " + user?.lastName}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="card-text mb-2">
                                <table className="table table-bordered w-100">
                                    <tbody>
                                    <tr>
                                        <th>Languages</th>
                                        <td>{project?.languages}</td>
                                    </tr>
                                    <tr>
                                        <th>Category</th>
                                        <td>{project?.category}</td>
                                    </tr>
                                    <tr>
                                        <th>Student</th>
                                        <td>
                                            <a href={`mailto:${project?.student?.user?.email}`}>{project?.student?.user?.fullName || "--"}</a>
                                            <span className="mx-2">({project?.student?.regNo})</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Evaluator</th>
                                        <td>
                                            <a href={`mailto:${project?.evaluator?.user?.email}`}>{project?.evaluator?.user?.fullName || "--"}</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Supervisor</th>
                                        <td>
                                            <a href={`mailto:${project?.supervisor?.user?.email}`}>{project?.supervisor?.user?.fullName || "--"}</a>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="card-text">
                                <h4 className="card-title">Status Summary</h4>
                                <table className="table table-bordered">
                                    <thead>
                                    <tr >
                                        <th>Milestones</th>
                                        <th>Complete </th>
                                        <th>In Progress</th>
                                        <th>Pending</th>
                                        <th>Progress(%)</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>{milestones?.length}</td>
                                        <td>{completeMilestones?.length}</td>
                                        <td>{milestonesInProgress?.length}</td>
                                        <td>{pendingMilestones?.length}</td>
                                        <td>{milestonesProgressInPercentage || "--"}</td>
                                    </tr>
                                    </tbody>
                                </table>
                                <table className="table table-bordered">
                                    <thead>
                                    <tr>
                                        <th>Tasks</th>
                                        <th>Complete </th>
                                        <th>In Progress</th>
                                        <th>Pending</th>
                                        <th>Progress(%)</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>{tasks?.length}</td>
                                        <td>{completeTasks?.length} </td>
                                        <td>{tasksInProgress?.length}</td>
                                        <td>{pendingTasks?.length}</td>
                                        <td>{taskProgressInPercentage || "--"}</td>
                                    </tr>
                                    </tbody>
                                </table>
                                <table className="table table-bordered">
                                    <thead>
                                    <tr >
                                        <th>Expected Start Date</th>
                                        <th>Started On</th>
                                        <th>Expected End Date</th>
                                        <th>Finished On</th>
                                        <th>Timeframe (Days)</th>
                                        <th>Time Left (Days)</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>{ shortDate( projectSetting?.startDate)}</td>
                                        <td>{shortDate( project?.startDate)}</td>
                                        <td>{ shortDate( projectSetting?.endDate)}</td>
                                        <td>{shortDate( project?.endDate)}</td>
                                        <td>{project?.projectDays}</td>
                                        <td>{project?.daysLeft}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            {pendingTasks?.length > 0 ? (
                            <div className="card-text mb-2">
                                <h4 className="card-title">Pending Tasks</h4>
                                <table className="table table-bordered">
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Milestone</th>
                                        <th>Task Name</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Status</th>
                                        <th>Time Left (days)</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    { pendingTasks.map( task => (
                                        <tr key={task?._id}>
                                            <td>{task?._id}</td>
                                            <td>{task?.milestone?.name}</td>
                                            <td>{task?.name}</td>
                                            <td>{shortDate(task?.startDate)}</td>
                                            <td>{shortDate(task?.endDate)}</td>
                                            <td>{task?.status}</td>
                                            <td>{task?.daysLeft}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            ):(null)}

                            <div className="card-text mb-2">
                                <h4 className="card-title">Documentation</h4>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>File Name</th>
                                            <th>Documentation</th>
                                            <th>Date Submitted</th>
                                            <th>Date Approved</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {files && files.map( file => (
                                            <tr>
                                                <td>{file.name}</td>
                                                <td>{file.fileType}</td>
                                                <td>{shortDate(file.createdAt)}</td>
                                                <td>{shortDate(file.acceptedDate) || "--"}</td>
                                                <td>{file.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectStatusReport;