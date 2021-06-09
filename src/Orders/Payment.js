import React, { useEffect, useState } from "react";
import "./Payment.css";
import Meuble from "../assets/meuble.png";
import { Link, useHistory } from "react-router-dom";

import { useStripe, CardElement, useElements } from "@stripe/react-stripe-js";
import { AnimatePresence, motion } from "framer-motion";
import axios from "../axios";
import { useParams, useLocation } from "react-router-dom";
import { useStateValue } from "../StateProvider";
import { ToastContainer, toast, Zoom, Bounce } from "react-toastify";
const Payment = () => {
  const location = useLocation();
  const history = useHistory();
  const [{ basket, user }, dispatch] = useStateValue();
  const [method, setMethod] = useState("Aucun");
  const [clientSecret, setClientSecret] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const [proceed, setProcced] = useState(false);
  const [error, setError] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const handleChange = (event) => {
    event.preventDefault();
    const value = event.target.value;
    setMethod(value);
    setError(false);
  };
  const handleChangeCart = (event) => {
    setDisabled(event.empty);
    setError(event.error ? true : false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (method == "Carte Bancaire") {
      if (disabled || error) {
        toast.warning(`Veuillez enter un carte bancaire valide`, {
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
      } else {
        var result = window.confirm(
          `Voulez vous vraiment confirmer le paiement de la commande `
        );
        if (result) {
          const response = await axios({
            method: "post",
            url: `/payments/create?total=${location.state.total}`,
          });

          const payload = await stripe
            .confirmCardPayment(response.data.clientSecret, {
              payment_method: {
                card: elements.getElement(CardElement),
              },
            })
            .then(({ paymentIntent }) => {
              axios
                .post(
                  `/create/order`,
                  {
                    user: user,
                    products: basket,
                    total: location.state.total,
                    payment_method: method,
                    date: getFullDate(),
                    status: "Confirmée",
                  },
                  {
                    headers: {
                      "x-access-token": localStorage.getItem("token"),
                    },
                  }
                )
                .then((response) => {
                  toast.success(`Paiement effectué avec succès`, {
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
                    type: "EMPTY_BASKET",
                  });

                  history.replace("/orders");
                })
                .catch((error) => {
                  if (error.response) {
                    console.log(error);
                  }
                });
            });
        }
      }
    } else {
      if (method == "Aucun") {
        toast.info(`Veuillez choisir le mode de paiement`, {
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
      } else {
        var result = window.confirm(
          `Voulez vous vraiment passer cette commande `
        );
        if (result) {
          await axios
            .post(
              `/create/order`,
              {
                user: user,
                products: basket,
                total: location.state.total,
                payment_method: method,
                date: getFullDate(),
                status: "En attente",
              },
              {
                headers: {
                  "x-access-token": localStorage.getItem("token"),
                },
              }
            )
            .then((response) => {
              toast.success(`Commande créer avec succée`, {
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
              setTimeout(function () {
                dispatch({
                  type: "EMPTY_BASKET",
                });

                history.replace("/orders");
              }, 2000);
            })
            .catch((error) => {
              if (error.response) {
                console.log(error);
              }
            });
        }
      }
    }
  };
  function getFullDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + "/" + dd + "/" + yyyy;
    return today;
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="Payment"
    >
      <ToastContainer />
      <div className="Payment_banner">
        <div className="Payment_title">
          <h1>Paiement</h1>
        </div>
        <img src={Meuble} alt="" />
      </div>
      <div className="Paymment_container">
        <div className="Payment_container_left_items">
          <div className="Payment_container_title">Confimer Commande :</div>
          <div className="Payment_container_address">
            <div className="Payment_right_items">Addresse de livraison</div>
            <div className="Payment_left_items">
              <div className="Payment_info_delivery">
                <div className="Payment_infos_title">Nom et Prénom :</div>
                <div className="Payment_infos_text">
                  {" "}
                  {user.lastName + " " + user.firstName}
                </div>
              </div>
              <div className="Payment_info_delivery">
                <div className="Payment_infos_title">Email :</div>
                <div className="Payment_infos_text">{user.email}</div>
              </div>
              <div className="Payment_info_delivery">
                <div className="Payment_infos_title">Addresse :</div>
                <div className="Payment_infos_text">{user.address}</div>
              </div>
              <div className="Payment_info_delivery">
                <div className="Payment_infos_title">Ville :</div>
                <div className="Payment_infos_text">{user.state}</div>
              </div>
              <div className="Payment_info_delivery">
                <div className="Payment_infos_title">Téléphone :</div>
                <div className="Payment_infos_text">(+216) {user.phone}</div>
              </div>
            </div>
          </div>
          <div className="Payment_container_products">
            <div className="Payment_product_title">Articles commandés :</div>
            {basket
              ? basket.map((item) => {
                  return (
                    <div className="Payment_product">
                      <div className="Payment_product_image">
                        <img
                          src={
                            "https://projetecommercebackend.herokuapp.com/images/" +
                            item.product.image
                          }
                        />
                      </div>
                      <div className="Payment_product_infos">
                        <div className="Payment_product-row">
                          <div className="Payment_row_left_items">
                            Nom du produit :
                          </div>
                          <div className="Payment_row_right_items">
                            {item.product.title}
                          </div>
                        </div>
                        <div className="Payment_product-row">
                          <div className="Payment_row_left_items">
                            Couleur :
                          </div>
                          <div className="Payment_row_right_items">
                            <div className="color_product"></div>
                          </div>
                        </div>
                        <div className="Payment_product-row">
                          <div className="Payment_row_left_items">
                            Prix unitaire :
                          </div>
                          <div className="Payment_row_right_items">
                            {item.product.price} DT
                          </div>
                        </div>
                        <div className="Payment_product-row">
                          <div className="Payment_row_left_items">
                            Quantité :
                          </div>
                          <div className="Payment_row_right_items">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="Payment_product-row">
                          <div className="Payment_row_left_items">
                            Prix Total :
                          </div>
                          <div className="Payment_row_right_items">
                            {item.quantity * parseInt(item.product.price)} DT
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              : ""}
          </div>
        </div>
        <div className="Payment_container_right_items">
          <div className="Payment_right_items_title">
            RÉCAPITULATIF DE LA COMMANDE
          </div>
          <div className="Payment_right_items_content">
            <div className="row_content rc_title">
              <div className="row_content_left">Produit(s)</div>
              <div className="row_content_right"> Prix </div>
            </div>
            {basket
              ? basket.map((item) => {
                  return (
                    <div className="row_content">
                      <div className="row_content_left">
                        {item.product.title}
                      </div>
                      <div className="row_content_middle">x{item.quantity}</div>
                      <div className="row_content_right">
                        {" "}
                        {item.quantity * parseInt(item.product.price)} DT{" "}
                      </div>
                    </div>
                  );
                })
              : ""}

            <div className="row_content rc_total">
              <div className="row_content_left rcl_total">
                Frais de livraison
              </div>
              <div className="row_content_right rcl_total">100 DT </div>
            </div>
            <div className="row_content rc_total">
              <div className="row_content_left rcl_total">Total</div>
              <div className="row_content_right rcl_total">
                {" "}
                {location.state.total} DT{" "}
              </div>
            </div>
          </div>
          <div className="Payment_right_items_details">
            <div className="details_title">Mode de Paiement : ({method})</div>
            <div className="details_content">
              <select
                name="select"
                onChange={handleChange}
                value={method}
                className="selectMethod"
              >
                <option value="Aucun">Aucun</option>
                <option value="Chéque">Chéque</option>
                <option value="Virement Bancaire">Virement Bancaire</option>
                <option value="Carte Bancaire">Carte Bancaire</option>
              </select>
              {method == "Carte Bancaire" ? (
                <form className="cart_form">
                  <CardElement name="card" onChange={handleChangeCart} />
                </form>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="button_confirmer_commande">
            <button className="confimer_button" onClick={handleSubmit}>
              Payer
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Payment;
