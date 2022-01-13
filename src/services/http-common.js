import axios from "axios";

const baseURL = "http://localhost:8080/api/v1/";
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
          title: "Operation Successful",
          type: "success",
          message: "Operation was successful. No data returned",
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
          title: "Oops",
          type: "danger",
        },
      };
    }

    if (err.request) {
      return {
        error: {
          code: 500,
          name: "connection_err",
          title: "CONNECTION ERROR",
          type: "danger",
          message:
            "Sorry, but could not connect to the server. Try again later.",
        },
      };
    }
  }
);

export default Http;
