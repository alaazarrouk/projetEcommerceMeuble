import React, { useEffect, useState } from "react";
import "./Infos.css";
import Meuble from "../assets/meuble.png";
import IconButton from "@material-ui/core/IconButton";
import BorderColorSharpIcon from "@material-ui/icons/BorderColorSharp";
import PopUpUpdateUser from "./PopUpUpdateUser";
import { AnimatePresence, motion } from "framer-motion";
import { useStateValue } from "../StateProvider";

const Infos = () => {
  const [{ user }, dispatch] = useStateValue();
  const [refresh, setRefresh] = useState(false);

  const doSomething1 = () => {
    document.body.style.overflow = "auto";
    document.querySelector(".bg-modal-modify").style.display = "none";
    document.querySelector(".bg-modal-modify").style.position = "uset";
  };

  const doSomething = () => {
    document.documentElement.scrollTop = 0;
    document.body.style.overflow = "hidden";
    document.querySelector(".bg-modal-modify").style.display = "flex";
    document.querySelector(".bg-modal-modify").style.position = "absolute";
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="Infos"
    >
      <div className="Infos_banner">
        <div className="Infos_title">
          <h1>Utilisateur Infos</h1>
        </div>
        <img src={Meuble} alt="" />
      </div>
      <div class="bg-modal-modify">
        <div class="modal-contents-modify">
          <div class="close" onClick={() => doSomething1("Modify")}>
            x
          </div>
          <PopUpUpdateUser
            refresh={refresh}
            onChange={(value) => {
              dispatch({
                type: "SET_USER",
                user: value,
              });
            }}
            userInfo={user}
            controller="User"
          />
        </div>
      </div>
      <div className="Infos_container">
        <div className="Infos_container_left_items">
          <div className="Infos_container_title">
            <div className="Infos_container_title_text">
              Vos Informations Personnel :
            </div>
            <div className="icon">
              <IconButton>
                <BorderColorSharpIcon
                  onClick={() => {
                    doSomething();
                  }}
                />
              </IconButton>
            </div>
          </div>
          <div className="Infos_container_address">
            <div className="Infos_right_items">Nom et Prénom</div>
            <div className="Infos_left_items">
              <div className="Infos_info_delivery">
                <div className="Infos_infos_title">Nom :</div>
                <div className="Infos_infos_text">
                  {" "}
                  {user ? user.lastName : ""}
                </div>
              </div>
              <div className="Infos_info_delivery">
                <div className="Infos_infos_title">Prénom :</div>
                <div className="Infos_infos_text">
                  {user ? user.firstName : ""}
                </div>
              </div>
            </div>
          </div>
          <div className="Infos_container_address">
            <div className="Infos_right_items">Adresse et ville</div>
            <div className="Infos_left_items">
              <div className="Infos_info_delivery">
                <div className="Infos_infos_title">Addresse :</div>
                <div className="Infos_infos_text">
                  {user ? user.address : ""}
                </div>
              </div>

              <div className="Infos_info_delivery">
                <div className="Infos_infos_title">Ville :</div>
                <div className="Infos_infos_text">{user ? user.state : ""}</div>
              </div>
            </div>
          </div>
          <div className="Infos_container_address">
            <div className="Infos_right_items">Adresse Email et Téléphone</div>
            <div className="Infos_left_items">
              <div className="Infos_info_delivery">
                <div className="Infos_infos_title">Adresse Email :</div>
                <div className="Infos_infos_text">{user ? user.email : ""}</div>
              </div>
              <div className="Infos_info_delivery">
                <div className="Infos_infos_title">Téléphone :</div>
                <div className="Infos_infos_text">
                  (+216) {user ? user.phone : ""}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Infos;
