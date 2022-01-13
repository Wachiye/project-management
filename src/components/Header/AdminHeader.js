import AuthService from "../../services/AuthService";
import {Link} from "react-router-dom";

const AdminHeader = () => {
  return (
    <div className="admin-header shadow" >
        <div className="py-2 d-lg-none">APAMS</div>
      <div className="py-2 d-none d-lg-block">Academic Project Approval and Management System</div>
      <div className="d-lg-none">
        <i className="fa fa-bars"></i>
      </div>
        <div className="py-2 d-none d-lg-block small">
            <Link to="/profile" >{AuthService.getUserEmail()}</Link>
        </div>
    </div>
  );
};

export default AdminHeader;