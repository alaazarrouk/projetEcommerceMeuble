import React, { useEffect, useState } from "react";
import "./Admin.css";
import Home from "../assets/home.png";
import Users from "../assets/users.png";
import Products from "../assets/produit.png";
import { AnimatePresence, motion } from "framer-motion";
import axios from "../axios";

const Admin = () => {
  const [countProducts, setCountProducts] = useState(0);
  const [countOrders, setCountOrders] = useState(0);
  const [countUsers, setCountUsers] = useState(0);
  const [gains, setGains] = useState(0);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(async () => {
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
    await axios
      .get(`/get/orders/count`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log(response.data);
        setCountOrders(response.data["countOrders"]);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error);
        }
      });
    await axios
      .get(`/get/users/count`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log(response.data);
        setCountUsers(response.data["countUsers"]);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error);
        }
      });
    await axios
      .get(`/get/gains`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log(response.data);
        setGains(response.data["gains"]);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error);
        }
      });
    await axios
      .get(`/get/users`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log("users get", response.data);
        setUsers(response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error);
        }
      });
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
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="Admin"
    >
      <div className="Admin_title_container">
        <div className="Admin_title_image">
          <img src={Home} alt="" srcset="" />
        </div>
        <div className="Admin_title_content">
          <div className="Admin_title_content_title">
            Interface Administrateur
          </div>
          <div className="Admin_title_content_subtitle">
            Cette page contient les statistiques globale de l'application
          </div>
        </div>
      </div>
      <div className="Admin_container">
        <div className="Admin_statistic_cards">
          <div className="statistic_card">
            <div className="statistic_title_container">
              <div className="statistic_title_container_title">
                Total Clients
              </div>
              <div className="statistic_title_container_subtitle">
                Total des clients enregistrés
              </div>
            </div>
            <div className="statistic_value">{countUsers}</div>
          </div>
          <div className="statistic_card">
            <div className="statistic_title_container">
              <div className="statistic_title_container_title">
                Gains Totaux
              </div>
              <div className="statistic_title_container_subtitle">
                Total D'argent gagnés
              </div>
            </div>
            <div className="statistic_value">{gains}</div>
          </div>
          <div className="statistic_card">
            <div className="statistic_title_container">
              <div className="statistic_title_container_title">
                Total Produits
              </div>
              <div className="statistic_title_container_subtitle">
                Total des produits publiées
              </div>
            </div>
            <div className="statistic_value">{countProducts}</div>
          </div>
          <div className="statistic_card">
            <div className="statistic_title_container">
              <div className="statistic_title_container_title">
                Total Commande
              </div>
              <div className="statistic_title_container_subtitle">
                Total des commandes faites
              </div>
            </div>
            <div className="statistic_value">{countOrders}</div>
          </div>
        </div>

        <div className="Admin_container_tables">
          <div className="Admin_container_table">
            <div className="Admin_table_best_clients">
              <div className="table_title">
                <div className="table_title_image">
                  <img src={Users} alt="" />
                </div>
                <div className="table_title_text">Meilleurs Clients :</div>
              </div>
              <div className="table_best_clients_table">
                <div className="table_nav">
                  <div className="table_nav_item medium_width">
                    Nom et prenom
                  </div>
                  <div className="table_nav_item big_width">Email</div>
                  <div className="table_nav_item small_width">Téléphone</div>
                  <div className="table_nav_item small_width">
                    Total Commandes
                  </div>
                </div>
                <div className="table_best_clients_table_content">
                  {users
                    ? users.map((user) => {
                        return (
                          <div className="table_best_clients_row">
                            <div className="table_content_item medium_width">
                              {user.firstName + " " + user.lastName}
                            </div>
                            <div className="table_content_item big_width">
                              {user.email}
                            </div>
                            <div className="table_content_item small_width">
                              {user.phone}
                            </div>
                            <div className="table_content_item small_width stat_special">
                              {user.nb_orders}
                            </div>
                          </div>
                        );
                      })
                    : ""}
                </div>
              </div>
            </div>
            <div className="Admin_table_products">
              <div className="table_title">
                <div className="table_title_image">
                  <img src={Products} alt="" />
                </div>
                <div className="table_title_text">Meilleurs Produits :</div>
              </div>
              <div className="table_products_table">
                <div className="table_nav">
                  <div className="table_nav_item medium_width">Identifiant</div>
                  <div className="table_nav_item big_width">Libellé</div>
                  <div className="table_nav_item small_width">Prix</div>
                  <div className="table_nav_item small_width">
                    Total Commandes
                  </div>
                </div>
                <div className="table_products_table_content">
                  {products
                    ? products.map((product) => {
                        return (
                          <div className="table_best_products_row">
                            <div className="table_content_item medium_width item_special">
                              {product._id}
                            </div>
                            <div className="table_content_item big_width">
                              {product.title}
                            </div>
                            <div className="table_content_item small_width">
                              {product.price} DT
                            </div>
                            <div className="table_content_item small_width stat_special">
                              {product.nb_Orders}
                            </div>
                          </div>
                        );
                      })
                    : ""}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Admin;
