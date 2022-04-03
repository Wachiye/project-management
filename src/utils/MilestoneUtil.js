import progressInPercentage from "./ProgressUtil";

const groupMilestones = (milestones) => {
  const pendingMilestones = milestones?.filter((p) => p.status === "PENDING");
  const completeMilestones = milestones?.filter((p) => p.status === "FINISHED");
  const milestonesInProgress = milestones?.filter((p) => p.status === "IN_PROGRESS");
  const milestonesProgressInPercentage = progressInPercentage(
    completeMilestones?.length,
    milestonesInProgress?.length,
    milestones?.length
  );

  return {
    milestones,
    pendingMilestones,
    completeMilestones,
    milestonesInProgress,
    milestonesProgressInPercentage
  };
};

export default groupMilestones;
