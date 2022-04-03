import * as $ from "jquery";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ModalContainer from "./Modal/ModalContainer";
import ContactForm from "./ContactForm";
import AuthService from "../services/AuthService";
import UserService from "../services/UserService";

const Help = () => {
  const [active, setActive] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const email = AuthService.getUserEmail();
    UserService.getOneByEmail(email).then((res) => {
      setUser(res?.data?.data || null);
    });
  }, []);

  const showHelp = (evt) => {
    const targetId = evt.target.getAttribute("data-target");
    toggleClass("help-item", targetId);
  };

  const toggleClass = (groupClass, targetId) => {
    $(`.${groupClass}`).removeClass("active");
    $(`#${targetId}`).toggleClass("active");
  };

  return (
    <div className="admin-main">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 mb-2">
            <div className="d-flex justify-content-between align-items-center">
              <div> </div>
              <h3>Help</h3>
              <div>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setActive(true)}
                >
                  Contact Us
                </button>
                <ModalContainer
                  id="new-comment"
                  title={"Contact Us"}
                  active={active}
                  setActive={setActive}
                  size="md"
                >
                  <ContactForm user={user} />
                </ModalContainer>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-10 mx-auto">
            <div className="card bg-transparent border-0 mb-1">
              <div className="card-body">
                <h4 className="card-title text-muted">
                  Academic Project Approval and Management System
                </h4>
                <p>
                  Academic Project Approval and Management System is a web-based software
                  application. The main purpose of this system is to automate all the
                  project-management operations in academics and create an effective and efficient
                  platform for students and their project supervisors and evaluators.
                </p>
              </div>
            </div>
            <div className="card bg-transparent border-0 mb-2">
              <div id="account-management" className="card-body ">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <h5 className="pull-left text-primary pull-left">Getting Started</h5>
                    <span
                      className="btn btn-sm btn-primary pull-right"
                      data-target="getting-started"
                      onClick={(evt) => showHelp(evt)}
                    >
                      <i className="fa fa-plus"></i>
                    </span>
                    <div className="clearfix"></div>
                    <div id="getting-started" className="help-item">
                      <div>
                        The System is designed to be used by different types of users, with features
                        and functions appropriate for each one. The system will support fours types
                        of user: Administrator, Evaluator, Supervisor and Student. <br />
                        <ul style={{ listStyle: "inside" }}>
                          <li>Administrators have full control over the entire system.</li>
                          <li>
                            Evaluators can approve projects, allocate project supervisors, evaluate
                            the project progress and grading.
                          </li>
                          <li>
                            Supervisors can guide students on the project, review and approve
                            project files, oversee project progress and
                          </li>
                          <li>
                            Students can submit project ideas and related files, use the system for
                            managing and track the progress their projects.
                          </li>
                        </ul>
                      </div>
                      <p>
                        Only students will be allowed to register publicly. Project Evaluators will
                        be added by the system administrators. Project Supervisors will be added by
                        Project Evaluators.
                      </p>
                      <div>
                        <strong>To Create a Student Account:</strong> <br />
                        <ul style={{ listStyle: "inside" }}>
                          <li>
                            Go to the{" "}
                            <Link className="card-link" to="/">
                              Homepage
                            </Link>
                          </li>
                          <li>
                            Select <b>Register</b> on the Top Navigation Bar or Click the large{" "}
                            <strong>Get Started</strong> button available on the homepage
                          </li>
                          <li>
                            Enter your Names(First and Last Names), valid email address,
                            Registration Number and select a memorable password.{" "}
                            <em className="text-info">
                              Registration number and Email should be unique to the system
                            </em>
                          </li>
                          <li>
                            Hit the <strong>Register</strong> button to submit your details
                          </li>
                          <li>Wait for the server response.</li>
                          <li>
                            Your registration verification link will be send to the provided email.
                            You must click the link to verify and activate your account
                          </li>
                          <li>
                            Upon successful registration, you will be able to login your account
                            using the provided email and password{" "}
                          </li>
                        </ul>
                      </div>
                      <div>
                        <strong>To Create Administrator/Evaluator/Supervisor Account:</strong>{" "}
                        <br />
                        <ul style={{ listStyle: "inside" }}>
                          <li>
                            Actor (<strong>Administrator </strong>/ <strong>Evaluator</strong>) has
                            be Authenticated and Authorized to perform this action.
                          </li>
                          <li>
                            <Link className="card-link" to="/login">
                              Login
                            </Link>{" "}
                            to your account using your email and password.
                          </li>
                          <li>
                            On the <strong>Dashboard Menu</strong>, Select{" "}
                            <strong>Users/Students/Staff</strong>
                          </li>
                          <li>
                            Select <strong>New User</strong> button.
                          </li>
                          <li>
                            Enter the Names(First and Last Names), valid email address, Registration
                            Number/Staff Id and select a memorable password.{" "}
                            <em className="text-info">
                              Registration number/Staff ID and Email should be unique to the system
                            </em>
                          </li>
                          <li>
                            Hit the <strong>Register</strong> button to submit the details
                          </li>
                          <li>Wait for the server response.</li>
                          <li>
                            A registration verification link will be send to the provided email.
                            User must click the link to verify and activate their account
                          </li>
                          <li>
                            Upon successful registration, the registered user will be able to login
                            to their account using the provided email and password{" "}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item">
                    <h5 className="pull-left text-primary pull-left">System Login</h5>
                    <span
                      className="btn btn-sm btn-primary pull-right"
                      data-target="system-login"
                      onClick={(evt) => showHelp(evt)}
                    >
                      <i className="fa fa-plus"></i>
                    </span>
                    <div className="clearfix"></div>
                    <div id="system-login" className="help-item">
                      <p>
                        To login, you must have{" "}
                        <a href="#get-started">a registered and confirmed user account</a>
                      </p>
                      <div>
                        <strong>To Login to your Account:</strong> <br />
                        <ul style={{ listStyle: "inside" }}>
                          <li>
                            Go to the{" "}
                            <Link className="card-link" to="/">
                              Homepage
                            </Link>
                          </li>
                          <li>
                            On the Navigation bar, Select{" "}
                            <Link className="card-link" to="/login">
                              Login
                            </Link>
                            .
                          </li>
                          <li>
                            Enter your <strong>email and password</strong>
                          </li>
                          <li>
                            Hit the <strong>Login</strong> button and wait for the server to
                            authenticate and authorize your details
                          </li>
                          <li>
                            If login is successful, you will be automatically be redirected to your
                            dashboard. Otherwise, an error message will be shown as appropriate
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item">
                    <h5 className="pull-left text-primary pull-left">Forgot Password</h5>
                    <span
                      className="btn btn-sm btn-primary pull-right"
                      data-target="forgot-password"
                      onClick={(evt) => showHelp(evt)}
                    >
                      <i className="fa fa-plus"></i>
                    </span>
                    <div className="clearfix"></div>
                    <div id="forgot-password" className="help-item">
                      <p>
                        Even though you may have previously used a memorable password, it is
                        possible to forget it.
                      </p>
                      <div>
                        <strong>To Reset your lost password:</strong> <br />
                        <ul style={{ listStyle: "inside" }}>
                          <li>
                            Go to the{" "}
                            <Link className="card-link" to="/">
                              Homepage
                            </Link>
                          </li>
                          <li>
                            On the Navigation bar, Select{" "}
                            <Link className="card-link" to="/login">
                              Login
                            </Link>
                            .
                          </li>
                          <li>
                            On the login page, Select <strong>Forgot Password</strong>{" "}
                          </li>
                          <li>Enter the email you provided during registration</li>
                          <li>
                            Hit the <strong>Reset Password</strong> button and wait for the server
                            send a random password to your email
                          </li>
                          <li>Use the new password as your password to login.</li>
                          <li>
                            Remember to <a href="manage-account-info">change your password</a> after
                            successful login
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item">
                    <h5 className="pull-left text-primary pull-left">
                      Managing Account Information
                    </h5>
                    <span
                      className="btn btn-sm btn-primary pull-right"
                      data-target="managing-account-info"
                      onClick={(evt) => showHelp(evt)}
                    >
                      <i className="fa fa-plus"></i>
                    </span>
                    <div className="clearfix"></div>
                    <div id="manage-account-info" className="help-item">
                      <p>Each user has the privilege to manage(View/edit/delete) their account</p>
                      <div>
                        <strong>To Manage your Account:</strong> <br />
                        <ul style={{ listStyle: "inside" }}>
                          <li>
                            On the <strong>Dashboard Menu</strong>, Select <strong>Profile</strong>.
                            Profile Page will appear
                          </li>
                          <li>
                            You can enter new details or change your password on the profile page
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item">
                    <h5 className="pull-left text-primary pull-left">Opening Project Journal</h5>
                    <button
                      className="btn btn-sm btn-primary pull-right"
                      data-target="project-journal"
                      onClick={(evt) => showHelp(evt)}
                    >
                      <i className="fa fa-plus"></i>
                    </button>
                    <div className="clearfix"></div>
                    <div id="project-journal" className="help-item">
                      <p>
                        Opening Project Journal is to create new project. The project will be
                        visible to the student and their Evaluator. The Evaluator will be able to
                        review the project and approve or provide feedback/comments on the project.
                      </p>
                      <div>
                        <strong>NOTE:</strong> <br />
                        <ol style={{ listStyle: "inside" }} start={1}>
                          <li>Only Students can open a project journal</li>
                          <li>Project Evaluators must be registered in the system</li>
                          <li>
                            Students will only be allowed to open project journals during the
                            specified period. (Set by the Evaluator)
                          </li>
                        </ol>
                      </div>
                      <div>
                        <strong>To Open a Project Journal / Create a new project:</strong> <br />
                        <ul style={{ listStyle: "inside" }}>
                          <li>
                            On the <strong>Dashboard Menu</strong>, Select{" "}
                            <strong>New Project</strong>. New Project page will appear
                          </li>
                          <li>Enter the details of the project as required</li>
                          <li>
                            Hit the <strong>Submit Project</strong> button and wait for the server
                            response
                          </li>
                          <li>
                            If the project is created successfully, the selected Evaluator will
                            receive a confirmation email that will prompt him/her to check the
                            project details for approval
                          </li>
                          <li>
                            <em className="text-info">
                              To view your created project, click on the{" "}
                              <strong>My Projects</strong> button available on the New Project Page
                            </em>{" "}
                            Or <br />
                            On the <strong>Dashboard Menu</strong>, Select{" "}
                            <strong>My Projects</strong>. A new page will appear with a listing of
                            your projects and links to other details.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item">
                    <h5 className="pull-left text-primary pull-left">Approving Projects</h5>
                    <button
                      className="btn btn-sm btn-primary pull-right"
                      data-target="approving-projects"
                      onClick={(evt) => showHelp(evt)}
                    >
                      <i className="fa fa-plus"></i>
                    </button>
                    <div className="clearfix"></div>
                    <div id="approving-projects" className="help-item">
                      <p>
                        All projects will have a status of <em>WAITING APPROVAL</em> until approved.
                        An approved project will have a status of <em>ACCEPTED</em> while a rejected
                        project will have a status of <em>REJECTED</em>
                      </p>
                      <div>
                        <strong>NOTE:</strong> <br />
                        <ol style={{ listStyle: "inside" }} start={1}>
                          <li>
                            Only Project Evaluators can view and/or approve or reject all projects
                            with <em>WAITING APPROVAL</em> status. However, students can view their
                            individual projects regardless of the status unless otherwise deleted
                          </li>
                          <li>
                            Supervisor cannot be assigned to a project that has not been ACCEPTED
                          </li>
                        </ol>
                      </div>
                      <div>
                        <strong>To Approve Pending Projects:</strong> <br />
                        <ul style={{ listStyle: "inside" }}>
                          <li>
                            On the <strong>Dashboard Menu</strong>, Select{" "}
                            <strong>Approve Projects</strong>. A new Project page will appear
                            listing all projects with a status of <em>WAITING APPROVAL</em>
                          </li>
                          <li>
                            For each project that you wish to approve, Hit the{" "}
                            <strong>Approve</strong> button next to it. You can also view the
                            project details by clicking the <strong>View</strong> button next to it.
                          </li>
                          <li>
                            Once a project has been accepted by the Evaluator, the respective
                            student will be notified via email.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item">
                    <h5 className="pull-left text-primary pull-left">Creating Milestone</h5>
                    <button
                      className="btn btn-sm btn-primary pull-right"
                      data-target="creating-milestones"
                      onClick={(evt) => showHelp(evt)}
                    >
                      <i className="fa fa-plus"></i>
                    </button>
                    <div className="clearfix"></div>
                    <div id="creating-milestones" className="help-item">
                      <p>
                        Project milestones are checkpoints in the project that measure the progress
                        of the project
                      </p>
                      <div>
                        <strong>NOTE:</strong> <br />
                        <ol style={{ listStyle: "inside" }} start={1}>
                          <li>Only students can create a project milestone</li>
                          <li>
                            Project milestones will be visible to the student, supervisor and
                            evaluator
                          </li>
                        </ol>
                      </div>
                      <div>
                        <strong>To Create a Project Milestone:</strong> <br />
                        <ul style={{ listStyle: "inside" }}>
                          <li>
                            On the <strong>Dashboard Menu</strong>, Select{" "}
                            <strong>My Projects</strong>. A new page will appear listing all your
                            projects{" "}
                          </li>
                          <li>
                            On the dropdown list{" "}
                            <strong>Select the project you want to add milestone</strong>
                          </li>
                          <li>
                            On the tab menu below the dropdown list,{" "}
                            <strong>Click Milestones</strong>. A new page will appear listing all
                            milestones available in the project if any.
                          </li>
                          <li>
                            On to top right <strong>Click New Milestone</strong> button to display a
                            pop window.
                          </li>
                          <li>
                            Enter the required details and click the{" "}
                            <strong> Create Milestone</strong> button.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item">
                    <h5 className="pull-left text-primary pull-left">Creating Tasks</h5>
                    <button
                      className="btn btn-sm btn-primary pull-right"
                      data-target="creating-tasks"
                      onClick={(evt) => showHelp(evt)}
                    >
                      <i className="fa fa-plus"></i>
                    </button>
                    <div className="clearfix"></div>
                    <div id="creating-tasks" className="help-item">
                      <p>
                        Tasks are actual project activities done under a particular project
                        milestone
                      </p>
                      <div>
                        <strong>NOTE:</strong> <br />
                        <ol style={{ listStyle: "inside" }} start={1}>
                          <li>A task can only exist in a project milestone</li>
                          <li>
                            Only student owner of the project can create/manage the project tasks
                          </li>
                        </ol>
                      </div>
                      <div>
                        <strong>To Create a Task:</strong> <br />
                        <ul style={{ listStyle: "inside" }}>
                          <li>
                            Navigate to the project milestones as described in the{" "}
                            <a href="#creating-milestones">Create Milestone</a> section.
                          </li>
                          <li>
                            If no milestone is present, create a new milestone and proceed below
                          </li>
                          <li>
                            Click the <strong>+</strong> button next to the milestone under which
                            your task will belong. A new section will appear below the milestone
                            listing all task in the milestone
                          </li>
                          <li>
                            Click the <strong>New Task</strong> button. A new pop up
                          </li>
                          <li>
                            Enter the required details and click the <strong> Create Task</strong>{" "}
                            button.
                          </li>
                          <li>Refresh the page to view your newly created task</li>
                        </ul>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item">
                    <h5 className="pull-left text-primary pull-left">Uploading Project File</h5>
                    <button
                      className="btn btn-sm btn-primary pull-right"
                      data-target="uploading-project-files"
                      onClick={(evt) => showHelp(evt)}
                    >
                      <i className="fa fa-plus"></i>
                    </button>
                    <div className="clearfix"></div>
                    <div id="uploading-project-files" className="help-item">
                      <p>
                        Project Files are the documentations such as Project Proposal, SRS, SDD and
                        Manuals
                      </p>
                      <div>
                        <strong>NOTE:</strong> <br />
                        <ol style={{ listStyle: "inside" }} start={1}>
                          <li>Only student owner of the project can submit the project files</li>
                          <li>Project Supervisor or Evaluator can approve or reject files</li>
                        </ol>
                      </div>
                      <div>
                        <strong>To Upload a Project File:</strong> <br />
                        <ul style={{ listStyle: "inside" }}>
                          <li>
                            On the <strong>Dashboard Menu</strong>, Select{" "}
                            <strong>My Projects</strong>. A new page will appear listing all your
                            projects{" "}
                          </li>
                          <li>
                            On the dropdown list{" "}
                            <strong>Select the project you want to add file</strong>
                          </li>
                          <li>
                            On the tab menu below the dropdown list, <strong>Click Files</strong>. A
                            new page will appear listing all files available in the project if any.
                          </li>
                          <li>
                            On to top right <strong>Click New File</strong> button to display a pop
                            window.
                          </li>
                          <li>
                            Enter the required details and click the <strong> Upload File</strong>{" "}
                            button.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Help;
