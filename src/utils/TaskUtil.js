import progressInPercentage from "./ProgressUtil";

const groupTasks = (tasks) => {
  const pendingTasks = tasks?.filter((p) => p.status === "PENDING");
  const completeTasks = tasks?.filter((p) => p.status === "FINISHED");
  const tasksInProgress = tasks?.filter((p) => p.status === "IN_PROGRESS");
  const taskProgressInPercentage = progressInPercentage(
    completeTasks?.length,
    tasksInProgress?.length,
    tasks?.length
  );
  return {
    tasks,
    pendingTasks,
    completeTasks,
    tasksInProgress,
    taskProgressInPercentage
  };
};

export default groupTasks;
