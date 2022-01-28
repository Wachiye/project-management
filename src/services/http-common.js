import axios from "axios";
import { REACT_APP_API_URL } from "../config/env";

const baseURL = REACT_APP_API_URL;

const token = JSON.parse(localStorage.getItem("_apams"))?.token;

const Http = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-type": "application/json",
    Authorization: !token ? null :`Bearer ${token}`,
  },
});

Http.interceptors.response.use(
  (res) => {
    if (res.status === 204) {
      res = {
        data: {
          type: "danger",
          message: "Item deleted successfully",
        },
      };
    }

    return res;
  },
  (err) => {
    console.log({ err });
    if (err.response) {
      return {
        error: {
          message: err.response.data.message,
          status: err.response.data.status,
          type: "danger",
        },
      };
    }

    if (err.request) {
      return {
        error: {
          code: 500,
          name: "connection_err",
          title: "SERVER_CONNECTION_ERROR",
          type: "danger",
          message:
            "Sorry, but could not connect to the server. Try again later.",
        },
      };
    }
  }
);

export default Http;
