import progressInPercentage from "./ProgressUtil";

const groupTasks= (tasks) => {

    let pendingTasks = tasks?.filter(p => p.status === 'PENDING');
    let completeTasks = tasks?.filter(p => p.status === 'FINISHED');
    let tasksInProgress = tasks?.filter(p => p.status === 'IN_PROGRESS');
    let taskProgressInPercentage = progressInPercentage( completeTasks?.length, tasksInProgress?.length, tasks?.length);
    return {
        tasks,
        pendingTasks,
        completeTasks,
        tasksInProgress,
        taskProgressInPercentage
    };
}

export default groupTasks;