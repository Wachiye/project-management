import React, {Component} from "react";
import Alert from "../components/Alert/Alert";
import CommentCard from "../components/CommentCard";
import NewComment from "../components/NewComment";
import ProjectService from "../services/ProjectService";
import ModalContainer from "../components/Modal/ModalContainer";
import isLoading from "../utils/LoadingUtil";

const CommentList = ({comments}) => {
    return(
        comments.map( comment => (
            <CommentCard comment={comment} key={comment?._id} />
        ))
    );
}

class Comments extends Component{
    constructor(props) {
        super(props);

        this.state = {
            comments:[],
            user:{},
            projectId: this.props.match.params.projectId,
            alert:{},
            hasAlert:false,
            active:false
        }

        this.setAlert = this.setAlert.bind(this);
        this.removeAlert = this.removeAlert.bind(this);
        this.setActive = this.setActive.bind(this);
        this.getProjectAndComments  = this.getProjectAndComments.bind(this);
    }

    setAlert(alert) {
        this.setState({
            alert: alert,
            hasAlert: true,
        });
    }

    removeAlert() {
        this.setState({
            alert: null,
            hasAlert: false,
        });
    }

    setActive(active){
        this.setState({
            active:active
        });

        if(!active)
            this.getProjectAndComments()
        
    }

    async getProjectAndComments(){
        let response = await ProjectService.getOneById(this.state.projectId);

        if (response.error) {
            this.setAlert(response.error);
        } else {
            this.setState({
                project: response.data.data,
                comments: response.data?.data?.comments,
            });
        }
    }
    async componentDidMount(){
        isLoading(true);
        await this.getProjectAndComments();
        isLoading(false);
    }

    render() {
        let { project, comments, alert, hasAlert, active} = this.state;
        return(
            <div className="admin-main">
                <div className="container">
                    <div className="row">
                        <div className="col-12 mb-2">
                            <div className="d-flex justify-content-between align-items-center">
                                <div> </div>
                                <h3>Comments</h3>
                                <h6>{project?.name}</h6>
                                <div> </div>
                            </div>
                        </div>
                        <div className="col-12 mb-2">
                            {hasAlert && <Alert alert={alert} onClick={this.removeAlert} /> }
                        </div>
                        <div className="col-12 mb-2">
                            <button className="btn btn-sm btn-outline-secondary" onClick={()=>this.setActive(true)}>New Comment</button>
                            <ModalContainer id="new-comment" title={`Project: ${project?.name}`} active={active} setActive={this.setActive} size="md">
                                <NewComment projectId={project?._id} />
                            </ModalContainer>
                        </div>
                        <div className="col-12 mb-2">
                            {comments && <CommentList comments={comments} />}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Comments;