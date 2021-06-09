import React, { useEffect, useState } from "react";
import "./Orders.css";
import Meuble from "../assets/meuble.png";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Order from "./Order";
import { AnimatePresence, motion } from "framer-motion";
import { ToastContainer, toast, Zoom, Bounce } from "react-toastify";
import { useStateValue } from "../StateProvider";
import axios from "../axios";
import SearchIcon from "@material-ui/icons/Search";

const Orders = () => {
  const [{ user }, dispatch] = useStateValue();
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState({});
  const [refresh, setRefresh] = useState(false);

  useEffect(async () => {
    await axios
      .get(`/get/user/orders/${user._id}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log(response.data);
        setOrders(response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error);
        }
      });
  }, [refresh]);

  const cancelOrder = async (orderId) => {
    var result = window.confirm(`Voulez vous vraiment annuller la commande `);
    if (result) {
      await axios
        .patch(`/cancel/order/${orderId}`, null, {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        })
        .then((response) => {
          console.log(response.data);
          toast.info(`La commande a été annullée avec succès`, {
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
            toast.error(`Une erreur est produite`, {
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
  const doSomething1 = () => {
    document.body.style.overflow = "auto";
    document.querySelector(".bg-modal").style.display = "none";
    document.querySelector(".bg-modal").style.position = "uset";
  };

  const doSomething = () => {
    document.documentElement.scrollTop = 0;
    document.body.style.overflow = "hidden";
    document.querySelector(".bg-modal").style.display = "flex";
    document.querySelector(".bg-modal").style.position = "absolute";
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="Orders"
    >
      <ToastContainer />
      <div className="Orders_banner">
        <div className="Orders_title">
          <h1>Commandes</h1>
        </div>
        <img src={Meuble} alt="" />
      </div>
      <div class="bg-modal">
        <div class="modal-contents md">
          <div class="close" onClick={() => doSomething1()}>
            x
          </div>
          <Order order={order} />
        </div>
      </div>
      <div className="Orders_container">
        <div className="Orders_container_title">Vos Commandes :</div>
        <div className="Orders_container_content">
          <div className="Orders_container_left_items">
            <div className="Orders_container_items_title">
              Commandes Confirmées :
            </div>
            <div className="Orders_container_items_nav">
              <div className="Orders_id_title">Identifiant</div>
              <div className="Orders_date_title">Date</div>
              <div className="Orders_Status_title">Etat</div>
              <div className="Orders_Action_title">Action</div>
            </div>
            <div className="Orders_container_left_items_content">
              {orders.length !== 0 ? (
                orders.map((order) => {
                  if (order.status == "Annulée") {
                    return "";
                  } else {
                    return (
                      <div className="commande">
                        <div className="Orders_id">{order._id}</div>
                        <div className="Orders_date">{order.date}</div>
                        <div className="Orders_Status">
                          {order.status == "Confirmée" ? (
                            <div className="badge_confirmed">
                              {order.status}
                            </div>
                          ) : (
                            <div className="badge_waiting">{order.status}</div>
                          )}
                        </div>
                        <div className="Orders_Action">
                          {order.status !== "Confirmée" ? (
                            <div className="remove_order">
                              <IconButton>
                                <DeleteOutlineIcon
                                  onClick={() => cancelOrder(order._id)}
                                  style={{
                                    color: "#ff003c",
                                    height: "20px",
                                    width: "20px",
                                  }}
                                />
                              </IconButton>
                            </div>
                          ) : (
                            ""
                          )}

                          <div className="show_order">
                            <IconButton>
                              <VisibilityIcon
                                onClick={() => {
                                  setOrder(order);
                                  doSomething();
                                }}
                              />
                            </IconButton>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })
              ) : (
                <div className="no_data_found">
                  <div className="no_data_found_image">
                    <SearchIcon />
                  </div>
                  <div className="no_data_found_text">
                    Aucune commande trouvée
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="Orders_container_right_items">
            <div className="Orders_container_items_title">
              Commandes Annulées :
            </div>
            <div className="Orders_container_items_nav">
              <div className="Orders_id_title">Identifiant</div>
              <div className="Orders_date_title">Date</div>
              <div className="Orders_Status_title">Etat</div>
              <div className="Orders_Action_title">Action</div>
            </div>
            <div className="Orders_container_right_items_content">
              {orders.length !== 0 ? (
                orders.map((order) => {
                  if (order.status !== "Annulée") {
                    return "";
                  } else {
                    return (
                      <div className="commande">
                        <div className="Orders_id">{order._id}</div>
                        <div className="Orders_date">{order.date}</div>
                        <div className="Orders_Status">
                          <div className="badge_cancled">{order.status}</div>
                        </div>
                        <div className="Orders_Action">
                          <div className="show_order">
                            <IconButton>
                              <VisibilityIcon
                                onClick={() => {
                                  setOrder(order);
                                  doSomething();
                                }}
                              />
                            </IconButton>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })
              ) : (
                <div className="no_data_found">
                  <div className="no_data_found_image">
                    <SearchIcon />
                  </div>
                  <div className="no_data_found_text">
                    Aucune commande trouvée
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Orders;
