import NewMilestone from "../../pages/NewMilestone";
import ModalContainer from "./ModalContainer";

const MilestoneModal = ({id, title}) => {
    return(
        <ModalContainer id={id} title={title}>
            <NewMilestone />
        </ModalContainer>
    );
}

export default MilestoneModal;