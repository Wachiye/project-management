import { Link } from "react-router-dom";
import { useState } from "react";
import ModalContainer from "./Modal/ModalContainer";
import NewGuide from "../pages/NewGuide";

const { shortDate } = require("../utils/DateFormat");

const GuideList = ({ guides = [], canDelete, deleteFun }) => {
  const [active, setActive] = useState(false);
  return (
    <table className="table table-hover table-responsive table-sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Title</th>
          <th>Created By</th>
          <th>Date Created</th>
          <th>Last Update</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {guides.map((guide) => (
          <tr key={guide._id}>
            <td>{guide._id}</td>
            <td>
              <h5 className="text-primary">{guide.title}</h5>
            </td>
            <td>{guide.createdBy?.user?.fullName}</td>
            <td>{shortDate(guide.createdAt)}</td>
            <td>{shortDate(guide.updateAt)}</td>
            <td className="text-center">
              <ul className="list-inline">
                <li className="list-inline-item">
                  <Link to={`/guides/${guide._id}`} className="btn btn-sm btn-primary">
                    Read
                  </Link>
                </li>
                {canDelete && (
                  <>
                    <li className="list-inline-item">
                      <button className="btn btn-sm btn-primary" onClick={() => setActive(true)}>
                        <i className="fa fa-edit"></i>
                      </button>
                      <ModalContainer
                        title={"Edit Guide"}
                        active={active}
                        setActive={setActive}
                        size={"xl"}
                      >
                        <NewGuide guide={guide} />
                      </ModalContainer>
                    </li>
                    <li className="list-inline-item">
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteFun(guide._id)}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GuideList;
