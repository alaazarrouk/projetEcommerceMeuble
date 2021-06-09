import React, { useEffect, useState } from "react";
import "./NavBar.css";
import logo from "./assets/MainLogo1.png";
import { HashLink as Link } from "react-router-hash-link";
import ShoppingCartOutlinedIcon from "@material-ui/icons/ShoppingCartOutlined";
import SettingsIcon from "@material-ui/icons/Settings";
import IconButton from "@material-ui/core/IconButton";
import PersonIcon from "@material-ui/icons/Person";
import { useHistory } from "react-router-dom";
import ShoppingBasketIcon from "@material-ui/icons/ShoppingBasket";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import { useStateValue } from "./StateProvider";

const NavBar = ({ isLoggedIn, onChange }) => {
  const [{ user, basket }, dispatch] = useStateValue();
  const [nbBasketProducts, setNbBasketProducts] = useState("");
  console.log("basket", basket);

  const countBasketItems = () => {
    var nbItems = 0;
    for (var i = 0; i < basket.length; i++) {
      nbItems = nbItems + basket[i].quantity;
    }
    return nbItems;
  };

  useEffect(() => {
    setNbBasketProducts(countBasketItems);
  }, [basket]);

  const history = useHistory();
  const [click, setClick] = useState(0);
  const handleSettings = () => {
    setClick(click + 1);
    if (click % 2 == 0) {
      document.querySelector(".drop_box_settings").style.display = "none";
      document.querySelector(".drop_box_settings").style.position = "uset";
    } else {
      console.log("im not in pair");
      document.querySelector(".drop_box_settings").style.display = "block";
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    dispatch({
      type: "EMPTY_BASKET",
    });
    onChange(false);
    history.replace("/home");
  };

  return (
    <div className="NavBar">
      <div className="info_banner">Black lives matter</div>
      <div className="navbar">
        <div className="logo">
          <img src={logo} alt="dfd" />
        </div>
        {isLoggedIn ? (
          user ? (
            user.type == "User" ? (
              <div className="center_items">
                <ul>
                  <Link to="/#banner">
                    <li>
                      <a>Accueil</a>
                    </li>
                  </Link>
                  <Link to="/#categories">
                    <li>
                      <a>Nos Produits</a>
                    </li>
                  </Link>
                  <Link to="/#contact">
                    <li>
                      <a>Contact</a>
                    </li>
                  </Link>
                </ul>
              </div>
            ) : (
              <div className="center_items">
                <ul>
                  <Link to="/admin">
                    <li>
                      <a>Accueil</a>
                    </li>
                  </Link>
                  <Link to="/admin-clients">
                    <li>
                      <a>Clients</a>
                    </li>
                  </Link>
                  <Link to="/admin-products">
                    <li>
                      <a>Produits</a>
                    </li>
                  </Link>
                  <Link to="/admin-orders">
                    <li>
                      <a>Commandes</a>
                    </li>
                  </Link>
                  <Link to="/admin-messages">
                    <li>
                      <a>Messages</a>
                    </li>
                  </Link>
                </ul>
              </div>
            )
          ) : (
            ""
          )
        ) : (
          <div className="center_items">
            <ul>
              <Link to="/#banner">
                <li>
                  <a>Accueil</a>
                </li>
              </Link>
              <Link to="/#categories">
                <li>
                  <a>Nos Produits</a>
                </li>
              </Link>
              <Link to="/#contact">
                <li>
                  <a>Contact</a>
                </li>
              </Link>
            </ul>
          </div>
        )}

        <div className="right_items">
          {isLoggedIn ? (
            user ? (
              user.type == "User" ? (
                <div className="loggedIn_items">
                  <div className="user_nav_info">
                    Bonjour,
                    <span class="user_nav_info_name">
                      {" " + user.firstName + " " + user.lastName}
                    </span>
                  </div>
                  <div className="user_nav_basket">
                    <IconButton>
                      <ShoppingCartOutlinedIcon
                        onClick={() => history.push("/basket")}
                      />
                    </IconButton>

                    <div className="basket_nb_items">{nbBasketProducts}</div>
                  </div>
                  <div className="user_nav_parameters ">
                    <IconButton>
                      <SettingsIcon onClick={handleSettings} />
                    </IconButton>
                  </div>
                  <div class="drop_box_settings">
                    <div className="settings_container">
                      <Link to="/user-infos">
                        <div className="setting_item">
                          <div className="setting_logo">
                            <PersonIcon className="icon" />
                          </div>
                          <div className="setting_text">Votre Compte</div>
                        </div>
                      </Link>
                      <Link to="/orders">
                        <div className="setting_item">
                          <div className="setting_logo">
                            <ShoppingBasketIcon className="icon" />
                          </div>
                          <div className="setting_text">Vos Commandes</div>
                        </div>
                      </Link>

                      <div className="setting_item  " onClick={logout}>
                        <div className="setting_logo">
                          <PowerSettingsNewIcon className="icon" />
                        </div>
                        <div className="setting_text">Déconnexion</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="loggedIn_items">
                  <div className="user_nav_info">
                    Bonjour,
                    <span class="user_nav_info_name">
                      {" " + user.firstName + " " + user.lastName}
                    </span>
                  </div>
                  <div className="logOut_nav_choice">
                    <IconButton>
                      <PowerSettingsNewIcon className="icon" onClick={logout} />
                    </IconButton>
                  </div>
                </div>
              )
            ) : (
              ""
            )
          ) : (
            <div>
              <Link to="/login">
                <button className="login_button"> Log-in</button>
              </Link>
              <Link to="/register">
                <button className="signup_button"> Sign-up</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
