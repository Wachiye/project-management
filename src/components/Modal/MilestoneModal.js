import NewMilestone from "../../pages/NewMilestone";
import ModalContainer from "./ModalContainer";

const MilestoneModal = ({id, title}) => {
    return(
        <ModalContainer id={id} title={title} component={NewMilestone} />
    );
}

export default MilestoneModal;