import React, { useEffect, useState } from "react";
import "./Accueil.css";
import meuble from "../assets/tablechair.jpg";
import { HashLink as Link } from "react-router-hash-link";
import { AnimatePresence, motion } from "framer-motion";
import axios from "../axios";
import { useStateValue } from "../StateProvider";
import { ToastContainer, toast, Zoom, Bounce } from "react-toastify";

const Accueil = () => {
  const [{ basket }, dispatch] = useStateValue();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  var i = 0;

  useEffect(async () => {
    await axios
      .get(`/get/categories`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error);
        }
      });

    await axios
      .get(`/get/popular/products`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log("products", response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error);
        }
      });
  }, []);

  const addToBasket = (product) => {
    dispatch({
      type: "ADD_TO_BASKET",
      item: {
        product: product,
        quantity: 1,
      },
    });
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
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="Accueil"
    >
      <ToastContainer />
      {/*----------Banner ----------*/}
      <div className="banner" id="banner">
        <div className="banner_text">
          <div className="banner_title">
            <h1>Choisir votre meuble</h1>
          </div>
          <div className="sub_title">
            " Venez découvrir notre catalogue de meubles caractérisé par un
            style simple et moderne avec trés beau design , "
          </div>

          <Link
            to={{
              pathname: "/products",
              state: {
                categorie: "All",
              },
            }}
          >
            <button class="shop_button">SHOP NOW</button>
          </Link>
        </div>
        <div className="banner_image">
          <img src={meuble} alt="" />
        </div>
      </div>
      {/*----------Catégories ----------*/}
      <div className="categories" id="categories">
        <div className="categories_title">
          <h2>Categories</h2>
        </div>
        <div className="categories_content">
          {categories
            ? categories.map((categorie) => {
                return (
                  <div className="categorie">
                    <div className="categorie_image">
                      <img
                        src={
                          "https://projetecommercebackend.herokuapp.com/images/" +
                          categorie.image
                        }
                        alt=""
                      />
                    </div>
                    <div className="categorie_title">
                      <h3>{categorie.title}</h3>
                    </div>
                    <div className="button_checkNow">
                      <Link
                        to={{
                          pathname: "/products",
                          state: {
                            categorie: categorie.title,
                          },
                        }}
                      >
                        <button class="check_button">Check Now</button>
                      </Link>
                    </div>
                  </div>
                );
              })
            : ""}
        </div>
      </div>
      {/*----------popular products ----------*/}
      <div className="popular_products" id="popular">
        <div className="popular_title">
          <h2>Produit Populaire</h2>
        </div>
        <div className="popular_subTitle">
          " Simples, pratiques et non encombrants voici les deux articles les
          plus demandés de notre catalgoue, "
        </div>
        <div className="popular_content">
          {products
            ? products.map((product) => {
                i++;
                if (i == 1) {
                  return (
                    <div className="product">
                      <div className="product_info">
                        <div className="product_title">{product.title}</div>
                        <div className="product_description">
                          "{product.description} "
                        </div>
                        <div className="product_price">
                          Prix : <span>{product.price} DT</span>
                        </div>
                        <div className="button_addToCart">
                          <button
                            class="addToCart_button"
                            onClick={() => addToBasket(product)}
                          >
                            Ajouter au panier
                          </button>
                        </div>
                      </div>
                      <div className="product_image">
                        <img
                          src={
                            "https://projetecommercebackend.herokuapp.com/images/" +
                            product.image
                          }
                          alt=""
                        />
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className="product">
                      <div className="product_image1">
                        <img
                          src={
                            "https://projetecommercebackend.herokuapp.com/images/" +
                            product.image
                          }
                          alt=""
                        />
                      </div>
                      <div className="product_info1">
                        <div className="product_title">{product.title}</div>
                        <div className="product_description1">
                          "{product.description} ,"
                        </div>
                        <div className="product_price">
                          Prix : <span>{product.price} DT</span>
                        </div>
                        <div className="button_addToCart">
                          <button
                            class="addToCart_button"
                            onClick={() => addToBasket(product)}
                          >
                            Ajouter au panier
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
              })
            : ""}
        </div>
      </div>
    </motion.div>
  );
};

export default Accueil;
