function DateFormat(milliseconds) {
    if(milliseconds === null)
        return  null;
    else
        return new Date(milliseconds);
}

export default DateFormat;