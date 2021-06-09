import React, { useEffect, useState } from "react";
import "./PopUpOrders.css";

import IconButton from "@material-ui/core/IconButton";
import SearchBar from "material-ui-search-bar";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ThumbUpOutlinedIcon from "@material-ui/icons/ThumbUpOutlined";
import axios from "../axios";
import { ToastContainer, toast, Zoom, Bounce } from "react-toastify";
import SearchIcon from "@material-ui/icons/Search";
import "date-fns";
import Grid from "@material-ui/core/Grid";
import MomentUtils from "@date-io/moment";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

const PopUpOrders = ({ onChange, onSetOrder, user, id }) => {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const handleDateChange = async (date) => {
    console.log("date", date.format("MM/DD/YYYY"));
    setSelectedDate(date);
    console.log(date.format("MM/DD/YYYY").toString().replaceAll("/", "-"));
    await axios
      .get(
        `/get/user/orders/date/${date
          .format("MM/DD/YYYY")
          .toString()
          .replaceAll("/", "-")}/${user._id}`,
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        console.log("data", response.data);
        setOrders(response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error);
        }
      });
  };

  useEffect(async () => {
    await axios
      .get(`/get/user/orders/${id}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log("data", response.data);
        setOrders(response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error);
        }
      });
  }, [refresh, id]);

  const searchOrder = async () => {
    if (search) {
      await axios
        .get(`/get/order/${search}`, {
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
            setOrders([]);
          }
        });
    } else {
      await axios
        .get(`/get/user/orders/${id}`, {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        })
        .then((response) => {
          setOrders(response.data);
        })
        .catch((error) => {
          if (error) {
            setOrders([]);
          }
        });
    }
  };
  const confirmOrder = async (order) => {
    var result = window.confirm(
      `Voulez vous vraiment confirmer la commande de reférence  ${order._id}`
    );
    if (result) {
      await axios
        .patch(`/confirm/order/${order._id}`, null, {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        })
        .then((response) => {
          console.log(response.data);
          if (response.data.order.nModified > 0) {
            toast.success(
              `La commande  ${order._id} a été confirmée avec succée `,
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
          setRefresh(!refresh);
        })
        .catch((error) => {
          if (error.response) {
            toast.error("" + error.response, {
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
        });
    }
  };

  const cancelOrder = async (order) => {
    var result = window.confirm(
      `Voulez vous vraiment annuler la commande de reférence  ${order._id}`
    );
    if (result) {
      await axios
        .patch(`/cancel/order/${order._id}`, null, {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        })
        .then((response) => {
          console.log(response.data);
          if (response.data.order.nModified > 0) {
            toast.success(
              `La commande  ${order._id} a été annullée avec succée `,
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
          setRefresh(!refresh);
        })
        .catch((error) => {
          if (error.response) {
            toast.error("" + error.response, {
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
        });
    }
  };
  return (
    <div className="PopUpOrders">
      <div className="PopUpOrders_title">Commandes</div>
      <div className="PopUpOrders_container">
        <div className="client_container">
          <div className="client_container_title">Détails Client :</div>
          <div className="client_id_container">
            <div className="client_title">Identifiant :</div>
            <div className="client_text">#{user ? user._id : ""}</div>
          </div>
          <div className="client_name_container">
            <div className="client_title">Nom et prénom :</div>
            <div className="client_text">
              {user ? user.firstName + " " + user.lastName : ""}
            </div>
          </div>
        </div>
        <div className="orders_container">
          <div className="orders_container_title">Liste des commandes :</div>
          <div className="orders_container_search">
            <div className="search_bar">
              <SearchBar
                value={search}
                onChange={(newValue) => setSearch(newValue)}
                onRequestSearch={searchOrder}
                onCancelSearch={() => {
                  setRefresh(!refresh);
                  setSearch("");
                }}
              />
            </div>
            <div className="search_date">
              <div className="text">ou</div>
              <div className="date_bar">
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <Grid container justify="space-around">
                    <KeyboardDatePicker
                      margin="normal"
                      id="date-picker-dialog"
                      label="Choisir une date"
                      format="MM/dd/yyyy"
                      value={selectedDate}
                      onChange={handleDateChange}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </Grid>
                </MuiPickersUtilsProvider>
              </div>
            </div>
          </div>
          <div className="table_best_clients_table">
            <div className="table_nav">
              <div className="table_nav_item medium_width">Identifiant</div>
              <div className="table_nav_item big_width">Date</div>
              <div className="table_nav_item small_width">Mode Paiement</div>
              <div className="table_nav_item small_width">Etat</div>
              <div className="table_nav_item small_width">Montant</div>
              <div className="table_nav_item medium_width">Actions</div>
            </div> 
            <div className="table_client_orders_content"> 
            {orders.length > 0 ? (
              orders.map((order) => {
                return (
                  <div className="table_best_clients_table_content height_table special_table_css">
                    <div className="table_content_item medium_width Orders_id">
                      #{order._id}
                    </div>
                    <div className="table_content_item big_width">
                      {order.date}
                    </div>
                    <div className="table_content_item small_width">
                      {order.payment_method}
                    </div>

                    <div className="table_content_item small_width special_css">
                      {order.status == "Confirmée" ? (
                        <div className="badge_confirmed st_badge">
                          {order.status}
                        </div>
                      ) : order.status == "En attente" ? (
                        <div className="badge_waiting st_badge">
                          {order.status}
                        </div>
                      ) : (
                        <div className="badge_cancled st_badge">
                          {order.status}
                        </div>
                      )}
                    </div>
                    <div className="table_content_item small_width Orders_total ">
                      {order.total} DT
                    </div>
                    <div className="table_nav_item medium_width special_css">
                      {order.status == "En attente" ? (
                        <div className="action_delete">
                          <IconButton aria-label="add-person">
                            <DeleteOutlineIcon
                              style={{ color: "red" }}
                              onClick={() => cancelOrder(order)}
                            />
                          </IconButton>
                        </div>
                      ) : (
                        ""
                      )}
                      {order.status == "En attente" ? (
                        <div className="action_orders">
                          <IconButton aria-label="add-person">
                            <ThumbUpOutlinedIcon
                              style={{ color: "green" }}
                              onClick={() => confirmOrder(order)}
                            />
                          </IconButton>
                        </div>
                      ) : (
                        ""
                      )}

                      <div className="action_orders">
                        <IconButton aria-label="add-person">
                          <VisibilityIcon
                            onClick={() => {
                              onChange("Order");
                              onSetOrder(order);
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
                  Aucune commande trouvée
                </div>
              </div>
            )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopUpOrders;
