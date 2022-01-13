import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/AuthService";
import {PrivateLayout, PublicLayout} from "../routes/Routes";

const NotFoundContainer = ({ body, developer, token, role}) =>{
    if(!token){
        return (
            <PublicLayout>
                <NotFoundContent body={body} developer={developer} />
            </PublicLayout>
        );
    } else{
        return (
            <PrivateLayout role={role}>
                <div className="admin-main">
                    <NotFoundContent body={body} developer={developer} />
                </div>
            </PrivateLayout>
        );
    }
}

const NotFoundContent = ({body, developer}) => {
    return(
        <div className="not-found py-2">
            <div className="container">
                <div className="row">
                    <div className="col-md-8 offset-md-2">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">PAGE NOT FOUND</h4>
                                <p className="card-text">Sorry, but we are unable to retrieve that page.</p>
                                <p className="card-text">Ensure that the URL is correct and try again. <br />
                                    If the problem persists or you think the URL is correct, please contact the developer.</p>
                                <p>
                                    <Link to='/' className="card-link">Go Homepage</Link>
                                </p>
                            </div>
                            <div className="card-footer bg-transparent">
                                <h6 className="text-center">Developed By</h6>
                                <p>{developer.name}</p>
                                <p className="card-text">
                                    <a href={`mailto:${developer.email}?Subject=PAGE%20NOT%20FOUND&Message=${body}&Body=${body}`}>
                                        <i className="fa fa-envelope mx-1"></i>
                                        Email: {developer.email}
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
const NotFound = () =>{
    const developer={
        name:'Jeremiah Siranjofu Wachiye',
        email:'siranjofuw@gmail.com'
    };
    const [url, setUrl] = useState(null);
    const [body, setBody] = useState(null);
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        let winLoc = window.location;
        let body = `Hi ${developer.name}, \r\n I am having trouble accessing the link ${url}. Please help.`;
        let token = AuthService.getToken();
        let role = AuthService.getUserRole();

        setUrl(winLoc);
        setBody(body)
        setToken(token);
        setRole(role);
    },[developer.name, url]);
    

    return(
       <NotFoundContainer role={role} token={token} body={body} developer={developer} />
    );
}

export default NotFound;