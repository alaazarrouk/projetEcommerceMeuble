import React, { useEffect, useState } from "react";
import "./Login.css";
import { HashLink as Link } from "react-router-hash-link";
import Facebook from "../assets/facebook.png";
import GooglePlus from "../assets/google-plus.png";
import Linkedin from "../assets/linkedin.png";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import axios from "../axios";
import { ToastContainer, toast, Zoom, Bounce } from "react-toastify";
import { useHistory } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const useStyles = makeStyles((theme) => ({
  input: {
    background: "white",
    width: "300px",
  },
}));
const Login = ({ isLoggedIn, onChange, onDetectUser }) => {
  const classes = useStyles();
  const [person, setPerson] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const history = useHistory();

  const handleChange = (event) => {
    event.preventDefault();
    const name = event.target.name;
    const value = event.target.value;
    setPerson({ ...person, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const val = validateForm();
    console.log("form status", val);
    if (val) {
      await axios
        .post(`/login`, person)
        .then((response) => {
          console.log(response.data);
          localStorage.setItem("token", response.data.token);
          onChange(true);
          onDetectUser(response.data.result);
          if (response.data.result.type == "User") {
            history.replace({
              pathname: "/products",
              state: {
                categorie: "All",
              },
            });
          } else {
            history.replace("/admin");
          }
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status == "404") {
              console.log("erreur 404 erreur");
              setErrors({ email: "Addresse mail incorrecte", password: "" });
            } else {
              console.log("erreur 405 erreur");
              setErrors({ email: "", password: "Mot de passe incorrecte" });
            }
          }
        });
    } else {
      console.log("im herer");
    }
  };
  function validateForm() {
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const confirmEmail = !person.email.match(mailformat);
    var containsError = false;
    var emailError = "",
      passwordError = "";

    if (person.email === "") {
      emailError = "Taper un email valide";
      containsError = true;
    }

    if (confirmEmail) {
      emailError = "Taper un email valide";
      containsError = true;
    }

    if (person.password.length < 4) {
      passwordError = "Taper 4 charactéres au minimum";
      containsError = true;
    }

    if (person.password.length > 3 && person.password.includes(" ")) {
      passwordError = "Taper un mot de passe valide";
      containsError = true;
    }
    setErrors({
      email: emailError,
      password: passwordError,
    });

    console.log(" contains errors:", containsError);

    return !containsError;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="Login"
    >
      <div className="login_main">
        <div className="login_content">
          <div className="right_content">
            <div className="login_welcome">
              <h1>Content de vous revoir !</h1>
            </div>
            <div className="login_welcome_text">
              " Vous ne regrettez pas d'avoir visiter notre site dotté de piéces
              uniques. "
            </div>
            <div className="button_register">
              <Link to="/register">
                <button className="register_button"> Register</button>
              </Link>
            </div>
          </div>
          <div className="left_content">
            <div className="login_title">
              <h1>Se Connecter</h1>
            </div>
            <div className="login_icons">
              <div className="login_facebook_icon">
                <img src={Facebook} />
              </div>
              <div className="login_google_icon">
                <img src={GooglePlus} />
              </div>
              <div className="login_linkedin_icon">
                <img src={Linkedin} />
              </div>
            </div>
            <div className="login_subtitle">
              <h3>ou utiliser votre email</h3>
            </div>
            <div className="login_form">
              <form className="form_login">
                {errors.email ? (
                  <TextField
                    error
                    id="outlined-error-helper-text"
                    name="email"
                    helperText={errors.email}
                    error
                    label="Adresse Email"
                    InputProps={{ className: classes.input }}
                    variant="outlined"
                    value={person.email}
                    onChange={handleChange}
                    style={{ marginBottom: "1em" }}
                  />
                ) : (
                  <TextField
                    name="email"
                    id="filled-textarea"
                    label="Adresse Email"
                    InputProps={{ className: classes.input }}
                    variant="outlined"
                    value={person.email}
                    onChange={handleChange}
                    style={{ marginBottom: "1em" }}
                  />
                )}
                {errors.password ? (
                  <TextField
                    error
                    id="outlined-error-helper-text"
                    label="Password"
                    name="password"
                    type="password"
                    helperText={errors.password}
                    error
                    InputProps={{ className: classes.input }}
                    variant="outlined"
                    value={person.password}
                    onChange={handleChange}
                  />
                ) : (
                  <TextField
                    id="standard-password-input"
                    label="Password"
                    name="password"
                    type="password"
                    InputProps={{ className: classes.input }}
                    variant="outlined"
                    autoComplete="current-password"
                    value={person.password}
                    onChange={handleChange}
                  />
                )}
                <div className="button_signin">
                  <button className="signin_button" onClick={handleSubmit}>
                    Se Connecter
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
