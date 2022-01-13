import HttpService from "./HttpService";

class AuthService {
    //login
    async login(credentials){
        return await HttpService.doPost("/auth/login", credentials);
    }
    //register
    async register(data){
        return await HttpService.doPost("/auth/register", data);
    }
    //request password change
    async pwd(email){
        return await HttpService.doPost(`/auth/pwd?email=${email}`, {
            "email":email
        });
    }
    //change password
    async changePassword(data) {
        return await HttpService.doPost('/auth/changepwd',data);
    }

    //logout
    async logout(){
        return await HttpService.doPost("/auth/logout",null);
    }
    setToken(token){
        localStorage.setItem("_apams", JSON.stringify(token));
    }
    getTokenData(){
        let tokenData = localStorage.getItem("_apams");
        return JSON.parse(tokenData);
    }
    getToken(){
        return this.getTokenData()?.token;
    }
    getUserEmail(){
        return this.getTokenData()?.email
    }
    getUserRole(){
        return this.getTokenData()?.role;
    }

}

export default new AuthService();
