import React from "react";
import "./Order.css";
import ChaiseMeuble from "../assets/chaise-meuble.jpg";
import userEvent from "@testing-library/user-event";

const Order = ({ order }) => {
  return (
    <div className="Order">
      <div className="Order_title">
        <div className="Order_title_text">Commande</div>

        <div className="Order_subtitle_text"> Détails Commande</div>
        <div className="Order_title_content">
          <div className="Order_title_content_title">ID :</div>
          <div className="Order_title_content_text">
            #{order ? order._id : ""}
          </div>
        </div>
        <div className="Order_title_content">
          <div className="Order_title_content_title">Date :</div>
          <div className="Order_title_content_text">
            {order ? order.date : ""}
          </div>
        </div>
        <div className="Order_title_content">
          <div className="Order_title_content_title">Etat:</div>
          <div className="Order_title_content_text">
            {order ? order.status : ""}
          </div>
        </div>
        <div className="Order_title_content">
          <div className="Order_title_content_title">Mode paiement :</div>
          <div className="Order_title_content_text">
            {order ? order.payment_method : ""}
          </div>
        </div>
        <div className="Order_title_content">
          {order ? (
            order.status == "En attente" ? (
              <div className="Order_title_content_title">Montant a payé :</div>
            ) : (
              <div className="Order_title_content_title">Montant payé :</div>
            )
          ) : (
            ""
          )}

          <div className="Order_title_content_text oc_montant">
            {order ? order.total : ""} DT
          </div>
        </div>
      </div>
      <div className="Order_container">
        <div className="Order_container_address">
          <div className="Order_right_items">Addresse de livraison</div>
          <div className="Order_left_items">
            <div className="Order_info_delivery">
              <div className="Order_infos_title">Nom et Prénom :</div>
              <div className="Order_infos_text">
                {order.user ? order.user.firstName : ""}{" "}
                {order.user ? order.user.lastName : ""}
              </div>
            </div>
            <div className="Order_info_delivery">
              <div className="Order_infos_title">Email :</div>
              <div className="Order_infos_text">
                {order.user ? order.user.email : ""}
              </div>
            </div>
            <div className="Order_info_delivery">
              <div className="Order_infos_title">Addresse :</div>
              <div className="Order_infos_text">
                {order.user ? order.user.address : ""}
              </div>
            </div>
            <div className="Order_info_delivery">
              <div className="Order_infos_title">Ville :</div>
              <div className="Order_infos_text">
                {order.user ? order.user.state : ""}
              </div>
            </div>
            <div className="Order_info_delivery">
              <div className="Order_infos_title">Téléphone :</div>
              <div className="Order_infos_text">
                (+216) {order.user ? order.user.phone : ""}
              </div>
            </div>
          </div>
        </div>
        <div className="Order_container_products">
          <div className="Order_product_title">Articles commandés :</div>
          {order.products
            ? order.products.map((product) => {
                return (
                  <div className="Order_product">
                    <div className="Order_product_image">
                      <img
                        src={
                          "https://projetecommercebackend.herokuapp.com/images/" +
                          product.product.image
                        }
                      />
                    </div>
                    <div className="Order_product_infos">
                      <div className="Order_product-row">
                        <div className="Order_row_left_items">
                          Nom du produit :
                        </div>
                        <div className="Order_row_right_items">
                          {product ? product.product.title : ""}
                        </div>
                      </div>
                      
                      <div className="Order_product-row">
                        <div className="Order_row_left_items">
                          Prix unitaire :
                        </div>
                        <div className="Order_row_right_items">
                          {product ? product.product.price : ""} DT
                        </div>
                      </div>
                      <div className="Order_product-row">
                        <div className="Order_row_left_items">Quantité :</div>
                        <div className="Order_row_right_items">
                          {product ? product.quantity : ""}
                        </div>
                      </div>
                      <div className="Order_product-row">
                        <div className="Order_row_left_items">Prix Total :</div>
                        <div className="Order_row_right_items">
                          {product
                            ? product.quantity * parseInt(product.product.price)
                            : ""}{" "}
                          DT
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            : ""}
        </div>
      </div>
    </div>
  );
};

export default Order;
