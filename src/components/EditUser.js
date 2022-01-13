import React, {useState} from "react";
import StudentService from "../services/StudentService";
import StaffService from "../services/StaffService";
import Alert from "./Alert/Alert";
import isLoading from "../utils/LoadingUtil";

const EditUser = ({user, stdRegNo, staffNo}) => {
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [email, setEmail] = useState(null);
    const [role, setRole] = useState(null);
    const [regNo, setRegNo] = useState(null);
    const [staffId, setStaffId] = useState(null);

    const [alert,setAlert] = useState({});
    const [hasAlert, setHasAlert] = useState(false);

    const removeAlert = () => {
        setAlert(null);
        setHasAlert(false);
    }

    const userRole = user?.role || user?.user?.role;

    const updateUser = async () => {
        isLoading(true);
        let response = null;
        let data = {
            firstName: firstName || user?.firstName || user?.user?.firstName,
            lastName: lastName || user?.lastName || user?.user?.lastName,
            email: email || user?.email || user?.user?.email,
            role: role || user?.role || user?.user?.role,
            regNo: regNo || user?.regNo ,
            staffId: staffId || user?.staffId
        }

        if( role === "STUDENT")
            response = await StudentService.update( user._id, data);
        else
            response = await StaffService.update(user._id, data);

        if( response.error){
            setAlert(response.error);
            setHasAlert(true);
        }
        else{
            setAlert( {
                title : 'Operation successful',
                message: response.data.message,
                type:"success"
            });
            setHasAlert(true);
        }
        isLoading(false);
    }

    return(
        <>
            <div className="row mb-2">
                <div className="col-12">
                    {hasAlert && <Alert alert={alert} onClick={removeAlert}/> }
                </div>
                <div className="col-md-6">
                    <label htmlFor="firstName" className="form-label">
                        First Name
                    </label>
                    <input
                        type="text"
                        className="form-control mb-1"
                        id="firstName"
                        name="firstName"
                        placeholder="Enter First Name "
                        required
                        defaultValue={ user?.firstName || user?.user?.firstName}
                        onChange={(evt)=>setFirstName(evt.target.value)}
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="lastName" className="form-label">
                        Last Name
                    </label>
                    <input
                        type="text"
                        className="form-control mb-1"
                        id="lastName"
                        name="lastName"
                        placeholder="Enter Last Name"
                        required
                        defaultValue={ user?.lastName || user?.user?.lastName}
                        onChange={(evt)=>setLastName(evt.target.value)}
                    />
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="email" className="form-label">
                    Email Address
                </label>
                <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="Enter Email address"
                    required
                    defaultValue={ user?.email || user?.user?.email}
                    onChange={(evt)=>setEmail(evt.target.value)}
                />
            </div>

            {userRole === 'STUDENT' && (
                <div className="form-group">
                    <label htmlFor="regNo" className="form-label">
                        Registration Number
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="regNo"
                        name="regNo"
                        placeholder="Enter Registration Number"
                        required
                        defaultValue={ user?.regNo}
                        onChange={(evt)=>setRegNo(evt.target.value)}
                    />
                </div>
            )}
            {userRole !== 'STUDENT' && (
                <>
                    <div className="form-group">
                        <label htmlFor="role" className="form-label">
                            Role
                        </label>
                        <select
                            className="form-control"
                            id="role"
                            name="role"
                            onChange={(evt)=>setRole(evt.target.value)}
                            required
                            defaultValue={userRole}
                        >
                            <option value="SUPERVISOR">Supervisor</option>
                            <option value="EVALUATOR">Evaluator</option>
                            <option value="ADMINISTRATOR">Administrator</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="staffId" className="form-label">
                            Staff ID
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="staffId"
                            name="staffId"
                            placeholder="Enter StaffId"
                            required
                            defaultValue={ user?.staffId}
                            onChange={(evt)=>setStaffId(evt.target.value)}
                        />
                    </div>
                </>

            )}
            <div className="form-group my-1">
                <button type="submit" className="btn btn-success btn-lg" id="btnUpdate" name="btnUpdate" onClick={updateUser}>
                    Update User
                </button>
            </div>
        </>
    )
}

export default EditUser;