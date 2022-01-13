function DateFormat(milliseconds) {
    if(milliseconds === null)
        return  null;
    else
        return new Date(milliseconds);
}

function dateToString(milliseconds){
    return DateFormat(milliseconds).toDateString() || "--";
}

function shortDate(milliseconds){
    let date = DateFormat(milliseconds);

    if(date === null)
        return "--";
    else {
        return date.getFullYear() + "-" + zeroInFront(date.getMonth(), true) + "-" + zeroInFront(date.getDate());
    }
}

function zeroInFront( value, isMonth=false){
    value += isMonth ? 1 : 0;
    if(value <= 9)
        return `0${value}`;
    else
        return  value;
}

export default DateFormat;

export {dateToString, shortDate};