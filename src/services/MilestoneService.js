import HttpService from "./HttpService";

class MilestoneService {
    //get all milestones
    async getAll(){
        return await HttpService.doGet("/milestones");
    }
    //get a single milestones
    async getOneById(id){
        return await HttpService.doGet(`/milestones/${id}`);
    }
    //get milestone by status
    async getAllByStatus(status){
        return await  HttpService.doGet(`/milestones/status/${status}`);
    }
    //save milestone
    async save(data){
        return await HttpService.doPost(`/milestones`, data);
    }
    //update  milestone
    async update(milestoneId, data){
        return await HttpService.doPut(`/milestones/${milestoneId}`, data);
    }
    //change milestone status
    async setStatus(milestoneId, status){
        return await HttpService.doPut(`/milestones/${milestoneId}/${status}`, null);
    }
    //get tasks
    async getTasks(milestoneId){
        return await HttpService.doGet(`/milestones/${milestoneId}/tasks`);
    }
    //delete milestone
    async delete(milestoneId){
        return await HttpService.doDelete(`/milestones/${milestoneId}`);
    }
    //delete all milestones
    async deleteAll(){
        return await HttpService.doDelete(`/milestones/`);
    }
}

export default  new MilestoneService();