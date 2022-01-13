import React from "react";
import { Route, Redirect } from "react-router-dom";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import AdminHeader from "../components/Header/AdminHeader";
import AuthService from "../services/AuthService";
import AdminNav from "../components/Nav/AdminNav";
import AdminFooter from "../components/Footer/AdminFooter";

const PublicLayout = ({ children }) => {
  return (
    <div className="wrapper">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

const PrivateLayout = ({ children, role }) => {
  return (
    <div className="admin-wrapper">
      <AdminHeader />
      <AdminNav role={role} />
      {children}
      <AdminFooter />
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
  let token = AuthService.getToken();
  let role = AuthService.getUserRole();

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
