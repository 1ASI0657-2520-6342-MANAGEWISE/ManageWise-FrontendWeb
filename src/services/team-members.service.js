// src/services/team-members.service.js
import axios from "axios";
import { environment } from "@/environment/environment.js";
import { UserService } from "@/services/user.service.js";

class TeamMembersService {
    constructor() {
        this.userService = new UserService();
        this.baseUrl = environment.baseUrl; // p.ej. http://localhost:7000
    }


    async getMembers(companyId) {
        if (!companyId) {
            console.warn("getMembers llamado sin companyId, devolviendo []");
            return [];
        }

        try {
            const headers = this.userService.getHeadersAuthorization();

            const response = await axios.get(
                this.baseUrl + "/profiles/api/Profiles",
                {
                    headers: headers,
                    params: { companyId: companyId }
                }
            );

            console.log("TeamMembers Response", response.data);
            return response.data;
        } catch (e) {
            console.error("Error to obtain the team members", e);
            return [];
        }
    }


    async newMessage(body) {
        console.warn(
            "newMessage aún no está implementado en la arquitectura de microservicios",
            body
        );
        return null;
    }


    async kickMember(idUser) {
        if (!idUser) {
            console.warn("kickMember llamado sin idUser");
            return null;
        }

        try {
            const headers = this.userService.getHeadersAuthorization();

            const response = await axios.delete(
                this.baseUrl + "/profiles/api/Profiles/kick/" + idUser,
                { headers: headers }
            );

            console.log("KickMember Response", response.data);
            return response.data;
        } catch (e) {
            console.error("Error to kick the member", e);
            return null;
        }
    }
}

export default TeamMembersService;