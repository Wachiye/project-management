import progressInPercentage from "./ProgressUtil";

const groupMilestones= (milestones) => {
    let pendingMilestones = milestones?.filter(p => p.status === 'PENDING');
    let completeMilestones = milestones?.filter(p => p.status === 'FINISHED');
    let milestonesInProgress = milestones?.filter(p => p.status === 'IN_PROGRESS');
    let milestonesProgressInPercentage = progressInPercentage( completeMilestones?.length, milestonesInProgress?.length, milestones?.length);

    return {
        milestones,
        pendingMilestones,
        completeMilestones,
        milestonesInProgress,
        milestonesProgressInPercentage
    };
}

export default groupMilestones;