import React, { useEffect, useState } from "react";
import "./OrdersAdmin.css";
import Orders from "../assets/orders.png";
import IconButton from "@material-ui/core/IconButton";
import SearchBar from "material-ui-search-bar";
import Order from "../Orders/Order";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ThumbUpOutlinedIcon from "@material-ui/icons/ThumbUpOutlined";
import { AnimatePresence, motion } from "framer-motion";
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
const useStyles = makeStyles((theme) => ({
  input: {
    background: "white",
    width: "300px",
    marginTop: "10px",
  },
}));
const OrdersAdmin = () => {
  const classes = useStyles();
  const [search, setSearch] = useState("");
  const [ordersStats, setOrdersStats] = useState({});
  const [order, setOrder] = useState({});
  const [orders, setOrders] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [refreshStats, setRefreshStats] = useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const status = ["Tous", "Confirmée", "En attente", "Annulée"];
  const [statusChoice, setStatusChoice] = useState("Tous");
  const [searchMethod, setSearchMethod] = useState({
    Method: "Toutes les commandes",
    Data: "",
  });

  useEffect(async () => {
    await axios
      .get(`/get/orders/stats`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log("data stats", response.data);
        setOrdersStats(response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error);
        }
      });
  }, [refresh, refreshStats]);
  useEffect(async () => {
    await axios
      .get(`/get/orders`, {
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
  }, [refresh]);

  const handleDateChange = async (date) => {
    console.log("date", date.format("MM/DD/YYYY"));
    setStatusChoice("Tous");
    setSelectedDate(date);
    setSearchMethod({
      Method: "date",
      Data: date,
    });
    await axios
      .get(
        `/get/orders/date/${date
          .format("MM/DD/YYYY")
          .toString()
          .replaceAll("/", "-")}`,
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

  const handleChange = async (event) => {
    event.preventDefault();
    const value = event.target.value;
    setStatusChoice(value);

    if (value == "Tous") {
      setSearchMethod({
        Method: "Toutes les commandes",
        Data: "",
      });
      await axios
        .get(`/get/orders`, {
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
    } else {
      setSearchMethod({
        Method: "Etat",
        Data: value,
      });
      await axios
        .get(`/get/orders/status/${value}`, {
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
    }
  };

  const searchOrder = async () => {
    setStatusChoice("Tous");
    if (search) {
      setSearchMethod({
        Method: "Identifiant",
        Data: search,
      });
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
      setSearchMethod({
        Method: "Toutes les commandes",
        Data: "",
      });
      await axios
        .get(`/get/orders`, {
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
                autoClose: 2000,
                style: { marginTop: "130px" },
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
              }
            );
          }

          if (searchMethod.Method == "date") {
            console.log("date confirm", searchMethod.Data);
            setRefreshStats(!refreshStats);
            axios
              .get(
                `/get/orders/date/${searchMethod.Data.format("MM/DD/YYYY")
                  .toString()
                  .replaceAll("/", "-")}`,
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
          } else {
            if (searchMethod.Method == "Etat") {
              console.log("etat confirm", searchMethod.Data);
              setRefreshStats(!refreshStats);
              axios
                .get(`/get/orders/status/${searchMethod.Data}`, {
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
            } else {
              setRefresh(!refresh);
            }
          }
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
                autoClose: 2000,
                style: { marginTop: "130px" },
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
              }
            );
          }

          if (searchMethod.Method == "date") {
            console.log("date cancel", searchMethod.Data);
            setRefreshStats(!refreshStats);
            axios
              .get(
                `/get/orders/date/${searchMethod.Data.format("MM/DD/YYYY")
                  .toString()
                  .replaceAll("/", "-")}`,
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
          } else {
            if (searchMethod.Method == "Etat") {
              console.log("etat cancel", searchMethod.Data);
              setRefreshStats(!refreshStats);

              axios
                .get(`/get/orders/status/${searchMethod.Data}`, {
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
            } else {
              setRefresh(!refresh);
            }
          }
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
  const doSomething1 = (popupName) => {
    document.body.style.overflow = "auto";
    document.querySelector(".bg-modal-order").style.display = "none";
    document.querySelector(".bg-modal-order").style.position = "uset";
  };

  const doSomething = (popupName) => {
    document.documentElement.scrollTop = 0;
    document.body.style.overflow = "hidden";
    document.querySelector(".bg-modal-order").style.display = "flex";
    document.querySelector(".bg-modal-order").style.position = "absolute";
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="OrdersAdmin"
    >
      <ToastContainer />
      <div class="bg-modal-order">
        <div class="modal-contents-order">
          <div class="close" onClick={() => doSomething1("Update")}>
            x
          </div>
          <Order order={order} />
        </div>
      </div>

      <div className="Admin_title_container">
        <div className="Admin_title_image">
          <img src={Orders} alt="" srcset="" />
        </div>
        <div className="Admin_title_content">
          <div className="Admin_title_content_title">
            Interface Administrateur (Commandes)
          </div>
          <div className="Admin_title_content_subtitle">
            Cette page contient les statistiques globale des commandes dans
            l'application
          </div>
        </div>
      </div>
      <div className="Admin_container">
        <div className="Admin_statistic_cards">
          <div className="statistic_card">
            <div className="statistic_title_container">
              <div className="statistic_title_container_title">
                Total Commandes
              </div>
              <div className="statistic_title_container_subtitle">
                Total des commandes faites
              </div>
            </div>
            <div className="statistic_value">
              {ordersStats ? ordersStats.countOrders : ""}
            </div>
          </div>
          <div className="statistic_card">
            <div className="statistic_title_container">
              <div className="statistic_title_container_title">Annulées</div>
              <div className="statistic_title_container_subtitle">
                Total des commandes annulées
              </div>
            </div>
            <div className="statistic_value">
              {ordersStats ? ordersStats.countCancledOrders : ""}
            </div>
          </div>
          <div className="statistic_card">
            <div className="statistic_title_container">
              <div className="statistic_title_container_title">En attente</div>
              <div className="statistic_title_container_subtitle">
                Total des commandes en attente
              </div>
            </div>
            <div className="statistic_value">
              {ordersStats ? ordersStats.countWaitingOrders : ""}
            </div>
          </div>
          <div className="statistic_card">
            <div className="statistic_title_container">
              <div className="statistic_title_container_title">Confirmées</div>
              <div className="statistic_title_container_subtitle">
                Total des commandes confirmées
              </div>
            </div>
            <div className="statistic_value">
              {ordersStats ? ordersStats.countConfirmedOrders : ""}
            </div>
          </div>
        </div>

        <div className="Admin_container_tables">
          <div className="Admin_container_table">
            <div className="Admin_table_clients">
              <div className="table_title table_title_fix">
                <div className="table_title_text">Liste des commandes :</div>
                <div className="table_title_search">
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
                  <div className="search_date">
                    <div className="text">ou</div>
                    <div className="date_bar">
                      <FormControl
                        variant="outlined"
                        className={classes.input}
                        style={{ marginLeft: ".5em" }}
                      >
                        <InputLabel htmlFor="outlined-age-native-simple">
                          Etat
                        </InputLabel>
                        <Select
                          native
                          label="Etat"
                          onChange={handleChange}
                          value={statusChoice}
                        >
                          {status.map((st) => {
                            return <option value={st}>{st}</option>;
                          })}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="table_best_clients_table">
                <div className="table_nav">
                  <div className="table_nav_item medium_width">Identifiant</div>
                  <div className="table_nav_item big_width">Date</div>
                  <div className="table_nav_item small_width">
                    Mode Paiement
                  </div>
                  <div className="table_nav_item small_width">Etat</div>
                  <div className="table_nav_item small_width">Montant</div>
                  <div className="table_nav_item medium_width">Actions</div>
                </div>
                <div className="table_orders_content"> 
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
                                  doSomething();
                                  setOrder(order);
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
      </div>
    </motion.div>
  );
};

export default OrdersAdmin;
