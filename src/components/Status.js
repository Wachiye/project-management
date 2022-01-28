const StatusIndicator = ({status}) => {
    if(status === 'FINISHED')
        return <span><i className="fa fa-check-circle-o text-success"></i> Finished</span>;
    else if( status === 'IN_PROGRESS')
        return <span><i className="fa fa-check-circle text-warning"></i> In Progress</span>;
    else if(status === 'WAITING_APPROVAL' || status === 'PENDING')
        return <span><i className="fa fa-clock-o text-secondary"></i> Not Approved</span>;
    else if(status === 'ACCEPTED')
        return <span><i className="fa fa-clock text-success"></i> Approved</span>;
    else
        return <span><i className="fa fa-times-rectangle text-danger"></i> Rejected</span>;
}
const Status = (status) => {
    if(status === 'FINISHED')
        return "finished";
    else if( status === 'IN_PROGRESS')
        return "in-progress";
    else if(status === 'WAITING_APPROVAL' || status === 'PENDING')
        return "waiting";
    else if(status === 'ACCEPTED')
        return "accepted";
    else
        return "rejected";
}

export {Status, StatusIndicator};