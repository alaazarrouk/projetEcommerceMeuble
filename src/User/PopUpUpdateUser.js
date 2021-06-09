import React, { useEffect, useState } from "react";
import "./PopUpUpdateUser.css";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import { ToastContainer, toast, Zoom, Bounce } from "react-toastify";
import axios from "../axios";
import { FormHelperText } from "@material-ui/core";
import { useStateValue } from "../StateProvider";

const useStyles = makeStyles((theme) => ({
  input: {
    background: "white",

    width: "300px",
    height: "auto",
    color: "#0b1c39",
    "&.Mui-focused": {
      color: "#0b1c39",
    },
  },
  inputDescription: {
    background: "white",

    width: "618px",
    height: "auto",
    color: "#0b1c39",
    "&.Mui-focused": {
      color: "#0b1c39",
    },
  },
}));

const PopUpUpdateUser = ({ refresh, onChange, userInfo, controller }) => {
  const classes = useStyles();
  const [{}, dispatch] = useStateValue();
  const [user, setUser] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    state: "",
    type: "",
    email: "",
    password: "",
    status: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    state: "",
    type: "",
    email: "",
    password: "",
    status: "",
  });
  const states = [
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
  useEffect(() => {
    setUser({
      _id: userInfo ? userInfo._id : "",
      firstName: userInfo ? userInfo.firstName : "",
      lastName: userInfo ? userInfo.lastName : "",
      phone: userInfo ? userInfo.phone : "",
      address: userInfo ? userInfo.address : "",
      state: userInfo ? userInfo.state : "",
      type: userInfo ? userInfo.type : "",
      email: userInfo ? userInfo.email : "",
      password: "",
      status: userInfo ? userInfo.status : "",
    });
  }, [userInfo._id]);

  const handleChange = (event) => {
    event.preventDefault();
    const name = event.target.name;
    var value = event.target.value;
    setErrors({ ...errors, [name]: "" });
    setUser({ ...user, [name]: value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const val = validateForm();
    console.log("form status", val);
    if (val) {
      await axios
        .patch(`/update/user/${userInfo._id}`, user, {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        })
        .then((response) => {
          console.log(response);
          if (response.data.updatedUser.nModified == 0) {
            toast.warning(`Changer quelque chose svp`, {
              className: "Toastify__toast",
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: false,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
            });
          } else {
            if (controller == "User") {
              toast.success(`Vos données ont été modifiées  avec succées`, {
                className: "Toastify__toast",
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              dispatch({
                type: "SET_USER",
                user: response.data.user,
              });
              userInfo = user;
              onChange(user);
            } else {
              toast.success(`Les données ont été modifiées  avec succées`, {
                className: "Toastify__toast",
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              userInfo = user;
              onChange(!refresh);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  function validateForm() {
    var containsError = false;
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const confirmEmail = !user.email.match(mailformat);
    var containsError = false;
    var firstNameError = "",
      lastNameError = "",
      phoneError = "",
      emailError = "",
      addressError = "",
      stateError = "",
      passwordError = "";
    console.log("Im in validation");

    if (user.firstName.length < 4) {
      firstNameError = "Taper 4 charactéres au minimum";
      containsError = true;
    }
    if (user.firstName.length > 3 && user.firstName.includes(" ")) {
      firstNameError = "Taper un nom valide";
      containsError = true;
    }
    if (user.lastName.length < 4) {
      lastNameError = "Taper 4 charactéres au minimum";
      containsError = true;
    }
    if (user.lastName.length > 3 && user.lastName.includes(" ")) {
      lastNameError = "Taper un prénom valide";
      containsError = true;
    }
    if (user.email === "") {
      emailError = "Taper un email valide";
      containsError = true;
    }
    if (user.phone.length < 8) {
      phoneError = "Taper 8 numéros";
      containsError = true;
    }
    if (user.phone.length > 8) {
      phoneError = "Taper 8 numéros";
      containsError = true;
    }
    if (confirmEmail) {
      emailError = "Taper un email valide";
      containsError = true;
    }
    if (user.address.length < 4) {
      addressError = "Taper 4 charactéres au minimum";
      containsError = true;
    }

    if (user.password.length > 3 && user.password.includes(" ")) {
      passwordError = "Taper un mot de passe valide";
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
    });

    console.log(" contains errors:", containsError);

    return !containsError;
  }
  return (
    <div className="PopUpModifyProduct">
      <ToastContainer />
      <div className="update_title">
        {controller == "User" ? (
          <h1>Modifier vos infos</h1>
        ) : (
          <h1>Modifier utilisateur</h1>
        )}
      </div>
      <form
        className="form_register"
        id="fr_register"
        encType="multipart/form-data"
      >
        <div className="first_container">
          {errors.firstName ? (
            <TextField
              error
              id="outlined-error-helper-text"
              name="firstName"
              label="Nom"
              helperText={errors.firstName}
              error
              InputProps={{ className: classes.input }}
              style={{ marginBottom: ".2em" }}
              variant="outlined"
              onChange={handleChange}
              value={user.firstName}
            />
          ) : (
            <TextField
              id="filled-textarea"
              name="firstName"
              label="Nom"
              InputProps={{ className: classes.input }}
              variant="outlined"
              onChange={handleChange}
              value={user.firstName}
            />
          )}
          {errors.lastName ? (
            <TextField
              error
              id="outlined-error-helper-text"
              name="lastName"
              label="Prénom"
              helperText={errors.lastName}
              error
              InputProps={{ className: classes.input }}
              style={{ marginLeft: "1em" }}
              variant="outlined"
              onChange={handleChange}
              value={user.lastName}
            />
          ) : (
            <TextField
              id="filled-textarea"
              name="lastName"
              label="Prénom"
              InputProps={{ className: classes.input }}
              style={{ marginLeft: "1em" }}
              variant="outlined"
              onChange={handleChange}
              value={user.lastName}
            />
          )}
        </div>
        <div className="second_container">
          {errors.phone ? (
            <TextField
              error
              id="outlined-error-helper-text"
              name="phone"
              label="Téléphone"
              helperText={errors.phone}
              error
              InputProps={{ className: classes.input }}
              variant="outlined"
              onChange={handleChange}
              value={user.phone}
            />
          ) : (
            <TextField
              id="filled-textarea"
              name="phone"
              label="Téléphone"
              InputProps={{ className: classes.input }}
              variant="outlined"
              onChange={handleChange}
              value={user.phone}
            />
          )}
          {errors.state ? (
            <FormControl
              error
              id="outlined-error-helper-text"
              variant="outlined"
              className={classes.input}
              style={{ marginLeft: "1em" }}
            >
              <InputLabel htmlFor="outlined-age-native-simple">
                Ville
              </InputLabel>
              <Select
                native
                name="state"
                value={user.state}
                label="Ville"
                onChange={handleChange}
              >
                {states
                  ? states.map((state) => {
                      return <option value={state}>{state}</option>;
                    })
                  : ""}
              </Select>
              <FormHelperText>{errors.state}</FormHelperText>
            </FormControl>
          ) : (
            <FormControl
              variant="outlined"
              className={classes.input}
              style={{ marginLeft: "1em" }}
            >
              <InputLabel htmlFor="outlined-age-native-simple">
                State
              </InputLabel>
              <Select
                native
                name="state"
                value={user.state}
                label="Ville"
                onChange={handleChange}
              >
                {states
                  ? states.map((state) => {
                      return <option value={state}>{state}</option>;
                    })
                  : ""}
              </Select>
            </FormControl>
          )}
        </div>
        <div className="second_container">
          {errors.address ? (
            <TextField
              error
              id="outlined-error-helper-text"
              name="address"
              label="Adresse"
              helperText={errors.address}
              error
              InputProps={{ className: classes.input }}
              variant="outlined"
              onChange={handleChange}
              value={user.address}
            />
          ) : (
            <TextField
              id="filled-textarea"
              name="address"
              label="Adresse"
              InputProps={{ className: classes.input }}
              variant="outlined"
              onChange={handleChange}
              value={user.address}
            />
          )}
          {errors.email ? (
            <TextField
              error
              id="outlined-error-helper-text"
              name="email"
              label="Email"
              helperText={errors.email}
              error
              InputProps={{ className: classes.input }}
              style={{ marginLeft: "1em" }}
              variant="outlined"
              onChange={handleChange}
              value={user.email}
            />
          ) : (
            <TextField
              id="filled-textarea"
              name="email"
              label="Email"
              InputProps={{ className: classes.input }}
              style={{ marginLeft: "1em" }}
              variant="outlined"
              onChange={handleChange}
              value={user.email}
            />
          )}
        </div>
        <div className="second_container">
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
              value={user.password}
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
              value={user.password}
              onChange={handleChange}
            />
          )}
        </div>
      </form>

      <div className="button_update">
        <button className="update_button" onClick={handleSubmit}>
          Modifier
        </button>
      </div>
    </div>
  );
};
export default PopUpUpdateUser;
