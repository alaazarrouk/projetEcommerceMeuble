import "./App.css";
import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Accueil from "./Home/Accueil";
import NavBar from "./NavBar";
import Login from "./Authentication/Login";
import Register from "./Authentication/Register";
import MainProducts from "./Products/MainProducts";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Basket from "./Orders/Basket";
import Payment from "./Orders/Payment";
import Infos from "./User/Infos";

import Orders from "./Orders/Orders";
import Admin from "./Admin/Admin";
import Clients from "./Admin/Clients";
import Messages from "./Admin/Messages";
import Products from "./Admin/Products";
import OrdersAdmin from "./Admin/OrdersAdmin";
import axios from "./axios";
import ProtectedRoute from "./ProtectedRoute";
import { AnimatePresence, motion } from "framer-motion";
import { useStateValue } from "./StateProvider";
import { ToastContainer, toast, Zoom, Bounce } from "react-toastify";

function App() {
  const [{ user, basket }, dispatch] = useStateValue();
  const [refresh, setRefresh] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userLogged, setUserLogged] = useState({});

  useEffect(async () => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
      await axios
        .get(`/get/user/id/` + parseJwt(localStorage.getItem("token")).id, {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        })
        .then((response) => {
          setIsLoggedIn(true);
          setUserLogged(response.data);
          dispatch({
            type: "SET_USER",
            user: response.data,
          });
        });
    } else {
      dispatch({
        type: "SET_USER",
        user: null,
      });
    }
  }, [isLoggedIn]);

  function parseJwt(token) {
    if (!token) {
      return;
    }
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  }
  return (
    <Router>
      <div className="App">
        <ToastContainer />
        <NavBar
          isLoggedIn={isLoggedIn}
          onChange={(value) => setIsLoggedIn(value)}
        />
        <AnimatePresence>
          <Switch>
            <ProtectedRoute
              path="/login"
              component={Login}
              isLoggedIn={isLoggedIn}
              onChange={(value) => setIsLoggedIn(value)}
              onDetectUser={(value) => setUserLogged(value)}
              mustLogIn="false"
              componentName="Login"
              use="User"
            ></ProtectedRoute>

            <ProtectedRoute
              path="/register"
              component={Register}
              isLoggedIn={isLoggedIn}
              onChange={(value) => setIsLoggedIn(value)}
              mustLogIn="false"
              componentName="Register"
              use="User"
            ></ProtectedRoute>

            <ProtectedRoute
              path="/products"
              component={MainProducts}
              isLoggedIn={isLoggedIn}
              onChange={(value) => setIsLoggedIn(value)}
              mustLogIn="true"
              componentName="MainProducts"
              use="User"
            ></ProtectedRoute>

            <ProtectedRoute
              path="/basket"
              component={Basket}
              isLoggedIn={isLoggedIn}
              onChange={(value) => setIsLoggedIn(value)}
              mustLogIn="true"
              componentName="Basket"
              use="User"
            ></ProtectedRoute>

            <ProtectedRoute
              path="/payment"
              component={Payment}
              isLoggedIn={isLoggedIn}
              onChange={(value) => setIsLoggedIn(value)}
              mustLogIn="true"
              componentName="Payment"
              use="User"
            ></ProtectedRoute>

            <ProtectedRoute
              path="/user-infos"
              component={Infos}
              isLoggedIn={isLoggedIn}
              onChange={(value) => setIsLoggedIn(value)}
              mustLogIn="true"
              use="User"
            ></ProtectedRoute>

            <ProtectedRoute
              path="/orders"
              component={Orders}
              isLoggedIn={isLoggedIn}
              onChange={(value) => setIsLoggedIn(value)}
              mustLogIn="true"
              use="User"
            ></ProtectedRoute>
            <Route path="/home">
              <Accueil />
              <Footer />
            </Route>
            <ProtectedRoute
              path="/admin-clients"
              component={Clients}
              isLoggedIn={isLoggedIn}
              onChange={(value) => setIsLoggedIn(value)}
              mustLogIn="true"
              use="Admin"
            ></ProtectedRoute>
            <ProtectedRoute
              path="/admin-products"
              component={Products}
              isLoggedIn={isLoggedIn}
              onChange={(value) => setIsLoggedIn(value)}
              mustLogIn="true"
              use="Admin"
            ></ProtectedRoute>
            <ProtectedRoute
              path="/admin-orders"
              component={OrdersAdmin}
              isLoggedIn={isLoggedIn}
              onChange={(value) => setIsLoggedIn(value)}
              mustLogIn="true"
              use="Admin"
            ></ProtectedRoute>
            <ProtectedRoute
              path="/admin"
              component={Admin}
              isLoggedIn={isLoggedIn}
              onChange={(value) => setIsLoggedIn(value)}
              mustLogIn="true"
              use="Admin"
            ></ProtectedRoute>
            <ProtectedRoute
              path="/admin-messages"
              component={Messages}
              isLoggedIn={isLoggedIn}
              onChange={(value) => setIsLoggedIn(value)}
              mustLogIn="true"
              use="Admin"
            ></ProtectedRoute>

            {isLoggedIn ? (
              userLogged.type == "Admin" ? (
                <Route path="/">
                  <Admin />
                  <Footer />
                </Route>
              ) : (
                <Route path="/">
                  <Accueil />
                  <Footer />
                </Route>
              )
            ) : (
              <Route path="/">
                <Accueil />
                <Footer />
              </Route>
            )}
          </Switch>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
