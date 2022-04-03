import HttpService from "./HttpService";

class TaskService {
  //get all tasks
  async getAll() {
    return await HttpService.doGet("/tasks");
  }
  //get a single tasks
  async getOneById(id) {
    return await HttpService.doGet(`/tasks/${id}`);
  }
  //get task by status
  async getAllByStatus(status) {
    return await HttpService.doGet(`/tasks/status/${status}`);
  }
  //save task
  async save(data) {
    return await HttpService.doPost("/tasks", data);
  }
  //update  task
  async update(taskId, data) {
    return await HttpService.doPut(`/tasks/${taskId}`, data);
  }
  //change task status
  async setStatus(taskId, status) {
    return await HttpService.doPut(`/tasks/${taskId}/status/${status}`, null);
  }

  //delete task
  async delete(taskId) {
    return await HttpService.doDelete(`/tasks/${taskId}`);
  }
  //delete all tasks
  async deleteAll() {
    return await HttpService.doDelete("/tasks/");
  }
}

export default new TaskService();
