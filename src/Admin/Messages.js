import React, { useEffect, useState } from "react";
import "./Messages.css";
import Chat from "../assets/chat.png";
import IconButton from "@material-ui/core/IconButton";
import SearchBar from "material-ui-search-bar";
import Message from "./Message";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

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
  const [messagesStats, setMessagesStats] = useState({});
  const [message, setMessage] = useState({});
  const [messages, setMessages] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [refreshStats, setRefreshStats] = useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const status = ["Tous", "Répondu", "En attente", "Ignoré"];
  const [statusChoice, setStatusChoice] = useState("Tous");
  const [searchMethod, setSearchMethod] = useState({
    Method: "Toutes les messages",
    Data: "",
  });

  useEffect(async () => {
    await axios
      .get(`/get/messages/stats`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setMessagesStats(response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error);
        }
      });
  }, [refresh, refreshStats]);
  useEffect(async () => {
    await axios
      .get(`/get/messages`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error);
        }
      });
  }, [refresh]);

  const handleDateChange = async (date) => {
    setStatusChoice("Tous");
    setSelectedDate(date);
    setSearchMethod({
      Method: "date",
      Data: date,
    });
    await axios
      .get(
        `/get/messages/date/${date
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
        setMessages(response.data);
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
        Method: "Toutes les messages",
        Data: "",
      });
      await axios
        .get(`/get/messages`, {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        })
        .then((response) => {
          setMessages(response.data);
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
        .get(`/get/messages/status/${value}`, {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        })
        .then((response) => {
          setMessages(response.data);
        })
        .catch((error) => {
          if (error.response) {
            console.log(error);
          }
        });
    }
  };

  const searchMessage = async () => {
    setStatusChoice("Tous");
    if (search) {
      setSearchMethod({
        Method: "Email",
        Data: search,
      });
      await axios
        .get(`/get/user/messages/${search}`, {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        })
        .then((response) => {
          console.log(response.data);
          setMessages(response.data);
        })
        .catch((error) => {
          if (error.response) {
            setMessages([]);
          }
        });
    } else {
      setSearchMethod({
        Method: "Toutes les messages",
        Data: "",
      });
      await axios
        .get(`/get/messages`, {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        })
        .then((response) => {
          setMessages(response.data);
        })
        .catch((error) => {
          if (error) {
            setMessages([]);
          }
        });
    }
  };

  const ignoreMessage = async (message) => {
    var result = window.confirm(
      `Voulez vous vraiment ignorer le message de  ${message.email}`
    );
    if (result) {
      await axios
        .patch(`/cancel/message/${message._id}`, null, {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        })
        .then((response) => {
          console.log(response.data);
          if (response.data.message.nModified > 0) {
            toast.success(
              `Le message de ${message.email} a été ignoré avec succée `,
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
                `/get/messages/date/${searchMethod.Data.format("MM/DD/YYYY")
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
                setMessages(response.data);
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
                .get(`/get/messages/status/${searchMethod.Data}`, {
                  headers: {
                    "x-access-token": localStorage.getItem("token"),
                  },
                })
                .then((response) => {
                  console.log("data", response.data);
                  setMessages(response.data);
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
    document.querySelector(".bg-modal-message").style.display = "none";
    document.querySelector(".bg-modal-message").style.position = "uset";
  };

  const doSomething = (popupName) => {
    document.documentElement.scrollTop = 0;
    document.body.style.overflow = "hidden";
    document.querySelector(".bg-modal-message").style.display = "flex";
    document.querySelector(".bg-modal-message").style.position = "absolute";
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="OrdersAdmin"
    >
      <ToastContainer />
      <div class="bg-modal-message">
        <div class="modal-contents-message">
          <div class="close" onClick={() => doSomething1("")}>
            x
          </div>
          <Message
            refresh={refresh}
            onChange={(value) => setRefresh(value)}
            message={message}
          />
        </div>
      </div>

      <div className="Admin_title_container">
        <div className="Admin_title_image">
          <img src={Chat} alt="" srcset="" />
        </div>
        <div className="Admin_title_content">
          <div className="Admin_title_content_title">
            Interface Administrateur (Messages)
          </div>
          <div className="Admin_title_content_subtitle">
            Cette page contient les statistiques globale des messages dans
            l'application
          </div>
        </div>
      </div>
      <div className="Admin_container">
        <div className="Admin_statistic_cards">
          <div className="statistic_card">
            <div className="statistic_title_container">
              <div className="statistic_title_container_title">
                Total Messages
              </div>
              <div className="statistic_title_container_subtitle">
                Total des messages reçus
              </div>
            </div>
            <div className="statistic_value">
              {messagesStats ? messagesStats.countMessages : ""}
            </div>
          </div>
          <div className="statistic_card">
            <div className="statistic_title_container">
              <div className="statistic_title_container_title">Ignorés</div>
              <div className="statistic_title_container_subtitle">
                Total des messages ignorés
              </div>
            </div>
            <div className="statistic_value">
              {messagesStats ? messagesStats.countCancledMessages : ""}
            </div>
          </div>
          <div className="statistic_card">
            <div className="statistic_title_container">
              <div className="statistic_title_container_title">En attente</div>
              <div className="statistic_title_container_subtitle">
                Total des messages en attente
              </div>
            </div>
            <div className="statistic_value">
              {messagesStats ? messagesStats.countWaitingMessages : ""}
            </div>
          </div>
          <div className="statistic_card">
            <div className="statistic_title_container">
              <div className="statistic_title_container_title">Répondus</div>
              <div className="statistic_title_container_subtitle">
                Total des messages répondus
              </div>
            </div>
            <div className="statistic_value">
              {messagesStats ? messagesStats.countRespondedMessages : ""}
            </div>
          </div>
        </div>

        <div className="Admin_container_tables">
          <div className="Admin_container_table">
            <div className="Admin_table_clients">
              <div className="table_title table_title_fix">
                <div className="table_title_text">Liste des messages :</div>
                <div className="table_title_search">
                  <div className="search_bar">
                    <SearchBar
                      value={search}
                      onChange={(newValue) => setSearch(newValue)}
                      onRequestSearch={searchMessage}
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
                  <div className="table_nav_item medium_width">Email</div>
                  <div className="table_nav_item big_width">Date</div>
                  <div className="table_nav_item small_width">Etat</div>
                  <div className="table_nav_item medium_width">Actions</div>
                </div>
                 <div className="table_messages_content"> 
                 {messages.length > 0 ? (
                  messages.map((message) => {
                    return (
                      <div className="table_best_clients_table_content height_table special_table_css">
                        <div className="table_content_item medium_width Orders_id">
                          #{message.email}
                        </div>
                        <div className="table_content_item big_width">
                          {message.date}
                        </div>

                        <div className="table_content_item small_width special_css">
                          {message.status == "Répondu" ? (
                            <div className="badge_confirmed st_badge">
                              {message.status}
                            </div>
                          ) : message.status == "En attente" ? (
                            <div className="badge_waiting st_badge">
                              {message.status}
                            </div>
                          ) : (
                            <div className="badge_cancled st_badge">
                              {message.status}
                            </div>
                          )}
                        </div>

                        <div className="table_nav_item medium_width special_css">
                          {message.status == "En attente" ? (
                            <div className="action_delete">
                              <IconButton aria-label="add-person">
                                <DeleteOutlineIcon
                                  style={{ color: "red" }}
                                  onClick={() => ignoreMessage(message)}
                                />
                              </IconButton>
                            </div>
                          ) : (
                            ""
                          )}

                          <div className="action_messages">
                            <IconButton aria-label="add-person">
                              <VisibilityIcon
                                onClick={() => {
                                  doSomething("");
                                  setMessage(message);
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
                      Aucun message trouvé
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
