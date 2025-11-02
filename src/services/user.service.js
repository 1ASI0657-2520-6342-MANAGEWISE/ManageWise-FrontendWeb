import axios from "axios";
import {environment} from "@/environment/environment.js";

export class UserService {

    http = null;
    constructor() {
        this.http = axios.create({
            baseURL: environment.baseUrl
        })
    }

    async signUpUser(user) {
        try {
            const response = await this.http.post('users/sign-up',user);
            console.log('response', response)
            return response;
        }catch(e) {
            console.log('Error to sign up user', e)
            return null;
        }
    }

    async signInUser(username, password) {
        try {
            return await this.http.post('authentication/sign-in', {
                email: username,
                password: password
            })
        }catch(e) {
            return e;
        }

    }

    async getAllUsers() {
        try {
            const headers = this.getHeadersAuthorization();
            const response = await this.http.get('users', { headers });
            return response;
        } catch (error) {
            console.error('Error al obtener todos los usuarios:', error);
            throw error;
        }
    }

    async getCompanyInformationByCode(identificationCode) {
        try {
            // Obtenemos la información de la compañía usando el identificationCode
            const companyResponse = await this.http.get(`companies/?identificationCode=${identificationCode}`);
            return companyResponse.data[0]; // como es un array, obtenemos el objeto que es unico
        } catch (error) {
            console.error(`Error al obtener la información de la compañía con el código de identificación ${identificationCode}:`, error);
            throw error;
        }
    }

    async getUserById( id ){
        const headers = this.getHeadersAuthorization();
        console.log('headers', headers)
        console.log('user id to retrieve', id)
        try {
            const response = await this.http.get(`users/user/${id}`, { headers });
            console.log('response', response)
            return response;
        } catch (error) {
            console.error(`Error al obtener el usuario con id ${id}:`, error);
            throw error;
        }
    }

    // obtener usuarios registrados por role de Team o Director
    async getUsersByRole( role ) {
        try {
            const response = await this.http.get(`users/?role=${role}`);
            return response;
        } catch (error) {
            console.error(`Error al obtener usuarios con el rol ${role}:`, error);
            throw error;
        }
    }

    async createNewUser( user ) {
        try {
            const headers = this.getHeadersAuthorization();
            console.log('user to create', user)
            return await this.http.post('users', user, { headers });
        } catch (error) {
            console.error('Error al crear un nuevo usuario:', error);
            throw error;
        }
    }

    async updateUser(user) {
        try {
            const headers = this.getHeadersAuthorization();
            console.log('user to update', user)

            const parts = user.name.trim().split(' ');

            // Primer nombre es el primer elemento
            const firstName = parts[0] || '';

            // Segundo nombre será el resto de la cadena después del primer nombre (si hay más)
            const lastName = parts.slice(1).join(' ') || '';

            const userbody = {
                firstName: firstName,
                lastName: lastName,
                age: user.age,
                phone: user.phone,
                email: user.email,
                password: user.password,
                profileImg: user.profileImg,
            }
            console.log('userbody', userbody)
            const response = await this.http.put(`users/${user.id}`, userbody, { headers });
            return response.data;
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            throw error;
        }
    }

    async updateUserByEmail(email, body) {
        const newBody = {
            firstName: body.firstName,
            lastName: body.lastName,
            age: body.age,
            phone: body.phone,
            occupation: body.occupation,
            password: body.password,
            profileImg: body.profileImg,
            role: body.role,
            companyName: body.companyName,
            bio: body.bio,
            companyId: body.companyId,
        }

        try {
            const headers = this.getHeadersAuthorization();
            const response = await this.http.put(`users?email=${email}`, newBody, { headers });
            return response;
        }catch(e) {
            console.log('Error to update user')
            return null;
        }
    }

    getHeadersAuthorization() {
        return {
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
            "Content-Type": "application/json"
        }
    }
}