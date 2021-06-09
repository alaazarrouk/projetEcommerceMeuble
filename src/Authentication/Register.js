import React, { useEffect, useState } from "react";
import "./Register.css";
import { HashLink as Link } from "react-router-hash-link";
import { ToastContainer, toast, Zoom, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Facebook from "../assets/facebook.png";
import GooglePlus from "../assets/google-plus.png";
import Linkedin from "../assets/linkedin.png";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import axios from "../axios";
import { useHistory } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FormHelperText } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  input: {
    background: "white",
    width: "300px",
  },
}));

const Register = ({ isLoggedIn, onChange, onDetectUser }) => {
  const classes = useStyles();
  const [retypePassword, setRetypePassword] = useState("");
  const states = [
    "Aucune",
    "Ariana",
    "Ben arous",
    "Béja",
    "Bizerte",
    "Gabes",
    "Gafsa",
    "Jendouba",
    "Kairouan",
    "Kasserine",
    "Kebili",
    "Kef",
    "Mahdia",
    "Mannouba",
    "Medenine",
    "Monastir",
    "Nabeul",
    "Sfax",
    "Sidi bouzid",
    "Siliana",
    "Sousse",
    "Tataouine",
    "Tozeur",
    "Tunis",
    "Zaghouan",
  ];

  const [person, setPerson] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    state: "Aucune",
    type: "User",
    password: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    state: "",
    password: "",
    retypePassword: "",
  });
  const history = useHistory();

  const handleChange = (event) => {
    event.preventDefault();
    const name = event.target.name;
    const value = event.target.value;
    if (name == "retypePassword") {
      setRetypePassword(value);
    } else {
      setPerson({ ...person, [name]: value });
    }

    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const val = validateForm();
    console.log("form status", val);
    if (val) {
      await axios
        .post(`/register`, person, {
          headers: {
            "x-access-token": "dfdfd",
          },
        })
        .then((response) => {
          if (response.data.result) {
            toast.success("Compte crée avec succées", {
              className: "Toastify__toast",
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
          localStorage.setItem("token", response.data.token);
          onChange(true);
          onDetectUser(response.data.result);
          history.replace({
            pathname: "/products",
            state: {
              categorie: "All",
            },
          });

          setPerson({
            _id: "",
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            address: "",
            state: "Not-Selected",
            type: "User",
            password: "",
          });
          setRetypePassword("");
          console.log(response.data);
        })
        .catch((error) => {
          if (error.response) {
            toast.warning(error.response.data, {
              className: "Toastify__toast",
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
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
    var firstNameError = "",
      lastNameError = "",
      phoneError = "",
      emailError = "",
      addressError = "",
      stateError = "",
      passwordError = "",
      retypePasswordError = "";
    console.log("Im in validation");

    if (person.firstName.length < 4) {
      firstNameError = "Taper 4 charactéres au minimum";
      containsError = true;
    }
    if (person.firstName.length > 3 && person.firstName.includes(" ")) {
      firstNameError = "Taper un nom valide";
      containsError = true;
    }
    if (person.lastName.length < 4) {
      lastNameError = "Taper 4 charactéres au minimum";
      containsError = true;
    }
    if (person.lastName.length > 3 && person.lastName.includes(" ")) {
      lastNameError = "Taper un prénom valide";
      containsError = true;
    }
    if (person.email === "") {
      emailError = "Taper un email valide";
      containsError = true;
    }
    if (person.phone.length < 8) {
      phoneError = "Taper 8 numéros";
      containsError = true;
    }
    if (person.phone.length > 8) {
      phoneError = "Taper 8 numéros";
      containsError = true;
    }
    if (confirmEmail) {
      emailError = "Taper un email valide";
      containsError = true;
    }
    if (person.address.length < 4) {
      addressError = "Taper 4 charactéres au minimum";
      containsError = true;
    }
    if (person.password.length < 4) {
      passwordError = "Taper 4 charactéres au minimum";
      containsError = true;
    }
    if (person.state == "Aucune") {
      stateError = "selectionner une ville";
      containsError = true;
    }
    if (person.password.length > 3 && person.password.includes(" ")) {
      passwordError = "Taper un mot de passe valide";
      containsError = true;
    }
    if (retypePassword !== person.password) {
      retypePasswordError = "Mot de passe incorrect";
      containsError = true;
    }
    setErrors({
      firstName: firstNameError,
      lastName: lastNameError,
      phone: phoneError,
      email: emailError,
      address: addressError,
      state: stateError,
      password: passwordError,
      retypePassword: retypePasswordError,
    });

    console.log(" contains errors:", containsError);

    return !containsError;
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="Register"
    >
      <ToastContainer />
      <div className="register_main">
        <div className="register_content">
          <div className="left_content">
            <div className="register_title">
              <h1>S'inscrire</h1>
            </div>
            <div className="register_icons">
              <div className="register_facebook_icon">
                <img src={Facebook} />
              </div>
              <div className="register_google_icon">
                <img src={GooglePlus} />
              </div>
              <div className="register_linkedin_icon">
                <img src={Linkedin} />
              </div>
            </div>
            <div className="register_subtitle">
              <h3>ou utiliser votre email</h3>
            </div>
            <div className="register_form">
              <form className="form_register">
                <div className="first_container">
                  {errors.firstName ? (
                    <TextField
                      error
                      id="outlined-error-helper-text"
                      name="firstName"
                      helperText={errors.firstName}
                      error
                      label="Nom"
                      InputProps={{ className: classes.input }}
                      variant="outlined"
                      value={person.firstName}
                      onChange={handleChange}
                    />
                  ) : (
                    <TextField
                      name="firstName"
                      id="filled-textarea"
                      label="Nom"
                      InputProps={{ className: classes.input }}
                      variant="outlined"
                      value={person.firstName}
                      onChange={handleChange}
                    />
                  )}
                  {errors.lastName ? (
                    <TextField
                      error
                      id="outlined-error-helper-text"
                      name="lastName"
                      helperText={errors.lastName}
                      error
                      label="Prénom"
                      InputProps={{ className: classes.input }}
                      variant="outlined"
                      value={person.lastName}
                      onChange={handleChange}
                      style={{ marginLeft: ".5em" }}
                    />
                  ) : (
                    <TextField
                      name="lastName"
                      id="filled-textarea"
                      label="Prénom"
                      InputProps={{ className: classes.input }}
                      variant="outlined"
                      value={person.lastName}
                      onChange={handleChange}
                      style={{ marginLeft: ".5em" }}
                    />
                  )}
                </div>
                <div className="second_container">
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
                    />
                  )}
                  {errors.phone ? (
                    <TextField
                      error
                      id="outlined-error-helper-text"
                      name="phone"
                      helperText={errors.phone}
                      error
                      label="Téléphone"
                      InputProps={{ className: classes.input }}
                      variant="outlined"
                      value={person.phone}
                      onChange={handleChange}
                      style={{ marginLeft: ".5em" }}
                    />
                  ) : (
                    <TextField
                      name="phone"
                      id="filled-textarea"
                      label="Téléphone"
                      InputProps={{ className: classes.input }}
                      variant="outlined"
                      value={person.phone}
                      onChange={handleChange}
                      style={{ marginLeft: ".5em" }}
                    />
                  )}
                </div>
                <div className="third_container">
                  {errors.address ? (
                    <TextField
                      error
                      id="outlined-error-helper-text"
                      name="address"
                      helperText={errors.address}
                      error
                      label="Addresse"
                      InputProps={{ className: classes.input }}
                      variant="outlined"
                      value={person.address}
                      onChange={handleChange}
                    />
                  ) : (
                    <TextField
                      name="address"
                      id="filled-textarea"
                      label="Addresse"
                      InputProps={{ className: classes.input }}
                      variant="outlined"
                      value={person.address}
                      onChange={handleChange}
                    />
                  )}
                  {errors.state ? (
                    <FormControl
                      error
                      id="outlined-error-helper-text"
                      variant="outlined"
                      style={{ marginLeft: ".5em" }}
                    >
                      <InputLabel htmlFor="outlined-age-native-simple">
                        Ville
                      </InputLabel>
                      <Select
                        name="state"
                        className={classes.input}
                        native
                        label="Ville"
                        onChange={handleChange}
                        value={person.state}
                      >
                        {states.map((city) => {
                          return <option value={city}>{city}</option>;
                        })}
                      </Select>
                      <FormHelperText>{errors.state}</FormHelperText>
                    </FormControl>
                  ) : (
                    <FormControl
                      variant="outlined"
                      className={classes.input}
                      style={{ marginLeft: ".5em" }}
                    >
                      <InputLabel htmlFor="outlined-age-native-simple">
                        Ville
                      </InputLabel>
                      <Select
                        name="state"
                        native
                        label="Ville"
                        onChange={handleChange}
                        value={person.state}
                      >
                        {states.map((city) => {
                          return <option value={city}>{city}</option>;
                        })}
                      </Select>
                    </FormControl>
                  )}
                </div>
                <div className="forth_container">
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
                  {errors.retypePassword ? (
                    <TextField
                      error
                      id="outlined-error-helper-text"
                      label="Password"
                      name="retypePassword"
                      type="password"
                      helperText={errors.retypePassword}
                      error
                      InputProps={{ className: classes.input }}
                      variant="outlined"
                      value={retypePassword}
                      style={{ marginLeft: ".5em" }}
                      onChange={handleChange}
                    />
                  ) : (
                    <TextField
                      name="retypePassword"
                      id="standard-password-input"
                      label="Confirmer mot de passe "
                      type="password"
                      InputProps={{ className: classes.input }}
                      autoComplete="current-password"
                      variant="outlined"
                      style={{ marginLeft: ".5em" }}
                      value={retypePassword}
                      onChange={handleChange}
                    />
                  )}
                </div>
                <div className="button_signin">
                  <button className="signin_button" onClick={handleSubmit}>
                    S'inscrire
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="right_content">
            <div className="register_welcome">
              <h1>Bienvenue !</h1>
            </div>
            <div className="register_welcome_text">
              " Vous ne regrettez pas d'avoir visiter notre site dotté de piéces
              uniques. "
            </div>
            <div className="button_register">
              <Link to="/login">
                <button className="register_button"> Se Connecter</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;
