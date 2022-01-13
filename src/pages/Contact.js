import React, { Component } from "react";
import ContactForm from "../components/ContactForm";

export class Contact extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contact:{
        email:"apams.egerton@gmail.com",
        phone:"254790983123",
        address:"P.O.Box 536, Egerton"
      }
    };
  }

  render() {
    let {contact} = this.state;

    return (
      <main className="main">
        <div className="container text-center">
          <h1 className="text-success">Contact Us</h1>
          <p className="text-muted">Need Help? Please fill out this form and we will get back to you as soon as possible</p>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <ContactForm />
            </div>
            <div className="col-md-6">
              <div className="card shadow bg-light">
                <div className="card-body">
                  <h4 className="card-title">Direct Contact</h4>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <i className="fa fa-envelope" aria-hidden="true"></i>
                      <span className="mx-1">Email</span>: <span className="pull-right">
                          <a className="card-link" href={`mailto:${contact.email}?Subject=APAMS%20CONTACT%20FORM`}>{contact.email}</a>
                      </span>
                    </li>
                    <li className="list-group-item">
                      <i className="fa fa-phone" aria-hidden="true"></i>
                      <span className="mx-1">Phone</span>: <span className="pull-right">
                        <a className="card-link" href={`tel:${contact.phone}`}>{contact.phone}</a>
                      </span>
                    </li>
                    <li className="list-group-item">
                      <i className="fa fa-address-card" aria-hidden="true"></i>
                      <span className="mx-1">Address</span>: <span className="pull-right">
                        <address>{contact.address}</address>
                      </span>
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

export default Contact;
