import React, { useEffect, useState } from "react";
import "./MainProducts.css";
import Meuble from "../assets/meuble.png";
import { makeStyles } from "@material-ui/core/styles";
import ChaiseMeuble from "../assets/chaise-meuble.jpg";
import VisibilityIcon from "@material-ui/icons/Visibility";
import IconButton from "@material-ui/core/IconButton";
import SearchBar from "material-ui-search-bar";
import Product from "./Product";
import { AnimatePresence, motion } from "framer-motion";
import axios from "../axios";
import { useParams, useLocation } from "react-router-dom";
import { useStateValue } from "../StateProvider";
import { ToastContainer, toast, Zoom, Bounce } from "react-toastify";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  input: {
    cursor: "pointer",
  },
}));
const MainProducts = (props) => {
  const classes = useStyles();
  const [{ basket }, dispatch] = useStateValue();
  const location = useLocation();
  const [cat, setCat] = useState(location.state.categorie);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [refresh, setRefresh] = useState(false);
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
  useEffect(async () => {
    await axios
      .get(`/get/categories`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log("Accueil", response.data);
        setCategories(response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error);
        }
      });
  }, []);

  useEffect(async () => {
    await axios
      .get(`/get/products/${cat}`, {
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
  }, [cat]);

  const searchProduct = async () => {
    if (search) {
      await axios
        .get(`/get/products/search/${search}/Libellé`, {
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

  const addToBasket = (product) => {
    dispatch({
      type: "ADD_TO_BASKET",
      item: {
        product: product,
        quantity: 1,
      },
    });
    console.log("basket", basket);
    toast.info(`Le produit ${product.title} a été ajouté au panier`, {
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
  };
  const doSomething1 = () => {
    document.body.style.overflow = "auto";
    document.querySelector(".bg-modal-product").style.display = "none";
    document.querySelector(".bg-modal-product").style.position = "uset";
  };

  const doSomething = () => {
    document.documentElement.scrollTop = 0;
    document.body.style.overflow = "hidden";
    document.querySelector(".bg-modal-product").style.display = "flex";
    document.querySelector(".bg-modal-product").style.position = "absolute";
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="MainProducts"
    >
      <ToastContainer />

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      ></link>
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
      <div className="MainProducts_banner">
        <div className="MainProducts_title">
          <h1>Catalogue </h1>
        </div>
        <img src={Meuble} alt="" />
      </div>
      <div className="MainProducts_container">
        <div className="MainProducts_right_items">
          <div className="MainProducts__right_items_searchBar">
            <SearchBar
              value={search}
              onChange={(newValue) => setSearch(newValue)}
              onRequestSearch={searchProduct}
            />
          </div>
          <div className="MainProducts__right_items_title">Categories </div>
          <div className="MainProducts_right_items_content">
            <div className="categorie">
              {cat == "All" ? (
                <span
                  className="active_choice"
                  onClick={() => {
                    setCat("All");
                  }}
                >
                  Tous
                </span>
              ) : (
                <span
                  onClick={() => {
                    setCat("All");
                  }}
                >
                  Tous
                </span>
              )}
            </div>
            {categories
              ? categories.map((categorie) => {
                  return (
                    <div className="categorie">
                      {cat == categorie.title ? (
                        <span
                          className="active_choice"
                          onClick={() => {
                            setCat(categorie.title);
                          }}
                        >
                          {categorie.title}
                        </span>
                      ) : (
                        <span
                          onClick={() => {
                            setCat(categorie.title);
                          }}
                        >
                          {categorie.title}
                        </span>
                      )}
                    </div>
                  );
                })
              : ""}
          </div>
        </div>
        <div className="MainProducts_left_items">
          <div className="MainProducts_row">
            {products.length !== 0 ? (
              products.map((product) => {
                return (
                  <div className="MainProducts_product">
                    <div className="MainProducts_product_image">
                      <IconButton>
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
                            doSomething();
                          }}
                        />
                      </IconButton>

                      <img
                        src={
                          "https://projetecommercebackend.herokuapp.com/images/" +
                          product.image
                        }
                      />
                    </div>
                    <div className="MainProducts_product_button">
                      <button
                        className="AddToCart_button"
                        onClick={() => addToBasket(product)}
                      >
                        <i class="fa fa-cart-plus"></i>Ajouter
                      </button>
                    </div>
                    <div className="MainProducts_product_infos">
                      <div className="MainProducts_product_title">
                        {product.title}
                      </div>
                      <div className="MainProducts_product_price">
                        {product.price}DT
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no_data_found_products">
                <div className="no_data_found_products_image">
                  <SearchIcon />
                </div>
                <div className="no_data_found_products_text">
                  Aucun produit trouvé
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MainProducts;
