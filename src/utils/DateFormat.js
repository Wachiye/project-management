function DateFormat(milliseconds) {
  if (milliseconds === null) return null;
  else return new Date(milliseconds);
}

function dateToString(milliseconds) {
  return DateFormat(milliseconds).toDateString() || "--";
}

function shortDate(milliseconds) {
  const date = DateFormat(milliseconds);

  if (date === null) return "--";
  else {
    return `${date.getFullYear()}-${zeroInFront(date.getMonth(), true)}-${zeroInFront(
      date.getDate()
    )}`;
  }
}

function zeroInFront(value, isMonth = false) {
  value += isMonth ? 1 : 0;
  if (value <= 9) return `0${value}`;
  else return value;
}

function dateDiffInHours(endDate, startDate) {
  const end_date = new Date(endDate);
  const start_date = new Date(startDate);
  let diff = (end_date.getTime() - start_date.getTime()) / 1000;
  diff /= 60 * 60;
  return Math.abs(Math.round(diff));
}

export default DateFormat;

export { dateToString, shortDate, dateDiffInHours };
