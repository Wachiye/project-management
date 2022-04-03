import React, { Component } from "react";
import ContactForm from "../components/ContactForm";

import { REACT_APP_SITE } from "../config/env";

export class Contact extends Component {
  render() {
    return (
      <main className="main">
        <div className="container text-center">
          <h1 className="text-success">Contact Us</h1>
          <p className="text-muted">
            Need Help? Please fill out this form and we will get back to you as soon as possible
          </p>
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
                      <span className="mx-1">Email</span>:{" "}
                      <span className="pull-right">
                        <a
                          className="card-link"
                          href={`mailto:${REACT_APP_SITE.EMAIL}?Subject=APAMS%20CONTACT%20FORM`}
                        >
                          {REACT_APP_SITE.EMAIL}
                        </a>
                      </span>
                    </li>
                    <li className="list-group-item">
                      <i className="fa fa-phone" aria-hidden="true"></i>
                      <span className="mx-1">Phone</span>:{" "}
                      <span className="pull-right">
                        <a className="card-link" href={`tel:${REACT_APP_SITE.PHONE}`}>
                          {REACT_APP_SITE.PHONE}
                        </a>
                      </span>
                    </li>
                    <li className="list-group-item">
                      <i className="fa fa-address-card" aria-hidden="true"></i>
                      <span className="mx-1">Address</span>:{" "}
                      <span className="pull-right">
                        <address>{REACT_APP_SITE.ADDRESS}</address>
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
