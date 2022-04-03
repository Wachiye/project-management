import HttpService from "./HttpService";

class FileService {
  //get all file
  async getAll() {
    return await HttpService.doGet("/files");
  }
  //get a single file
  async getOneById(id) {
    return await HttpService.doGet(`/files/${id}`);
  }
  //upload file
  async upload(data) {
    return await HttpService.doPost("/files", data);
  }
  //update  file
  async update(fileId, data) {
    return await HttpService.doPut(`/files/${fileId}`, data);
  }
  //change file status
  async setStatus(fileId, status) {
    return await HttpService.doPut(`/files/${fileId}/status/${status}`, null);
  }

  // get comments
  async getComments(fileId) {
    return await HttpService.doGet(`/files/${fileId}/comments`);
  }
  //delete file
  async delete(fileId) {
    return await HttpService.doDelete(`/files/${fileId}`);
  }
  //delete all file
  async deleteAll() {
    return await HttpService.doDelete("/files/");
  }
}

export default new FileService();
