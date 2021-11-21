import HttpService from "./HttpService";

class UserService{
    //get all user
    async getAll(){
        return await HttpService.doGet("/user");
    }
    //get a single user
    async getOneById(id){
        return await HttpService.doGet(`/user/${id}`);
    }
    //save user
    async save(data){
        return await HttpService.doPost(`/user`, data);
    }
    //update  user
    async update(userId, data){
        return await HttpService.doPut(`/user/${userId}`, data);
    }
    //get user projects
    async getProjects(userId){
        return await HttpService.doGet(`/user/${userId}/projects`);
    }
    //get files
    async getFiles(userId){
        return await HttpService.doGet(`/user/${userId}/files`);
    }
    // get comments
    async getComments(userId){
        return await HttpService.doGet(`/user/${userId}/comments`);
    }
    //delete user
    async delete(userId){
        return await HttpService.doDelete(`/user/${userId}`);
    }
    //delete all user
    async deleteAll(){
        return await HttpService.doDelete(`/user/`);
    }

}

export default new UserService();
