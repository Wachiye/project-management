const StatusIndicator = ({status}) => {
    if(status === 'FINISHED')
        return <i className="fa fa-check-circle-o text-success"></i>;
    else if( status === 'IN_PROGRESS')
        return <i className="fa fa-check-circle text-warning"></i>;
    else if(status === 'WAITING_APPROVAL')
        return <i className="fa fa-clock-o text-secondary"></i>;
    else if(status === 'ACCEPTED')
        return <i className="fa fa-clock text-success"></i>;
    else
        return <i className="fa fa-times-rectangle text-danger"></i>;
}
const Status = (status) => {
    if(status === 'FINISHED')
        return "finished";
    else if( status === 'IN_PROGRESS')
        return "in-progress";
    else if(status === 'WAITING_APPROVAL')
        return "waiting";
    else if(status === 'ACCEPTED')
        return "accepted";
    else
        return "rejected";
}

export {Status, StatusIndicator};