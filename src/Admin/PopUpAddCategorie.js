import React, { useEffect, useState } from "react";
import "./PopUpAddCategorie.css";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { ToastContainer, toast, Zoom, Bounce } from "react-toastify";

import axios from "../axios";
const useStyles = makeStyles((theme) => ({
  input: {
    background: "white",
    marginBottom: "1em",

    width: "300px",
    height: "auto",
    color: "#0b1c39",
    "&.Mui-focused": {
      color: "#0b1c39",
    },
  },
  inputFile: {
    background: "white",
    marginBottom: "1em",
    width: "300px",
    color: "#white",
  },
}));

const PopUpAddCategorie = ({ refresh, onChange }) => {
  const classes = useStyles();
  const [categorie, setCategorie] = useState({
    title: "",
    image: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const handleChange = (event) => {
    event.preventDefault();
    const name = event.target.name;
    if (name == "image") {
      var value = event.target.files[0];
    } else {
      var value = event.target.value;
    }
    setErrors({ ...errors, [name]: "" });

    setCategorie({ ...categorie, [name]: value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const val = validateForm();
    console.log("form status", val);
    if (val) {
      const formData = new FormData();
      formData.append("image", categorie.image);
      formData.append("title", categorie.title);
      await axios
        .post(`/create/categorie`, formData, {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        })
        .then((response) => {
          if (response) {
            toast.success(
              `Catégorie ${categorie.title} a été ajouter avec succée`,
              {
                className: "Toastify__toast",
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              }
            );
          }

          setCategorie({
            title: "",
            image: "",
          });
          onChange(!refresh);
          document.getElementById("fr_register").reset();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  function validateForm() {
    var containsError = false;
    var titleError = "",
      imageError = "";

    if (categorie.title === "") {
      titleError = "Taper un nom";
      containsError = true;
    }

    if (categorie.title.length < 4) {
      titleError = "Taper un nom valide";
      containsError = true;
    }
    if(categorie.image==undefined) categorie.image="";

    if (categorie.image === "") {
      imageError = "Choisir une image";
      containsError = true;
    } 
    if(!isImage(categorie.image)){ 
      imageError = "Choisir une image";
      containsError = true;
    }
    setErrors({
      title: titleError,
      image: imageError,
    });


    return !containsError;
  } 
  function getExtension(file) { 
    console.log("filename",file); 
    var parts = file.name.split('.');
    return parts[parts.length - 1];
  }
  
  function isImage(filename) {
    var ext = getExtension(filename).toLowerCase(); 
    var array_format=['jpg','gif','bmp','png']; 
    if(array_format.includes(ext)) return true
    else return false; 
  }

  return (
    <div className="PopUpAddCategorie">
      <ToastContainer />
      <div className="update_title">
        <h1>Ajouter Catégorie</h1>
      </div>
      <form
        className="form_register"
        id="fr_register"
        encType="multipart/form-data"
      >
        <div className="first_container">
          {errors.title ? (
            <TextField
              error
              id="outlined-error-helper-text"
              name="title"
              helperText={errors.title}
              label="Nom"
              InputProps={{ className: classes.input }}
              variant="outlined"
              value={categorie.title}
              onChange={handleChange}
            />
          ) : (
            <TextField
              name="title"
              id="filled-textarea"
              label="Nom"
              InputProps={{ className: classes.input }}
              variant="outlined"
              onChange={handleChange}
              value={categorie.title}
            />
          )}
        </div>

        <div className="forth_container">
          {errors.image ? (
            <TextField
              error
              id="outlined-error-helper-text img-input"
              name="image"
              type="file"
              accept="image/*"
              helperText={errors.image}
              error
              InputProps={{ className: classes.input }}
              variant="outlined"
              onChange={handleChange}
            />
          ) : (
            <TextField
              name="image"
              type="file"
              accept="image/*"
              variant="outlined"
              InputProps={{ className: classes.input }}
              onChange={handleChange}
            />
          )}
        </div>
      </form>
      <div className="button_update">
        <button className="update_button" onClick={handleSubmit}>
          Ajouter
        </button>
      </div>
    </div>
  );
};

export default PopUpAddCategorie;
