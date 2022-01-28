import DateFormat from "../utils/DateFormat";
import React, {useState} from "react";
import ModalContainer from "./Modal/ModalContainer";
import EditUser from "./EditUser";
import ContactForm from "./ContactForm";

const DeleteRow = ({canDelete, deleteFn, user, userRole}) =>{
    const [active, setActive] = useState(false);
    const [show, setShow] = useState(false);

    return(
        <td className="text-center">
            <ul className="list-inline">
                <li className="list-inline-item">
                    <button className="btn btn-sm btn-success" onClick={()=>setShow(true)}>
                        <i className="fa fa-envelope"></i>
                    </button>
                    <ModalContainer active={show} setActive={setShow} size={"md"} title={`Contact ${user?.fullName || user?.user?.fullName}  `} id={user._id}>
                        <ContactForm 
                            user={user}
                            inMessage={true}
                            receiverName={user?.fullName|| user?.user?.fullName}
                            receiverEmail={user?.email || user?.user?.email}
                            />
                    </ModalContainer>
                </li>

                {canDelete && (
                    <>
                    <li className="list-inline-item">
                        <button className="btn btn-sm btn-primary" onClick={()=>setActive(true)}>
                            <i className="fa fa-edit"></i>
                        </button>
                        <ModalContainer active={active} setActive={setActive} size={"md"} title="Update User Details" id={user._id}>
                            <EditUser user={user}  stdRegNo={user?.regNo || null} staffNo={user?.staffId || null} />
                        </ModalContainer>
                    </li>
                    <li className="list-inline-item">
                        <button className="btn btn-outline-danger btn-sm" type="button" onClick={()=>deleteFn(user?._id, userRole)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </li>
                    </>
                )}
            </ul>
        </td>
    )
}
const StudentRow = ({user}) =>{
    return(
        <>
            <td>{user?._id}</td>
            <td>{user?.user?.firstName || "--"}</td>
            <td>{user?.user?.lastName || "--"}</td>
            <td>{user?.user?.email || "--"}</td>
            <td>{user?.user?.role || 'STUDENT'}</td>
            <td>{user?.regNo}</td>
            <td>{DateFormat(user?.user?.createdAt).toDateString() || "--"}</td>
        </>
    );
}
const StaffRow = ({user}) =>{
    return(
        <>
            <td>{user?._id}</td>
            <td>{user?.user?.firstName || "--"}</td>
            <td>{user?.user?.lastName || "--"}</td>
            <td>{user?.user?.email || "--"}</td>
            <td>{user?.user?.role || 'STAFF'}</td>
            <td>{user?.staffId}</td>
            <td>{DateFormat(user?.user?.createdAt).toDateString() || "--"}</td>
        </>
    );
}

const UserRow = ({user}) =>{
    return(
        <>
            <td>{user?._id}</td>
            <td>{user?.firstName || "--"}</td>
            <td>{user?.lastName || "--"}</td>
            <td>{user?.email || "--"}</td>
            <td>{user?.role || 'STUDENT'}</td>
            <td>{DateFormat(user?.createdAt).toDateString() || "--"}</td>
        </>
    );
}
const UserList = ({users, canDelete, userRole, deleteFn}) => {
    return(
        <table className="table table-bordered">
            <thead className="bg-dark text-light">
            <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Role</th>
                {userRole === 'STUDENT' && (
                    <th>RegNo</th>
                )}
                {userRole === 'STAFF' && (
                    <th>Staff ID</th>
                )}
                <th>Date Joined</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            {users && users.map( user => (
                <tr key={user?._id}>
                    {userRole === "ALL" && <UserRow user={user} /> }
                    {userRole === "STUDENT" && <StudentRow user={user} /> }
                    {userRole === "STAFF" && <StaffRow user={user} /> }
                    <DeleteRow user={user} canDelete={canDelete} deleteFn={deleteFn} userRole={userRole}  />
                </tr>
            ))}
            </tbody>
        </table>
    );
}
export default UserList;