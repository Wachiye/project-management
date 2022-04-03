import HttpService from "./HttpService";

class SettingService {
  //get all setting
  async getAll() {
    return await HttpService.doGet("/settings");
  }
  //get a single setting
  async getOneById(id) {
    return await HttpService.doGet(`/settings/${id}`);
  }
  //get settings by year
  async getAllByYear(year) {
    return await HttpService.doGet(`/settings/year/${year}`);
  }

  //save setting
  async save(data) {
    return await HttpService.doPost("/settings", data);
  }
  //update  setting
  async update(settingId, data) {
    return await HttpService.doPut(`/settings/${settingId}`, data);
  }

  //delete setting
  async delete(settingId) {
    return await HttpService.doDelete(`/settings/${settingId}`);
  }
  //delete all setting
  async deleteAll() {
    return await HttpService.doDelete("/settings/");
  }
}

export default new SettingService();
