import React, { useEffect, useState } from "react";
import "./PopUpModifyProduct.css";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import { ToastContainer, toast, Zoom, Bounce } from "react-toastify";
import axios from "../axios";
import { FormHelperText } from "@material-ui/core";

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

const PopUpModifyProduct = ({ refresh, onChange, productInfo }) => {
  const classes = useStyles();
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    title: "",
    material: "",
    dimension: "",
    categorie: "",
    description: "",
    price: "",
    image: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    material: "",
    dimension: "",
    categorie: "",
    description: "",
    price: "",
    image: "",
  });
  useEffect(() => {
    setProduct({
      _id: productInfo ? productInfo._id : "",
      title: productInfo ? productInfo.title : "",
      material: productInfo ? productInfo.material : "",
      dimension: productInfo ? productInfo.dimension : "",
      categorie: productInfo ? productInfo.categorie : "",
      description: productInfo ? productInfo.description : "",
      price: productInfo ? productInfo.price : "",
      image: "",
    });
  }, [productInfo._id]);
  useEffect(async () => {
    await axios
      .get(`/get/categories`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log(response.data);
        setCategories(response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error);
        }
      });
  }, [refresh]);

  const handleChange = (event) => {
    event.preventDefault();
    const name = event.target.name;
    if (name == "image") {
      var value = event.target.files[0];
    } else {
      var value = event.target.value;
    }

    setErrors({ ...errors, [name]: "" });
    setProduct({ ...product, [name]: value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const val = validateForm();
    if (val) { 
      const formData = new FormData();
      formData.append("title", product.title);
      formData.append("material", product.material);
      formData.append("dimension", product.dimension);
      formData.append("categorie", product.categorie);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("image", product.image);
      if (product.image !== "") {
        formData.append("lastImage", productInfo.image);
      }

      await axios
        .patch(`/update/product/${productInfo._id}`, formData, {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        })
        .then((response) => {
          console.log(response);
          if (response.data.nModified == 0) {
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
            toast.success(
              `product ${productInfo.title} a été modifié avec succée`,
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
          productInfo = product;
          onChange(!refresh);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  function validateForm() {
    var containsError = false;
    var titleError = "",
      materialError = "",
      dimensionError = "",
      categorieError = "",
      descriptionError = "",
      priceError = "",
      imageError;

    if (product.title.length < 4) {
      titleError = "Taper 4 charactéres au minimum";
      containsError = true;
    }

    if (product.material.length < 2) {
      materialError = "Taper 2 charactéres au minimum";
      containsError = true;
    }
    if (product.dimension.length < 3) {
      dimensionError = "Taper 3 charactéres au minimum";
      containsError = true;
    }

    if (product.description.length < 10) {
      descriptionError = "Taper 10 charactéres au minimum";
      containsError = true;
    }

    if (product.price.length < 1) {
      priceError = "Taper 1 numéro au minimum";
      containsError = true;
    } 
    if(product.image==undefined) product.image="";
    if(!product.image=="")
    {
      if(!isImage(product.image)){  
        imageError = "Choisir une image";
        containsError = true;
      }
    }
    
    
    setErrors({
      title: titleError,
      material: materialError,
      dimension: dimensionError,
      categorie: categorieError,
      description: descriptionError,
      price: priceError,
      image: imageError,
    });


    return !containsError;
  }
  function getExtension(file) { 
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
    <div className="PopUpModifyProduct">
      <ToastContainer />
      <div className="update_title">
        <h1>Modifier Produit</h1>
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
              label="Libellée"
              helperText={errors.title}
              error
              InputProps={{ className: classes.input }}
              style={{ marginBottom: ".2em" }}
              variant="outlined"
              onChange={handleChange}
              value={product.title}
            />
          ) : (
            <TextField
              id="filled-textarea"
              name="title"
              label="Libellée"
              InputProps={{ className: classes.input }}
              variant="outlined"
              onChange={handleChange}
              value={product.title}
            />
          )}
          {errors.material ? (
            <TextField
              error
              id="outlined-error-helper-text"
              name="material"
              label="Matiéres"
              helperText={errors.material}
              error
              InputProps={{ className: classes.input }}
              style={{ marginLeft: "1em" }}
              variant="outlined"
              onChange={handleChange}
              value={product.material}
            />
          ) : (
            <TextField
              id="filled-textarea"
              name="material"
              label="Matiére"
              InputProps={{ className: classes.input }}
              style={{ marginLeft: "1em" }}
              variant="outlined"
              onChange={handleChange}
              value={product.material}
            />
          )}
        </div>
        <div className="second_container">
          {errors.dimension ? (
            <TextField
              error
              id="outlined-error-helper-text"
              name="dimension"
              label="Dimension"
              helperText={errors.dimension}
              error
              InputProps={{ className: classes.input }}
              variant="outlined"
              onChange={handleChange}
              value={product.dimension}
            />
          ) : (
            <TextField
              id="filled-textarea"
              name="dimension"
              label="Dimension"
              InputProps={{ className: classes.input }}
              variant="outlined"
              onChange={handleChange}
              value={product.dimension}
            />
          )}
          {errors.categorie ? (
            <FormControl
              error
              id="outlined-error-helper-text"
              variant="outlined"
              className={classes.input}
              style={{ marginLeft: "1em" }}
            >
              <InputLabel htmlFor="outlined-age-native-simple">
                Catégorie
              </InputLabel>
              <Select
                native
                name="categorie"
                value={product.categorie}
                label="Catégorie"
                onChange={handleChange}
              >
                <option value="Aucune"> Aucune</option>;
                {categories
                  ? categories.map((cat) => {
                      return <option value={cat.title}>{cat.title}</option>;
                    })
                  : ""}
              </Select>
              <FormHelperText>{errors.categorie}</FormHelperText>
            </FormControl>
          ) : (
            <FormControl
              variant="outlined"
              className={classes.input}
              style={{ marginLeft: "1em" }}
            >
              <InputLabel htmlFor="outlined-age-native-simple">
                Catégorie
              </InputLabel>
              <Select
                name="categorie"
                native
                value={product.categorie}
                label="Catégorie"
                onChange={handleChange}
              >
                {categories
                  ? categories.map((cat) => {
                      return <option value={cat.title}>{cat.title}</option>;
                    })
                  : ""}
              </Select>
            </FormControl>
          )}
        </div>
        <div className="second_container">
          {errors.description ? (
            <TextField
              error
              id="outlined-error-helper-text"
              name="description"
              label="Description"
              helperText={errors.description}
              error
              InputProps={{ className: classes.input }}
              variant="outlined"
              onChange={handleChange}
              value={product.description}
            />
          ) : (
            <TextField
              id="filled-textarea"
              name="description"
              label="Description"
              InputProps={{ className: classes.input }}
              variant="outlined"
              onChange={handleChange}
              value={product.description}
            />
          )}
          {errors.price ? (
            <TextField
              error
              id="outlined-error-helper-text"
              name="price"
              label="Prix"
              helperText={errors.price}
              error
              InputProps={{ className: classes.input }}
              style={{ marginLeft: "1em" }}
              variant="outlined"
              onChange={handleChange}
              value={product.price}
            />
          ) : (
            <TextField
              id="filled-textarea"
              name="price"
              label="Prix"
              InputProps={{ className: classes.input }}
              style={{ marginLeft: "1em" }}
              variant="outlined"
              onChange={handleChange}
              value={product.price}
            />
          )}
        </div>
        <div className="second_container">
          {errors.image ? (
            <TextField
              error
              id="outlined-error-helper-text"
              name="image"
              type="file"
              helperText={errors.image}
              error
              InputProps={{ className: classes.inputDescription }}
              variant="outlined"
              onChange={handleChange}
            />
          ) : (
            <TextField
              name="image"
              type="file"
              variant="outlined"
              InputProps={{ className: classes.inputDescription }}
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
export default PopUpModifyProduct;
