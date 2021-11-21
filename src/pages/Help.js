import React, { Component } from "react";

export class HelpPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(evt) {
    const data = evt.target.value;
    this.setState(...this.state, {
      [evt.target.name]: data,
    });
  }

  render() {
    return (
      <main className="main">
        <div className="container text-center">
          <h1 className="text-success">Help</h1>
          <p className="text-muted">Need Help? Please fill out this form and we will get back to you as soon as possible</p>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  placeholder="Enter your first name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  placeholder="Enter your last name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="Enter email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  Message
                </label>
                <textarea
                  className="form-control"
                  id="message"
                  name="message"
                  rows="5"
                  placeholder="Type your message request here"
                ></textarea>
              </div>
              <div className="my-2">
                <button name="btnHelp" id="btnHelp" class="btn btn-success"  type="button">Send Message</button>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow bg-light">
                <div className="card-body">
                  <h4 className="card-title">Other support links</h4>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <i className="fa fa-envelope" aria-hidden="true"></i>
                      <span className="mx-1">Email</span>: <span className="pull-right">{'email'}</span>
                    </li>
                    <li className="list-group-item">
                      <i className="fa fa-phone" aria-hidden="true"></i>
                      <span className="mx-1">Phone</span>: <span className="pull-right">{'phone'}</span>
                    </li>
                    <li className="list-group-item">
                      <i className="fa fa-address-card" aria-hidden="true"></i>
                      <span className="mx-1">Address</span>: <span className="pull-right">{'address'}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default HelpPage;
