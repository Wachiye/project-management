import HttpService from "./HttpService";

class MessageService{
    //get all messages
    async getAll(){
        return await HttpService.doGet("/messages");
    }

    //get a single message
    async getOneById(id){
        return await HttpService.doGet(`/messages/${id}`);
    }
    //save message
    async sendMessage(data){
        return await HttpService.doPost(`/messages`, data);
    }
    //save message
    async sendReply(messageId, data){
        return await HttpService.doPost(`/messages/${messageId}/reply`, data);
    }
    
    //delete message
    async delete(messageId){
        return await HttpService.doDelete(`/messages/${messageId}`);
    }
    //delete all message
    async deleteAll(){
        return await HttpService.doDelete(`/messages/`);
    }

}

export default new MessageService();
