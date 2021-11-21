import HttpService from "./HttpService";

class ProjectService{
    //get all projects
    async getAll(){
        return await HttpService.doGet("/projects");
    }
    //get a single projects
    async getOneById(id){
        return await HttpService.doGet(`/projects/${id}`);
    }
    //get projects by category
    async getAllByCategory(category){
        return await HttpService.doGet(`/projects/category/${category}`);
    }
    //get project by status
    async getAllByStatus(status){
        return await  HttpService.doGet(`/projects/status/${status}`);
    }
    //save project
    async save(data){
        return await HttpService.doPost(`/projects`, data);
    }
    //update  project
    async update(projectId, data){
        return await HttpService.doPut(`/projects/${projectId}`, data);
    }
    //change project status
    async setStatus(projectId, status){
        return await HttpService.doPut(`/projects/${projectId}/${status}`, null);
    }
    //get project milestones
    async getMilestones(projectId){
        return await HttpService.doGet(`/projects/${projectId}/milestones`);
    }
    //get files
    async getFiles(projectId){
        return await HttpService.doGet(`/projects/${projectId}/files`);
    }
    // get comments
    async getComments(projectId){
        return await HttpService.doGet(`/projects/${projectId}/comments`);
    }
    //delete project
    async delete(projectId){
        return await HttpService.doDelete(`/projects/${projectId}`);
    }
    //delete all projects
    async deleteAll(){
        return await HttpService.doDelete(`/projects/`);
    }

}

export default new ProjectService();
