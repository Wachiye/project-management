import HttpService from "./HttpService";

class StudentService {
  //get all students
  async getAll() {
    return await HttpService.doGet("/students");
  }
  //get a single students
  async getOneById(id) {
    return await HttpService.doGet(`/students/${id}`);
  }
  //register student
  async register(data) {
    return await HttpService.doPost("/students/register", data);
  }
  //update  student
  async update(studentId, data) {
    return await HttpService.doPut(`/students/${studentId}`, data);
  }
  //get student projects
  async getProjects(studentId) {
    return await HttpService.doGet(`/students/${studentId}/projects`);
  }
  //get files
  async getFiles(studentId) {
    return await HttpService.doGet(`/students/${studentId}/files`);
  }
  // get comments
  async getComments(studentId) {
    return await HttpService.doGet(`/students/${studentId}/comments`);
  }
  //delete student
  async delete(studentId) {
    return await HttpService.doDelete(`/students/${studentId}`);
  }
  //delete all students
  async deleteAll() {
    return await HttpService.doDelete("/students/");
  }
}

export default new StudentService();
