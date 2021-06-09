import React, { useEffect, useState } from "react";
import "./Clients.css";
import Home from "../assets/home.png";
import Users from "../assets/users.png";
import Products from "../assets/produit.png";
import CreateIcon from "@material-ui/icons/Create";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import ListIcon from "@material-ui/icons/List";
import SearchBar from "material-ui-search-bar";
import PopUpUpdateUser from "../User/PopUpUpdateUser";
import PopUpOrders from "./PopUpOrders";
import Order from "../Orders/Order";
import { AnimatePresence, motion } from "framer-motion";
import axios from "../axios";
import { ToastContainer, toast, Zoom, Bounce } from "react-toastify";
import SearchIcon from "@material-ui/icons/Search";

const Clients = () => {
  const [countUsers, setCountUsers] = useState(0);
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState({});
  const [userInfo, setUserInfo] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    state: "",
    nb_orders: "",
  });

  useEffect(async () => {
    await axios
      .get(`/get/users/count`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setCountUsers(response.data["countUsers"]);
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
  }, [refresh]);

  const searchUser = async () => {
    if (search) {
      await axios
        .get(`/get/user/search/${search}`, {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        })
        .then((response) => {
          console.log(response.data);
          setUsers(response.data);
        })
        .catch((error) => {
          if (error.response) {
            console.log(error);
          }
        });
    } else {
      await axios
        .get(`/get/users`, {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        })
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          if (error.response) {
            console.log(error);
          }
        });
    }
  };

  const deleteUser = async (user) => {
    var result = window.confirm(
      `Voulez vous vraiment supprimer l'utilisateur  ${
        user.firstName + " " + user.lastName
      }`
    );
    if (result) {
      await axios
        .delete(`/delete/user/${user._id}`, {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        })
        .then((response) => {
          console.log(response.data);
          if (response.data.userDeleted.deletedCount > 0) {
            toast.success(
              `L'utilisateur ${
                user.firstName + " " + user.lastName
              } supprimé avec succée `,
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

  const doSomething1 = (popupName) => {
    document.body.style.overflow = "auto";
    if (popupName == "Modify") {
      document.querySelector(".bg-modal-modify").style.display = "none";
      document.querySelector(".bg-modal-modify").style.position = "uset";
    }

    if (popupName == "Orders") {
      document.querySelector(".bg-modal-orders").style.display = "none";
      document.querySelector(".bg-modal-orders").style.position = "uset";
    }
    if (popupName == "Order") {
      document.querySelector(".bg-modal-order").style.display = "none";
      document.querySelector(".bg-modal-order").style.position = "uset";
    }
  };

  const doSomething = (popupName) => {
    document.documentElement.scrollTop = 0;
    document.body.style.overflow = "hidden";
    if (popupName == "Modify") {
      document.querySelector(".bg-modal-modify").style.display = "flex";
      document.querySelector(".bg-modal-modify").style.position = "absolute";
    }
    if (popupName == "Orders") {
      document.querySelector(".bg-modal-orders").style.display = "flex";
      document.querySelector(".bg-modal-orders").style.position = "absolute";
    }
    if (popupName == "Order") {
      document.querySelector(".bg-modal-order").style.display = "flex";
      document.querySelector(".bg-modal-order").style.position = "absolute";
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="Clients"
    >
      <ToastContainer />
      <div class="bg-modal-modify">
        <div class="modal-contents-modify">
          <div class="close" onClick={() => doSomething1("Modify")}>
            x
          </div>
          <PopUpUpdateUser
            refresh={refresh}
            onChange={(value) => setRefresh(value)}
            userInfo={userInfo}
            controller="Admin"
          />
        </div>
      </div>
      <div class="bg-modal-orders">
        <div class="modal-contents-orders">
          <div class="close" onClick={() => doSomething1("Orders")}>
            x
          </div>
          <PopUpOrders
            onChange={(value) => doSomething(value)}
            onSetOrder={(value) => setOrder(value)}
            user={userInfo}
            id={userInfo._id}
          />
        </div>
      </div>
      <div class="bg-modal-order">
        <div class="modal-contents-order">
          <div class="close" onClick={() => doSomething1("Order")}>
            x
          </div>
          <Order order={order} />
        </div>
      </div>
      <div className="Admin_title_container">
        <div className="Admin_title_image">
          <img src={Users} alt="" srcset="" />
        </div>
        <div className="Admin_title_content">
          <div className="Admin_title_content_title">
            Interface Administrateur (Clients)
          </div>
          <div className="Admin_title_content_subtitle">
            Cette page contient les statistiques globale des clients dans
            l'application
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
        </div>

        <div className="Admin_container_tables">
          <div className="Admin_container_table">
            <div className="Admin_table_clients">
              <div className="table_title table_title_fix">
                <div className="table_title_text">Liste des clients :</div>
                <div className=" search_bar search_bar_design">
                  <SearchBar
                    value={search}
                    onChange={(newValue) => setSearch(newValue)}
                    onRequestSearch={searchUser}
                    onCancelSearch={() => {
                      setRefresh(!refresh);
                      setSearch("");
                    }}
                  />
                </div>
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

                  <div className="table_nav_item medium_width">Actions</div>
                </div>
                <div class="table_clients_content">  
                {users.length !== 0 ? (
                  users.map((user) => {
                    return (
                      <div className="table_best_clients_table_content height_table special_table_css">
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

                        <div className="table_nav_item medium_width special_css">
                          <div className="action_modify">
                            <IconButton aria-label="add-person">
                              <CreateIcon
                                style={{ color: "green" }}
                                onClick={() => {
                                  setUserInfo({
                                    _id: user._id,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    phone: user.phone,
                                    email: user.email,
                                    address: user.address,
                                    state: user.state,
                                    nb_orders: user.nb_orders,
                                  });
                                  doSomething("Modify");
                                }}
                              />
                            </IconButton>
                          </div>
                          <div className="action_delete">
                            <IconButton aria-label="add-person">
                              <DeleteIcon
                                style={{ color: "red" }}
                                onClick={() => {
                                  deleteUser(user);
                                }}
                              />
                            </IconButton>
                          </div>
                          <div className="action_orders">
                            <IconButton aria-label="add-person">
                              <ListIcon
                                style={{ color: "brown" }}
                                onClick={() => {
                                  doSomething("Orders");
                                  setUserInfo({
                                    _id: user._id,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    phone: user.phone,
                                    email: user.email,
                                    address: user.address,
                                    state: user.state,
                                    nb_orders: user.nb_orders,
                                  });
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
                      Aucun client trouvé
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

export default Clients;
