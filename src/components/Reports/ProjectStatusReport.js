import React, {useEffect, useState} from "react";
import UserService from "../../services/UserService";
import AuthService from "../../services/AuthService";
import groupMilestones from "../../utils/MilestoneUtil";
import groupTasks from "../../utils/TaskUtil";
import {shortDate} from "../../utils/DateFormat";
import SettingService from "../../services/SettingService";

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

const ProjectStatusReport = ({project}) => {
    const [currentProject, setCurrentProject] = useState({});
    const [user, setUser] = useState({});
    const [thisYearSettings, setThisYearSettings] = useState([]);
    const [projectSetting, setProjectSettings] = useState({});

    useEffect( () => {
        if(project){
            setCurrentProject(project);
        }

        UserService.getOneByEmail( AuthService.getUserEmail()).then( response => {
            setUser(response.data?.data);
        }).catch( error => {
            console.log(error);
        });

        let projectYear = new Date(currentProject?.createdAt).getFullYear();

        SettingService.getAllByYear( projectYear).then( response => {
            setThisYearSettings( response?.data?.data || []);
            setProjectSettings( thisYearSettings?.filter( s=> s.category === 'PROJECT')[0] || null);
        }).catch( error => {
            console.log(error);
        });
    }, [project, currentProject,thisYearSettings, user]);


    let {milestones, pendingMilestones, completeMilestones, milestonesInProgress, milestonesProgressInPercentage} = groupMilestones(currentProject?.milestones);
    let {tasks, pendingTasks, completeTasks, tasksInProgress, taskProgressInPercentage} = groupTasks( getAllTasks(currentProject?.milestones));

    return(
        <div className="container">
            <div className="row">
                <div className="col-12 mb-2">
                    <div className="card bg-transparent">
                        <div className="card-body">
                            <div className="card-text mb-2">
                                <h4 className="card-title">Project Summary</h4>
                                <table className="table table-bordered table-responsive">
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
                                        <td>{currentProject?.name}</td>
                                        <td>{user?.firstName + " " + user?.lastName}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="card-text mb-2">
                                <h4 className="card-title">Project Overview</h4>
                                <table className="table table-bordered w-100">
                                    <tbody>
                                    <tr>
                                        <th>Name</th>
                                        <td>{currentProject?.name}</td>
                                    </tr>
                                    <tr>
                                        <th>Description</th>
                                        <td>{currentProject?.description}</td>
                                    </tr>
                                    <tr>
                                        <th>Languages</th>
                                        <td>{currentProject?.languages}</td>
                                    </tr>
                                    <tr>
                                        <th>Category</th>
                                        <td>{currentProject?.category}</td>
                                    </tr>
                                    <tr>
                                        <th>Student</th>
                                        <td>{`${currentProject?.student?.user?.firstName} ${currentProject?.student?.user?.lastName}`}</td>
                                    </tr>
                                    <tr>
                                        <th>Evaluator</th>
                                        <td>{`${currentProject?.evaluator?.user?.firstName} ${currentProject?.evaluator?.user?.lastName}`}</td>
                                    </tr>
                                    <tr>
                                        <th>Supervisor</th>
                                        <td>{currentProject?.supervisor?.user?.firstName || "--"} {currentProject?.supervisor?.user?.lastName || "--"}</td>
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
                                        <td>{milestonesProgressInPercentage}</td>
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
                                        <td>{taskProgressInPercentage}</td>
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
                                        <th>Progress (%)</th>
                                        <td>Status</td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>{ shortDate( projectSetting?.startDate)}</td>
                                        <td>{shortDate( currentProject?.startDate)}</td>
                                        <td>{ shortDate( projectSetting?.endDate)}</td>
                                        <td>{shortDate( currentProject?.endDate)}</td>
                                        <td>{currentProject?.projectDays}</td>
                                        <td>{currentProject?.daysLeft}</td>
                                        <td>[Progress (%)]</td>
                                        <td>[Status]</td>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectStatusReport;