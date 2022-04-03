const progressInPercentage = (complete, inProgress, all) => {
  return ((complete + inProgress) / all) * 100;
};
export default progressInPercentage;
