import React from 'react';

const Alert = ({alert, onClick}) => {
   return (
        <div className={`alert alert-${alert.type} alert-dismissible fade show`}>
            <h5 className="alert-heading">{alert.title}!</h5>
            <button 
                type="button"
		className="close d-flex justify-content-center align-items-center"
		data-dismiss="alert"
		onClick={()=>onClick()}>&times;</button>
            {alert.message}
        </div>
    );
}

export default Alert
