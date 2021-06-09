import React, { useEffect, useState } from "react";
import "./PopUpModifyCategorie.css";
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
}));

const PopUpModifyCategorie = ({ _id, title, image, refresh, onChange }) => {
  console.log("title", title);
  const classes = useStyles();
  const [categorie, setCategorie] = useState({
    title: "",
    image: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  useEffect(async () => {
    setCategorie({
      title,
      image: "",
    });
  }, [_id]);
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

      formData.append("title", categorie.title);
      console.log("form title :", formData.get("title"));
      formData.append("image", categorie.image);
      if (categorie.image !== "") {
        formData.append("lastImage", image);
      }
      await axios
        .patch(`/update/categorie/${_id}`, formData, {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        })
        .then((response) => {
          if (response) {
            toast.success(`Catégorie ${title} a été modifié avec succée`, {
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
    var titleError = "";  
    var imageError = "";
    if(categorie.image==undefined) categorie.image="";

    if (categorie.image === "" && categorie.title === "") {
      imageError = "Changer quelque chose ";
      titleError = "Changer quelque chose ";
      containsError = true;
    }

    if (categorie.title !== "" && categorie.title.length < 4) {
      titleError = "Taper un nom valide";
      containsError = true;
    } 

    if(!categorie.image==""){ 
      if(!isImage(categorie.image)){ 
        imageError = "Choisir une image";
        containsError = true;
      }
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
    <div className="PopUpModifyCategorie">
      <ToastContainer />
      <div className="update_title">
        <h1>Modifier Catégorie</h1>
      </div>
      <form className="form_register">
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
              id="outlined-error-helper-text"
              name="image"
              type="file"
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
              variant="outlined"
              InputProps={{ className: classes.input }}
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
export default PopUpModifyCategorie;
