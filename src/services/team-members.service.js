import axios from "axios";
import {environment} from "@/environment/environment.js";
import {UserService} from "@/services/user.service.js";

class TeamMembersService {
    baseUrl = ""
    userService = null;
    constructor(){
        this.userService = new UserService();
        this.baseUrl = environment.baseUrl;
    }

    async getMembers(companyId) {
        let response = null
        try {
            const headers = this.userService.getHeadersAuthorization();
            response = await axios.get(`${this.baseUrl}/users/${companyId}`, { headers });
            console.log('TeamMembers Response', response)
        }catch(e) {
            console.error('Error to obtain the team members', e);
        }
        return response;
    }

    async newMessage(body) {
        let response = null
        try {
            const headers = this.userService.getHeadersAuthorization();
            response = await axios.post(`${this.baseUrl}/users/messages`, body, { headers });
        }catch(e) {
            console.error('Error to send the message', e);
        }
        return response;
    }

    async kickMember(idUser) {
        let response = null;
        try {
            const headers = this.userService.getHeadersAuthorization();
            response = await axios.put(`${this.baseUrl}/users/kick-member/${idUser}`, {}, { headers });
        } catch(e) {
            console.error('Error to kick the member', e);
        }

        return response;
    }
}

export default TeamMembersService;