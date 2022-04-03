import Http from "./http-common";

class HttpService {
  async doGet(URL) {
    let response = null;
    await Http.get(URL)
      .then((res) => {
        response = res;
      })
      .catch((err) => {
        console.log({ err });
      });
    return response;
  }

  async doPost(URL, data) {
    let response = null;

    await Http.post(URL, data)
      .then((res) => {
        response = res;
      })
      .catch((err) => {
        console.log({ err });
      });
    return response;
  }

  async doPut(URL, data) {
    let response = null;
    await Http.put(URL, data)
      .then((res) => {
        response = res;
      })
      .catch((err) => {
        console.log({ err });
      });
    return response;
  }

  async doDelete(URL) {
    let response = null;
    await Http.delete(URL)
      .then((res) => {
        response = res;
      })
      .catch((err) => {
        console.log({ err });
      });
    return response;
  }
}

export default new HttpService();
