const ModalContainer = ({children, id, title}) => {
    return(
        <div className="modal" id={id}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">{title}</h4>
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalContainer;