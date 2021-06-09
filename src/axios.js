import axios from "axios";

const instance = axios.create({
  baseURL: "https://projetecommercebackend.herokuapp.com/",
  //https://projetecommercebackend.herokuapp.com/
});

export default instance;
