import HttpService from "./HttpService";

class UserService {
  //get all user
  async getAll() {
    return await HttpService.doGet("/users");
  }
  //get a single user
  async getOneById(id) {
    return await HttpService.doGet(`/users/${id}`);
  }
  //get a single user
  async getOneByEmail(email) {
    return await HttpService.doGet(`/users/${email}`);
  }
  //save user
  async save(data) {
    return await HttpService.doPost("/users", data);
  }
  //update  user
  async update(userId, data) {
    return await HttpService.doPut(`/users/${userId}`, data);
  }
  //get user projects
  async getProjects(userId) {
    return await HttpService.doGet(`/users/${userId}/projects`);
  }
  //get files
  async getFiles(userId) {
    return await HttpService.doGet(`/users/${userId}/files`);
  }
  // get comments
  async getComments(userId) {
    return await HttpService.doGet(`/users/${userId}/comments`);
  }
  //delete user
  async delete(userId) {
    return await HttpService.doDelete(`/users/${userId}`);
  }
  //delete all user
  async deleteAll() {
    return await HttpService.doDelete("/users/");
  }
}

export default new UserService();
