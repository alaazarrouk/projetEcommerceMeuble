import React, { useEffect, useState } from "react";
import "./Basket.css";
import ChaiseMeuble from "../assets/chaise-meuble.jpg";
import Meuble from "../assets/meuble.png";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import IconButton from "@material-ui/core/IconButton";
import { AnimatePresence, motion } from "framer-motion";
import { HashLink as Link } from "react-router-hash-link";
import { useStateValue } from "../StateProvider";
import SearchIcon from "@material-ui/icons/Search";

const Basket = () => {
  const [{ basket }, dispatch] = useStateValue();
  const [total, setTotal] = useState(0);
  const [quantity, setQuantity] = useState(0);
  console.log("basket basket", basket);

  useEffect(() => {
    var totalPrice = 0;
    for (var i = 0; i < basket.length; i++) {
      totalPrice =
        totalPrice + parseInt(basket[i].product.price * basket[i].quantity);
    }
    setTotal(totalPrice + 100);
  }, [basket]);

  const handleChange = (event) => {
    const name = event.target.name;
    var value = event.target.value;
    console.log("value", value);
    if (value < 10 && value > 0) {
      value = parseInt(value);
    }
    dispatch({
      type: "UPDATE_BASKET",
      item: {
        productId: name,
        quantity: value,
      },
    });
  };

  const deleteProduct = (product) => {
    console.log("Im here", product._id);
    dispatch({
      type: "REMOVE_FROM_BASKET",
      id: product._id,
    });
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="Basket"
    >
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      ></link>
      <div className="Basket_banner">
        <div className="Basket_title">
          <h1>Panier</h1>
        </div>
        <img src={Meuble} alt="" />
      </div>
      <div className="Basket_container">
        <div className="Basket_left_items">
          <div className="Basket_left_items_title">Vos Articles : </div>
          <div className="Basket_left_items_titles">
            <div className="product_title_info">Produit</div>
            <div className="product_price_info">Prix</div>
            <div className="product_qte_info">Quantité</div>
            <div className="product_total_info">Total</div>
          </div>
          {basket.length !== 0 ? (
            basket.map((item) => {
              return (
                <div className="Basket_left_items_product">
                  <div className="product_info_basket">
                    <div className="product_image_basket">
                      <img
                        src={
                          "https://projetecommercebackend.herokuapp.com/images/" +
                          item.product.image
                        }
                        alt=""
                      />
                    </div>
                    <div className="product_title1">
                      <div className="product_title1_text">
                        {item.product.title}
                      </div>
                      <div className="product_title1_remove">
                        <IconButton>
                          <DeleteOutlineIcon
                            style={{
                              color: "#ff003c",
                              height: "20px",
                              width: "20px",
                            }}
                            onClick={() => deleteProduct(item.product)}
                          />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                  <div className="product_price1">{item.product.price} DT</div>
                  <div className="product_qte">
                    <input
                      value={item.quantity}
                      type="number"
                      id="quantity"
                      name={item.product._id}
                      onChange={handleChange}
                      min="1"
                      max="10"
                    />
                  </div>
                  <div className="product_total">
                    {parseInt(item.product.price) * item.quantity} DT
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
                Aucun produit trouvé dans le panier
              </div>
            </div>
          )}
        </div>

        <div className="Basket_right_items">
          <div className="Basket_right_items_title">
            RÉCAPITULATIF DE LA COMMANDE
          </div>
          <div className="Basket_right_items_content">
            <div className="row_content">
              <div className="row_content_left">Total</div>
              <div className="row_content_right">
                {total == 0 ? 0 : total - 100} DT
              </div>
            </div>
            <div className="row_content">
              <div className="row_content_left">Frais Livraison</div>
              <div className="row_content_right">100 DT</div>
            </div>
            <div className="row_content">
              <div className="row_content_left">Total</div>
              <div className="row_content_right total_amount">
                {total == 100 ? 0 : total} DT
              </div>
            </div>
          </div>
          <div className="Basket_right_items_details">
            <div className="details_title">Voir Détails :</div>
            <div className="details_content">
              Vous ne serez facturé qu'au moment de l'expédition, sauf pour les
              commandes de bricolage où le montant total est facturé au moment
              de l'achat
            </div>
          </div>
          <div className="button_confirmer_commande">
            <Link
              to={{
                pathname: "/payment",
                state: {
                  total: total,
                },
              }}
            >
              <button disabled={basket.length == 0} className="confimer_button">
                Confirmer
              </button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Basket;
