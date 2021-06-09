import React from "react";
import { Route, Redirect } from "react-router-dom";
import Footer from "./Footer";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const promise = loadStripe(
  "pk_test_51HpdngGvHaENfAb1wD7aqjlFrhQR4FBCplJwGu5Oj6vhKTg5KWnFYicVYnKLjeLojfBuTJ7wfLaAy8xF1WBySC9d00OHnEIqTg"
);

const ProtectedRoute = ({
  path,
  isLoggedIn,
  component: Component,
  onChange,
  onDetectUser,
  mustLogIn,
  componentName,
  use,
  ...rest
}) => {
  if (isLoggedIn) {
    if (mustLogIn == "false") {
      return (
        <Route>
          <Redirect from={path} to="/" />;
          <Footer />
        </Route>
      );
    } else {
      if (use == "Admin") {
        return (
          <Route>
            <Component isLoggedIn={isLoggedIn} onChange={onChange} />
          </Route>
        );
      } else {
        if (componentName === "Payment") {
          return (
            <Route>
              <Elements stripe={promise}>
                <Component isLoggedIn={isLoggedIn} onChange={onChange} />
              </Elements>

              <Footer />
            </Route>
          );
        } else {
          return (
            <Route>
              <Component isLoggedIn={isLoggedIn} onChange={onChange} />
              <Footer />
            </Route>
          );
        }
      }
    }
  } else {
    if (mustLogIn == "true") {
      return (
        <Route>
          <Redirect from={path} to="/login" />;
          <Footer />
        </Route>
      );
    } else {
      if (use == "Admin") {
        return (
          <Route>
            <Component
              isLoggedIn={isLoggedIn}
              onChange={onChange}
              onDetectUser={onDetectUser}
            />
          </Route>
        );
      } else {
        return (
          <Route>
            <Component
              isLoggedIn={isLoggedIn}
              onChange={onChange}
              onDetectUser={onDetectUser}
            />
            <Footer />
          </Route>
        );
      }
    }
  }
};

export default ProtectedRoute;
