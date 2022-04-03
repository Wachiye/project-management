import HttpService from "./HttpService";

class StaffService {
  //get all staff
  async getAll() {
    return await HttpService.doGet("/staff");
  }
  //get a single staff
  async getOneById(id) {
    return await HttpService.doGet(`/staff/${id}`);
  }
  //register staff
  async register(data) {
    return await HttpService.doPost("/staff/register", data);
  }
  //update  staff
  async update(staffId, data) {
    return await HttpService.doPut(`/staff/${staffId}`, data);
  }
  //get staff projects
  async getProjects(staffId) {
    return await HttpService.doGet(`/staff/${staffId}/projects`);
  }
  //get files
  async getFiles(staffId) {
    return await HttpService.doGet(`/staff/${staffId}/files`);
  }
  // get comments
  async getComments(staffId) {
    return await HttpService.doGet(`/staff/${staffId}/comments`);
  }
  //delete staff
  async delete(staffId) {
    return await HttpService.doDelete(`/staff/${staffId}`);
  }
  //delete all staff
  async deleteAll() {
    return await HttpService.doDelete("/staff/");
  }
}

export default new StaffService();
