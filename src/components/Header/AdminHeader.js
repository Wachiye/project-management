import { Link } from "react-router-dom";
import $ from "jquery";
import RefreshButton from "../RefreshButton";

const AdminHeader = () => {
  function toggleNav() {
    $(".admin-nav").toggleClass("active");
  }
  return (
    <div className="admin-header shadow">
      <div className="py-2 d-lg-none">APAMS</div>
      <div className="py-2 d-none d-lg-block">Academic Project Approval and Management System</div>
      <div className="py-2">
        <RefreshButton />
      </div>
      <div
        style={{ cursor: "pointer" }}
        className="d-lg-none admin-nav-toggler"
        onClick={() => toggleNav()}
      >
        <i className="fa fa-bars"></i>
      </div>
      <div className="py-2 d-none d-lg-block small">
        <Link to="/profile">
          <i className="fa fa-2x fa-user-circle text-success"></i>
        </Link>
      </div>
    </div>
  );
};

export default AdminHeader;
