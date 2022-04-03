import HttpService from "./HttpService";

class NotificationService {
  //get all notifications
  async getAll() {
    return await HttpService.doGet("/notifications");
  }
  //get a single notification
  async getOneById(id) {
    return await HttpService.doGet(`/notifications/${id}`);
  }
  //save notification
  async save(data) {
    return await HttpService.doPost("/notifications", data);
  }
  //get notifications by type
  async getAllByType(type) {
    return await HttpService.doGet(`/notifications/type/${type}`);
  }
  //delete notification
  async delete(notificationId) {
    return await HttpService.doDelete(`/notifications/${notificationId}`);
  }
  //delete all notification
  async deleteAll() {
    return await HttpService.doDelete("/notifications/");
  }
}

export default new NotificationService();
