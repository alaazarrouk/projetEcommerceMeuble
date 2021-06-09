import React, { useEffect, useState } from "react";
import "./Message.css";
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

    width: "500px",
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

const Message = ({ refresh, onChange, message }) => {
  const classes = useStyles();
  const [{}, dispatch] = useStateValue();
  const [messageUser, setMessageUser] = useState({
    _id: "",
    message: "",
    date: "",
    email: "",
    status: "",
  });
  const [messageAdmin, setMessageAdmin] = useState({
    message: "",
  });
  const [errors, setErrors] = useState({
    message: "",
  });

  useEffect(() => {
    setMessageUser({
      _id: message ? message._id : "",
      message: message ? message.message : "",
      date: message ? message.date : "",
      email: message ? message.email : "",
      status: message ? message.status : "",
    });
  }, [message._id]);

  const handleChange = (event) => {
    event.preventDefault();
    const name = event.target.name;
    var value = event.target.value;
    setErrors({ ...errors, [name]: "" });
    setMessageAdmin({ ...messageAdmin, [name]: value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const val = validateForm();
    console.log("form status", val);
    if (val) {
      await axios
        .post(
          `/send/mail/${messageUser.email}/${messageUser._id}`,
          messageAdmin,
          {
            headers: {
              "x-access-token": localStorage.getItem("token"),
            },
          }
        )
        .then((response) => {
          console.log(response);
          if (response.data.updatedMessage.nModified > 0) {
            toast.success(`Message envoyé avec succée`, {
              className: "Toastify__toast",
              position: "top-right",
              autoClose: 2000,
              style: { marginTop: "130px" },
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
            });
            onChange(!refresh);
            setMessageAdmin({ message: "" });
          }
        })

        .catch((err) => {
          console.log(err);
        });
    }
  };
  function validateForm() {
    var containsError = false;
    var messageError = "";
    if (messageAdmin.message.length < 4) {
      messageError = "Taper 4 charactéres au minimum";
      containsError = true;
    }
    setErrors({
      message: messageError,
    });
    return !containsError;
  }
  return (
    <div className="PopUpModifyProduct">
      <ToastContainer />
      <div className="update_title">
        <h1>Message</h1>
      </div>
      <form className="form_register">
        <div className="first_container special_container_css">
          <TextField
            name="messageUser"
            id="outlined-multiline-static"
            label="Message du client"
            InputProps={{ className: classes.input }}
            variant="filled"
            multiline
            rows={4}
            value={messageUser.message}
          />
        </div>
        <div className="second_container">
          {errors.message ? (
            <TextField
              error
              id="outlined-multiline-static-error-helper-text"
              name="message"
              helperText={errors.message}
              error
              label="Votre message"
              InputProps={{ className: classes.input }}
              multiline
              rows={4}
              variant="filled"
              value={messageAdmin.message}
              onChange={handleChange}
            />
          ) : (
            <TextField
              name="message"
              id="outlined-multiline-static"
              label="Votre message"
              InputProps={{ className: classes.input }}
              variant="filled"
              multiline
              rows={4}
              value={messageAdmin.message}
              onChange={handleChange}
            />
          )}
        </div>
      </form>

      <div className="button_update">
        <button className="update_button" onClick={handleSubmit}>
          Envoyer
        </button>
      </div>
    </div>
  );
};
export default Message;
