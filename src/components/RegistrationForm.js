const UserRoles = ({ roles, changeHandler, disabled }) => {
  if (!roles) {
    roles = ["STUDENT"];
  }

  return (
    <div className="form-group">
      <label htmlFor="role" className="form-label">
        Role
      </label>
      <select
        className="form-control"
        id="role"
        name="role"
        onChange={(evt) => changeHandler(evt)}
        required
        disabled={disabled}
        defaultValue={"STUDENT"}
      >
        {roles.map((role, index) => (
          <option value={role} key={index}>
            {role}
          </option>
        ))}
      </select>
    </div>
  );
};

const RegistrationForm = ({
  changeHandler,
  names,
  email,
  role,
  pwd,
  disabled,
  regNo,
  staffId,
  roles,
  data
}) => {
  return (
    <>
      {names && (
        <div className="row mb-2">
          <div className="col-md-6">
            <label htmlFor="firstName" className="form-label">
              First Name
            </label>
            <input
              type="text"
              className="form-control mb-1"
              id="firstName"
              name="firstName"
              placeholder="Enter your First Name "
              required
              disabled={disabled}
              defaultValue={data?.user?.firstName || ""}
              onChange={(evt) => changeHandler(evt)}
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
              placeholder="Enter your Last Name"
              required
              disabled={disabled}
              defaultValue={data?.user?.lastName || ""}
              onChange={(evt) => changeHandler(evt)}
            />
          </div>
        </div>
      )}
      {email && (
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
            disabled={disabled}
            defaultValue={data?.user?.email || ""}
            onChange={(evt) => changeHandler(evt)}
          />
        </div>
      )}
      {regNo && (
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
            disabled={disabled}
            defaultValue={data?.regNo || ""}
            onChange={(evt) => changeHandler(evt)}
          />
        </div>
      )}
      {staffId && (
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
            disabled={disabled}
            defaultValue={data?.staffId || ""}
            onChange={(evt) => changeHandler(evt)}
          />
        </div>
      )}
      {pwd && (
        <>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Password"
              required
              onChange={(evt) => changeHandler(evt)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              onChange={(evt) => changeHandler(evt)}
            />
          </div>
        </>
      )}
      {role && <UserRoles roles={roles} changeHandler={changeHandler} disabled={disabled} />}
    </>
  );
};

export default RegistrationForm;
