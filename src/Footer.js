import React, { useEffect, useState } from "react";
import "./Footer.css";
import location from "./assets/pin.png";
import phone from "./assets/phone-call.png";
import email from "./assets/email.png";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import axios from "./axios";
import { useStateValue } from "./StateProvider";

const useStyles = makeStyles((theme) => ({
  input: {
    background: "white",
    width: "300px",
    color: "#ad3202",
    "&.Mui-focused": {
      color: "white",
    },
  },
}));

const Footer = () => {
  const classes = useStyles();
  const [{ user }, dispatch] = useStateValue();
  const [message, setMessage] = useState({
    message: "",
    email: "",
    date: "",
    status: "En attente",
  });
  const [errors, setErrors] = useState({
    message: "",
    email: "",
  });

  const handleChange = (event) => {
    event.preventDefault();
    const name = event.target.name;
    const value = event.target.value;
    setMessage({ ...message, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (user) {
      setMessage({ ...message, email: user ? user.email : "" });
    }
    const val = validateForm();
    if (val) {
      console.log("date get", getFullDate());
      message.date = getFullDate();
      console.log("message", message);
      await axios
        .post(`/create/message`, message)
        .then((response) => {
          if (response.data.result) {
          }

          setMessage({
            message: "",
            email: "",
            date: "",
            status: "En attente",
          });
        })
        .catch((error) => {
          if (error.response) {
          }
        });
    } else {
    }
  };
  function validateForm() {
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const confirmEmail = !message.email.match(mailformat);
    var containsError = false;
    var messageError = "",
      emailError = "";

    if (message.message.length < 4) {
      messageError = "Taper 4 charactéres au minimum";
      containsError = true;
    }
    if (confirmEmail) {
      emailError = "Taper un email valide";
      containsError = true;
    }

    if (message.email === "") {
      emailError = "Taper un email valide";
      containsError = true;
    }

    setErrors({
      message: messageError,
      email: emailError,
    });

    return !containsError;
  }

  function getFullDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + "/" + dd + "/" + yyyy;
    return today;
  }

  return (
    <footer className="Footer" id="contact">
      <div className="footer_content">
        <div className="infos">
          <div className="location">
            <div className="location_icon">
              <img src={location} />
            </div>
            <div className="location_text">Ben arous , Megrine</div>
          </div>
          <div className="phone">
            <div className="phone_icon">
              <img src={phone} />
            </div>
            <div className="phone_text">
              <span>(+216) 56 353 467</span>
            </div>
          </div>
          <div className="email">
            <div className="email_icon">
              <img src={email} />
            </div>
            <div className="email_text">alaazarrouk99@gmail.com</div>
          </div>
          <div className="social">
            <div className="facebook_icon"></div>
            <div className="instagrem_icon"></div>
            <div className="linkedin_icon"></div>
          </div>
        </div>
        <div className="contact">
          <div className="contact_title">Contactez-nous</div>
          <div className="contact_form">
            <form className="contact_form">
              {!user ? (
                <div className="contact_form_container">
                  {errors.email ? (
                    <TextField
                      error
                      id="outlined-error-helper-text"
                      name="email"
                      helperText={errors.email}
                      error
                      label="Adresse Email"
                      InputProps={{ className: classes.input }}
                      variant="filled"
                      value={message.email}
                      onChange={handleChange}
                    />
                  ) : (
                    <TextField
                      name="email"
                      id="outlined"
                      label="Adresse Email"
                      InputProps={{ className: classes.input }}
                      variant="filled"
                      value={message.email}
                      onChange={handleChange}
                    />
                  )}
                </div>
              ) : (
                ""
              )}

              <div className="contact_form_container">
                {errors.message ? (
                  <TextField
                    error
                    id="outlined-multiline-static-error-helper-text"
                    name="message"
                    helperText={errors.message}
                    error
                    label="Message"
                    InputProps={{ className: classes.input }}
                    multiline
                    rows={4}
                    variant="filled"
                    value={message.message}
                    onChange={handleChange}
                  />
                ) : (
                  <TextField
                    name="message"
                    id="outlined-multiline-static"
                    label="Message"
                    InputProps={{ className: classes.input }}
                    variant="filled"
                    multiline
                    rows={4}
                    value={message.message}
                    onChange={handleChange}
                  />
                )}
              </div>
            </form>
            <button className="envoyer_button" onClick={handleSubmit}>
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
