import React, { useEffect, useState } from "react";
import "./Products.css";
import ProductsImage from "../assets/produit.png";
import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import SearchBar from "material-ui-search-bar";
import VisibilityIcon from "@material-ui/icons/Visibility";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";
import Product from "../Products/Product";
import PopUpAddProduct from "./PopUpAddProduct";
import PopUpModifyProduct from "./PopUpModifyProduct";
import PopUpModifyCategorie from "./PopUpModifyCategorie";
import PopUpAddCategorie from "./PopUpAddCategorie";
import { AnimatePresence, motion } from "framer-motion";
import axios from "../axios";
import { ToastContainer, toast, Zoom, Bounce } from "react-toastify";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  input: {
    background: "white",
    width: "300px",
    marginTop: "10px",
  },
}));

const Products = () => {
  const classes = useStyles();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [ProductInfo, setProductInfo] = useState({
    _id: "",
    title: "",
    material: "",
    dimension: "",
    categorie: "Aucune",
    description: "",
    price: "",
    image: "",
  });
  const [countProducts, setCountProducts] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [refreshProducts, setRefreshProducts] = useState(false);
  const [Categorie, setCategorie] = useState({
    _id: "",
    title: "",
    image: "",
  });
  const method = ["Identifiant", "Libellé"];
  const [search, setSearch] = useState("");
  const [searchMethod, setSearchMethod] = useState("Libellé");

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

    await axios
      .get(`/get/count/products`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log(response.data);
        setCountProducts(response.data["countProducts"]);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error);
        }
      });
  }, [refresh]);
  useEffect(async () => {
    await axios
      .get(`/get/products`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log(response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error);
        }
      });
  }, [refresh, refreshProducts]);
  const deleteCategorie = async (title, id, image) => {
    console.log("id", id);
    var result = window.confirm(
      `Voulez vous vraiment supprimer la catégorie ${title}`
    );
    if (result) {
      await axios
        .delete(`/delete/categorie/${id}/${image}/${title}`, {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        })
        .then((response) => {
          console.log(response.data);
          setRefresh(!refresh);
        })
        .catch((error) => { 
          console.log("error delete",error); 
          if (error.response) {
            toast.error("" + error.response, {
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
          }
        });
    }
  };
  const deleteProduct = async (title, id, image) => {
    console.log("id", id);
    var result = window.confirm(
      `Voulez vous vraiment supprimer le produit ${title}`
    );
    if (result) {
      await axios
        .delete(`/delete/product/${id}/${image}`, {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        })
        .then((response) => {
          console.log(response.data);
          toast.success(`Produit ${title} supprimé avec succée `, {
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
          setRefresh(!refresh);
        })
        .catch((error) => {
          if (error.response) {
            toast.error("" + error.response, {
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
          }
        });
    }
  };

  const handleChange = async (event) => {
    event.preventDefault();
    const value = event.target.value;
    setSearchMethod(value);
  };

  const searchProduct = async () => {
    if (search) {
      await axios
        .get(`/get/products/search/${search}/${searchMethod}`, {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        })
        .then((response) => {
          console.log(response.data);
          setProducts(response.data);
        })
        .catch((error) => {
          if (error.response) {
            console.log(error);
          }
        });
    } else {
      await axios
        .get(`/get/products`, {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        })
        .then((response) => {
          console.log(response.data);
          setProducts(response.data);
        })
        .catch((error) => {
          if (error.response) {
            console.log(error);
          }
        });
    }
  };
  const doSomething1 = (popupName) => {
    document.body.style.overflow = "auto";
    if (popupName == "Product") {
      document.querySelector(".bg-modal-product").style.display = "none";
      document.querySelector(".bg-modal-product").style.position = "uset";
    }
    if (popupName == "Add") {
      document.querySelector(".bg-modal-add").style.display = "none";
      document.querySelector(".bg-modal-add").style.position = "uset";
    }
    if (popupName == "Modify") {
      document.querySelector(".bg-modal-modify").style.display = "none";
      document.querySelector(".bg-modal-modify").style.position = "uset";
    }
    if (popupName == "ModifyCategorie") {
      document.querySelector(".bg-modal-modify-categorie").style.display =
        "none";
      document.querySelector(".bg-modal-modify-categorie").style.position =
        "uset";
    }
    if (popupName == "AddCategorie") {
      document.querySelector(".bg-modal-add-categorie").style.display = "none";
      document.querySelector(".bg-modal-add-categorie").style.position = "uset";
    }
  };

  const doSomething = (popupName) => {
    document.documentElement.scrollTop = 0;
    document.body.style.overflow = "hidden";
    if (popupName == "Product") {
      document.querySelector(".bg-modal-product").style.display = "flex";
      document.querySelector(".bg-modal-product").style.position = "absolute";
    }
    if (popupName == "Add") {
      document.querySelector(".bg-modal-add").style.display = "flex";
      document.querySelector(".bg-modal-add").style.position = "absolute";
    }
    if (popupName == "Modify") {
      document.querySelector(".bg-modal-modify").style.display = "flex";
      document.querySelector(".bg-modal-modify").style.position = "absolute";
    }
    if (popupName == "ModifyCategorie") {
      document.querySelector(".bg-modal-modify-categorie").style.display =
        "flex";
      document.querySelector(".bg-modal-modify-categorie").style.position =
        "absolute";
    }
    if (popupName == "AddCategorie") {
      document.querySelector(".bg-modal-add-categorie").style.display = "flex";
      document.querySelector(".bg-modal-add-categorie").style.position =
        "absolute";
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="Products"
    >
      <ToastContainer />
      <div class="bg-modal-product">
        <div class="modal-contents-product">
          <div class="close" onClick={() => doSomething1("Product")}>
            x
          </div>
          <Product
            title={ProductInfo.title}
            material={ProductInfo.material}
            dimension={ProductInfo.dimension}
            categorie={ProductInfo.categorie}
            description={ProductInfo.description}
            price={ProductInfo.price}
            image={ProductInfo.image}
          />
        </div>
      </div>
      <div class="bg-modal-add">
        <div class="modal-contents-add">
          <div class="close" onClick={() => doSomething1("Add")}>
            x
          </div>
          <PopUpAddProduct
            refresh={refresh}
            onChange={(value) => setRefresh(value)}
          />
        </div>
      </div>
      <div class="bg-modal-modify">
        <div class="modal-contents-modify">
          <div class="close" onClick={() => doSomething1("Modify")}>
            x
          </div>
          <PopUpModifyProduct
            refresh={refresh}
            onChange={(value) => setRefresh(value)}
            productInfo={ProductInfo}
          />
        </div>
      </div>
      <div class="bg-modal-add-categorie">
        <div class="modal-contents-add-categorie">
          <div class="close" onClick={() => doSomething1("AddCategorie")}>
            x
          </div>
          <PopUpAddCategorie
            refresh={refresh}
            onChange={(value) => setRefresh(value)}
          />
        </div>
      </div>
      <div class="bg-modal-modify-categorie">
        <div class="modal-contents-modify-categorie">
          <div class="close" onClick={() => doSomething1("ModifyCategorie")}>
            x
          </div>
          <PopUpModifyCategorie
            _id={Categorie._id}
            title={Categorie.title}
            image={Categorie.image}
            refresh={refresh}
            onChange={(value) => setRefresh(value)}
          />
        </div>
      </div>

      <div className="Admin_title_container">
        <div className="Admin_title_image">
          <img src={ProductsImage} alt="" srcset="" />
        </div>
        <div className="Admin_title_content">
          <div className="Admin_title_content_title">
            Interface Administrateur (Produits)
          </div>
          <div className="Admin_title_content_subtitle">
            Cette page contient les statistiques globale des Produits dans
            l'application
          </div>
        </div>
      </div>
      <div className="Admin_container">
        <div className="Admin_statistic_cards fix_margin_bottom">
          <div className="statistic_card">
            <div className="statistic_title_container">
              <div className="statistic_title_container_title">
                Total Produits
              </div>
              <div className="statistic_title_container_subtitle">
                Le total des produits enregistrés
              </div>
            </div>
            <div className="statistic_value">{countProducts}</div>
          </div>
        </div>
        <div className="Admin_products_categories_container">
          <div className="Admin_products_title_container">
            <div className="Admin_products_title">Les Categories :</div>
            <div className="Admin_products_button">
              <button
                class="Categorie_add_button"
                onClick={() => {
                  doSomething("AddCategorie");
                }}
              >
                + Ajouter Catégorie
              </button>
            </div>
          </div>
          <div className="Admin_products_categories_row">
            {categories
              ? categories.map((categorie) => {
                  return (
                    <div className="statistic_card_categories">
                      <div className="statistic_title_container">
                        <div className="statistic_title_container_title">
                          {categorie.title}
                        </div>
                        <div className="statistic_title_container_subtitle">
                          Le total des {categorie.title} enregistrés
                        </div>
                      </div>
                      <div className="statistic_value">
                        {categorie.nb_products}
                      </div>
                      <div className="actions_card">
                        <div className="modify_categorie">
                          <IconButton aria-label="add-person">
                            <CreateIcon
                              style={{ color: "green" }}
                              onClick={() => {
                                setCategorie({
                                  _id: categorie._id,
                                  title: categorie.title,
                                  image: categorie.image,
                                });
                                doSomething("ModifyCategorie");
                              }}
                            />
                          </IconButton>
                        </div>
                        <div className="delete_categorie">
                          <IconButton aria-label="add-person">
                            <DeleteIcon
                              style={{ color: "red" }}
                              onClick={() =>
                                deleteCategorie(
                                  categorie.title,
                                  categorie._id,
                                  categorie.image
                                )
                              }
                            />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  );
                })
              : ""}
          </div>
        </div>

        <div className="Admin_container_tables fix_margin">
          <div className="Admin_container_table">
            <div className="Admin_table_clients">
              <div className="Admin_table_title table_title_fix">
                <div className="Admin_products_title_container">
                  <div className="Admin_products_title">
                    Liste des Produits :
                  </div>
                  <div className="Admin_products_button">
                    <button
                      class="Categorie_add_button"
                      onClick={() => {
                        doSomething("Add");
                      }}
                    >
                      + Ajouter Produit
                    </button>
                  </div>
                </div>
                <div className="search_container">
                  <div className="search_bar ">
                    <SearchBar
                      value={search}
                      onChange={(newValue) => setSearch(newValue)}
                      onRequestSearch={searchProduct}
                      onCancelSearch={() => {
                        setRefreshProducts(!refreshProducts);
                        setSearch("");
                      }}
                    />
                  </div>
                  <div className="search_date">
                    <div className="text">Avec</div>
                    <div className="date_bar">
                      <FormControl
                        variant="outlined"
                        className={classes.input}
                        style={{ marginLeft: ".5em" }}
                      >
                        <InputLabel htmlFor="outlined-age-native-simple">
                          Méthode
                        </InputLabel>
                        <Select
                          native
                          label="Méthode"
                          onChange={handleChange}
                          value={searchMethod}
                        >
                          {method.map((mt) => {
                            return <option value={mt}>{mt}</option>;
                          })}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="table_best_clients_table">
                <div className="table_nav">
                  <div className="table_nav_item medium_width ">
                    Identifiant
                  </div>
                  <div className="table_nav_item big_width">Libellé</div>
                  <div className="table_nav_item small_width">Catégorie</div>
                  <div className="table_nav_item small_width">Prix</div>
                  <div className="table_nav_item small_width">
                    Total Commandes
                  </div>
                  <div className="table_nav_item medium_width">Actions</div>
                </div>
                <div className="table_products_content"> 
                {products.length !== 0 ? (
                  products.map((product) => {
                    return (
                      <div className="table_best_clients_table_content height_table special_table_css">
                        <div className="table_content_item medium_width Orders_id">
                          {product._id}
                        </div>
                        <div className="table_content_item big_width">
                          {product.title}
                        </div>
                        <div className="table_content_item small_width ">
                          {product.categorie}
                        </div>
                        <div className="table_content_item small_width Orders_total">
                          {product.price} DT
                        </div>

                        <div className="table_content_item small_width stat_special">
                          {product.nb_Orders}
                        </div>
                        <div className="table_nav_item medium_width special_css">
                          <div className="action_modify">
                            <IconButton aria-label="add-person">
                              <CreateIcon
                                style={{ color: "green" }}
                                onClick={() => {
                                  setProductInfo({
                                    _id: product._id,
                                    title: product.title,
                                    material: product.material,
                                    dimension: product.dimension,
                                    categorie: product.categorie,
                                    description: product.description,
                                    price: product.price,
                                    image: product.image,
                                  });
                                  doSomething("Modify");
                                }}
                              />
                            </IconButton>
                          </div>
                          <div className="action_delete">
                            <IconButton aria-label="add-person">
                              <DeleteIcon
                                onClick={() => {
                                  deleteProduct(
                                    product.title,
                                    product._id,
                                    product.image
                                  );
                                }}
                                style={{ color: "red" }}
                              />
                            </IconButton>
                          </div>
                          <div className="action_orders">
                            <IconButton aria-label="add-person">
                              <VisibilityIcon
                                onClick={() => {
                                  setProductInfo({
                                    _id: product._id,
                                    title: product.title,
                                    material: product.material,
                                    dimension: product.dimension,
                                    categorie: product.categorie,
                                    description: product.description,
                                    price: product.price,
                                    image: product.image,
                                  });
                                  doSomething("Product");
                                }}
                              />
                            </IconButton>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="no_data_found">
                    <div className="no_data_found_image">
                      <SearchIcon />
                    </div>
                    <div className="no_data_found_text">
                      Aucun Produit trouvé
                    </div>
                  </div>
                )}
                
                
                </div>

                
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default Products;
