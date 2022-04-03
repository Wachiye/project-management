import React, { useState } from "react";
import Alert from "./Alert/Alert";
import SettingService from "../services/SettingService";
import { shortDate } from "../utils/DateFormat";
import isLoading from "../utils/LoadingUtil";

const NewSetting = ({ setting, isEdit }) => {
  const [alert, setAlert] = useState({});
  const [hasAlert, setHasAlert] = useState(false);
  const [category, setCategory] = useState(null);
  const [year, setYear] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const removeAlert = () => {
    setAlert(null);
    setHasAlert(false);
  };

  const postSetting = async () => {
    isLoading(true);
    const data = {
      year,
      category,
      startDate,
      endDate
    };

    const response = await SettingService.save(data);

    if (response.error) {
      setAlert(response.error);
      setHasAlert(true);
    } else {
      setAlert({
        title: "Operation successful",
        message: response.data.message,
        type: "success"
      });
      setHasAlert(true);
    }
    isLoading(false);
  };

  const updateSetting = async () => {
    isLoading(true);
    const data = {
      year: year || setting?.year,
      category: category || setting?.category,
      startDate: startDate || setting?.startDate,
      endDate: endDate || setting?.endDate
    };

    console.log(data, setting._id);
    const response = await SettingService.update(setting._id, data);

    if (response.error) {
      setAlert(response.error);
      setHasAlert(true);
    } else {
      setAlert({
        title: "Operation successful",
        message: response.data.message,
        type: "success"
      });
      setHasAlert(true);
    }
    isLoading(false);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">{hasAlert && <Alert alert={alert} onClick={removeAlert} />}</div>
        <div className="col-12 my-2">
          <div className="form-group mb-1">
            <label htmlFor="year" className="form-label">
              Year
            </label>
            <input
              type="number"
              name="year"
              id="year"
              className="form-control"
              defaultValue={setting?.year}
              onChange={(evt) => setYear(evt.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Setting Category
            </label>
            <select
              name="category"
              id="category"
              className="form-control"
              defaultValue={setting?.category}
              onChange={(evt) => setCategory(evt.target.value)}
            >
              <option value="">Select Category</option>
              <option value="PROJECT">Project Submission</option>
              <option value="PROPOSAL">Proposal Submission</option>
              <option value="SRS">SRS Submission</option>
              <option value="SDD">SDD Submission</option>
              <option value="TEST_PLAN">Test Plan Submission</option>
              <option value="USER_MANUAL">User manual Submission</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="startDate" className="form-label">
              Start Date
            </label>
            <input
              type="date"
              className="form-control"
              id="startDate"
              name="startDate"
              defaultValue={shortDate(setting?.startDate)}
              onChange={(evt) => setStartDate(evt.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate" className="form-label">
              End Date
            </label>
            <input
              type="date"
              className="form-control"
              id="endDate"
              name="endDate"
              defaultValue={shortDate(setting?.endDate)}
              onChange={(evt) => setEndDate(evt.target.value)}
            />
          </div>
          {isEdit ? (
            <button className="btn btn-primary my-1" onClick={updateSetting}>
              Update Setting
            </button>
          ) : (
            <button className="btn btn-primary my-1" onClick={postSetting}>
              Post Setting
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewSetting;
