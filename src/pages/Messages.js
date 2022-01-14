import React, {Component} from "react";
import Alert from "../components/Alert/Alert";
import MessageCard from "../components/MessageCard";
import MessageService from "../services/MessageService";
import UserService from "../services/UserService";
import AuthService from "../services/AuthService";
import ModalContainer from "../components/Modal/ModalContainer";
import isLoading from "../utils/LoadingUtil";
import ContactForm from "../components/ContactForm";

const MessageList = ({messages}) => {
    return(
        messages.map( message => (
            <MessageCard message={message} key={message?._id} />
        ))
    );
}

class Messages extends Component{
    constructor(props) {
        super(props);

        this.state = {
            messages:[],
            user:{},
            alert:{},
            hasAlert:false,
            active:false
        }

        this.setAlert = this.setAlert.bind(this);
        this.removeAlert = this.removeAlert.bind(this);
        this.setActive = this.setActive.bind(this);
        this.getMessages  = this.getMessages.bind(this);
        this.getUser = this.getUser.bind(this);
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
            this.getMessages()
        
    }

    async getMessages(){
        let response = await MessageService.getAll();

        if (response.error) {
            this.setAlert(response.error);
        } else {
            this.setState({
                messages: response.data?.data || []
            });
        }
    }

    async getUser(){
        let email = AuthService.getUserEmail();
        let response = await UserService.getAll();

        if (response.error) {
            this.setAlert(response.error);
        } else {
            this.setState({
                messages: response.data?.data || []
            });
        }
    }

    async componentDidMount(){
        isLoading(true);
        await this.getMessages();
        await this.getUser();
        isLoading(false);
    }

    render() {
        let { messages, user, alert, hasAlert, active} = this.state;
        return(
            <div className="admin-main">
                <div className="container">
                    <div className="row">
                        <div className="col-12 mb-2">
                            <div className="d-flex justify-content-between align-items-center">
                                <div> </div>
                                <h3>Messages</h3>
                                <div> </div>
                            </div>
                        </div>
                        <div className="col-12 mb-2">
                            {hasAlert && <Alert alert={alert} onClick={this.removeAlert} /> }
                        </div>
                        <div className="col-12 mb-2">
                            <button className="btn btn-sm btn-outline-secondary" onClick={()=>this.setActive(true)}>New Message</button>
                            <ModalContainer id="new-message" title={`Create New Message`} active={active} setActive={this.setActive} size="md">
                                <ContactForm user={user}  />
                            </ModalContainer>
                        </div>
                        <div className="col-12 mb-2">
                            {Messages && <MessageList messages={messages} />}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Messages;