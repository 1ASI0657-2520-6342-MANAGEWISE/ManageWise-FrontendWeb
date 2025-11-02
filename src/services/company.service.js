import axios from "axios";
import {environment} from "@/environment/environment.js";
import {UserService} from "@/services/user.service.js";

export class CompanyService {
    userService = null;
    constructor() {
        this.userService = new UserService();
        this.http = axios.create({
            baseURL: environment.baseUrl
        })
    }

    async getAllCompanies() {
        try {
            return await this.http.get('companies');
        } catch (error) {
            console.error('Error al obtener todos los usuarios:', error);
            throw error;
        }
    }

    async createCompany(companyData) {
        try {
            const headers = this.userService.getHeadersAuthorization();
            return await this.http.post('company', companyData, {headers});
        } catch (error) {
            console.error('Error al crear la compañía:', error);
            throw error;
        }
    }

    async getCompanyByUID( uid ) {
        try {
            const headers = this.userService.getHeadersAuthorization();
            return await this.http.get(`company/${uid}`, {headers});
        } catch (error) {
            console.error(`Error al obtener la compañía con id ${uid}:`, error);
            throw error;
        }
    }

    async editCompanyId( idUser, companyId) {
        try {
            const headers = this.userService.getHeadersAuthorization();
            return await this.http.put(`users/${idUser}?companyId=${companyId}`, {}, {headers});
        } catch (error) {
            console.error(`Error al editar el id de la compañía del usuario ${idUser}:`, error);
            throw error;
        }
    }

    async editUserCompanyName(userItem) {
        try {
            const headers = this.userService.getHeadersAuthorization();
            return await this.http.patch(`users/company-name`, userItem, {headers});
        } catch (error) {
            console.error(`Error al editar el nombre de la compañía del usuario ${user.id}:`, error);
            throw error;
        }
    }

}