import HttpService from "./HttpService";

class GuideService{
    //get all guides
    async getAll(){
        return await HttpService.doGet("/guides");
    }

    //get a single guide
    async getOneById(guideId){
        return await HttpService.doGet(`/guides/${guideId}`);
    }
    //save guide
    async postGuide(data){
        return await HttpService.doPost(`/guides`, data);
    }
    //save guide
    async updateGuide(guideId, data){
        return await HttpService.doPost(`/guides/${guideId}`, data);
    }

    //delete guide
    async delete(guideId){
        return await HttpService.doDelete(`/guides/${guideId}`);
    }
    //delete all guide
    async deleteAll(){
        return await HttpService.doDelete(`/guides/`);
    }

}

export default new GuideService();
