import React, { useState } from "react";
import Alert from "./Alert/Alert";
import DateFormat from "../utils/DateFormat";
import ModalContainer from "./Modal/ModalContainer";
import NewSetting from "./NewSetting";

const SettingRow = ({ setting, canDelete, delFun }) => {
  const [active, setActive] = useState(false);
  return (
    <tr>
      <td>{setting._id}</td>
      <td>{setting.category}</td>
      <td>{DateFormat(setting?.startDate).toDateString() || "--"}</td>
      <td>{DateFormat(setting?.endDate).toDateString() || "--"}</td>
      <td className="text-center">
        <input
          type="checkbox"
          name="setting"
          id={setting._id}
          checked={setting.isActive}
          disabled={true}
        />
      </td>
      <td className="text-center">
        <ul className="list-inline">
          {canDelete && (
            <>
              <li className="list-inline-item">
                <button className="btn btn-primary mx-2" onClick={() => setActive(true)}>
                  <i className="fa fa-edit"></i>
                </button>
                <ModalContainer
                  active={active}
                  setActive={setActive}
                  size={"md"}
                  title="Update Settings"
                  id={setting?._id}
                >
                  <NewSetting setting={setting} isEdit={true} />
                </ModalContainer>
              </li>
              <li className="list-inline-item">
                <button
                  className="btn btn-danger btn-sm"
                  type={"button"}
                  onClick={() => delFun(setting._id)}
                >
                  <i className="fa fa-trash"></i>
                </button>
              </li>
            </>
          )}
        </ul>
      </td>
    </tr>
  );
};

const SettingList = ({ settings, canDelete, deleteFun }) => {
  const [alert, setAlert] = useState({});
  const [hasAlert, setHasAlert] = useState(false);

  const removeAlert = () => {
    setAlert(null);
    setHasAlert(false);
  };

  return (
    <table className="table table-bordered">
      <thead className="bg-dark text-light">
        <tr>
          <th>#</th>
          <th>Category</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Active</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colSpan="7">{hasAlert && <Alert alert={alert} onClick={removeAlert} />}</td>
        </tr>
        {settings &&
          settings.map((setting) => (
            <SettingRow
              setting={setting}
              canDelete={canDelete}
              delFun={deleteFun}
              key={setting._id}
            />
          ))}
      </tbody>
    </table>
  );
};

export default SettingList;
