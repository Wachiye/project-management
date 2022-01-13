import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";

const ModalContainer = ({children, active, setActive, id, title, size="sm"}) => {
    return(
        <Modal show={active} id={id} size={size}>
            <Modal.Header>
                <h4 className="modal-title">{title}</h4>
                <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={()=>setActive(false)}>&times;</button>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
            {/*<Modal.Footer>*/}
            {/*    <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={()=>setActive(false)}>Close</button>*/}
            {/*</Modal.Footer>*/}
        </Modal>
    );
}
export default ModalContainer;