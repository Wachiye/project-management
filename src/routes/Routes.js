import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import AdminHeader from '../components/Header/AdminHeader';
import AuthService from '../services/AuthService';
import AdminNav from '../components/Nav/AdminNav';
import AdminFooter from '../components/Footer/AdminFooter';
import $ from 'jquery';

const PublicLayout = ({ children }) => {
  function toggleNav() {
    $('.navbar-collapse').removeClass('show');
  }
  return (
    <div className="wrapper">
      <Header />
      {toggleNav()}
      {children}
      <Footer />
    </div>
  );
};

const PrivateLayout = ({ children, role }) => {
  function toggleNav() {
    $('.admin-nav').removeClass('active');
  }
  return (
    <div className="admin-wrapper">
      <AdminHeader />
      <AdminNav role={role} />
      <>
        {toggleNav()}
        {children}
      </>
      <AdminFooter/>
    </div>
  );
};

const PublicRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (
        <PublicLayout>
          <Component {...props} />
        </PublicLayout>
      )}
    />
  );
};

const PrivateRoute = ({ component: Component, ...rest }) => {
  const token = AuthService.getToken();
  const role = AuthService.getUserRole();

  if (!token) {
    return <Redirect to="/login" />;
  } else {
    return (
      <Route
        {...rest}
        render={(props) => (
          <PrivateLayout role={role}>
            <Component {...props} />
          </PrivateLayout>
        )}
      />
    );
  }
};
export { PublicRoute, PrivateRoute, PublicLayout, PrivateLayout };
