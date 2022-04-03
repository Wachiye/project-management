import HttpService from "./HttpService";

class CommentService {
  //get all comments
  async getAll() {
    return await HttpService.doGet("/comments");
  }
  //get a single comment
  async getOneById(id) {
    return await HttpService.doGet(`/comments/${id}`);
  }
  //save comment
  async save(data) {
    return await HttpService.doPost("/comments", data);
  }
  //get comments by type
  async getAllByType(type) {
    return await HttpService.doGet(`/comments/type/${type}`);
  }
  //delete comment
  async delete(commentId) {
    return await HttpService.doDelete(`/comments/${commentId}`);
  }
  //delete all comment
  async deleteAll() {
    return await HttpService.doDelete("/comments/");
  }
}

export default new CommentService();
