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
            const signUpPayload = {
                ...user,
                Username: user.email
            };
            console.log('Sending user object to IAM (Step 1):', signUpPayload);
            const iamResponse = await this.http.post('users/sign-up', signUpPayload);

            const profilePayload = {
                FirstName: user.firstName,
                LastName: user.lastName,
                Age: user.age,
                Email: user.email,
                Phone: user.phone,
                Password: user.password,
                ProfileImg: user.profileImg,
                Role: user.role,
                CompanyName: user.companyName,
                CompanyEmail: user.companyEmail,
                CompanyCountry: user.companyCountry,
                TeamRegisterCode: user.teamRegisterCode,
                Occupation: user.occupation || "",
                Bio: user.bio || ""
            };

            console.log('Sending profile details to Profiles (Step 2):', profilePayload);

            await this.http.post('profiles/api/Profiles', profilePayload);

            console.log('Registration success. IAM Response:', iamResponse);
            return iamResponse;
        } catch(e) {
            if (e.response) {
                console.error('Backend Error:', e.response.data);
            }
            return null;
        }
    }

    async signInUser(username, password, captchaToken) {
        try {
            const signInPayload = {
                Username: username,
                password: password,
                captchaToken: captchaToken,
                email: username
            };

            console.log('Sending sign-in payload to IAM:', signInPayload);

            const response = await this.http.post('authentication/sign-in', signInPayload);

            if (response.data && response.data.username) {
                console.log("Login exitoso en IAM. Buscando perfil completo...");
                try {
                    await this.getUserByEmail(response.data.username);
                } catch (profileError) {
                    console.error("No se pudo cargar el perfil del usuario:", profileError);
                }
            }

            return response;
        } catch (e) {
            if (e.response) {
                console.error('Backend 400 Sign-In Response Data (Validation Errors):', e.response.data);
                console.error('Backend Status:', e.response.status);
            }
            return e;
        }
    }


    async getUserByEmail(email) {
        const headers = this.getHeadersAuthorization();
        try {
            const response = await this.http.get(`profiles/api/Profiles/email/${email}`, { headers });

            console.log('Perfil recuperado por Email:', response.data);

            this.setUser(response.data);

            return response;
        } catch (error) {
            console.error(`Error al obtener usuario por email ${email}:`, error);
            throw error;
        }
    }

    async getUserById(id) {
        const headers = this.getHeadersAuthorization();
        console.log('user id to retrieve', id);
        try {
            const response = await this.http.get(`profiles/api/Profiles/${id}`, { headers });

            if (response.data) {
                response.data.companyName = response.data.companyName
                    || response.data.CompanyName
                    || response.data.company_name
                    || "";

                response.data.companyEmail = response.data.companyEmail
                    || response.data.CompanyEmail
                    || "";

                response.data.occupation = response.data.occupation || response.data.Occupation || "";
                response.data.bio = response.data.bio || response.data.Bio || "";
            }

            console.log('Profile response:', response);
            return response;
        } catch (error) {
            if (error.response) {
                console.error(`Error ${error.response.status} al obtener el usuario con id ${id}:`, error.response.data);
            } else {
                console.error(`Error de red al obtener el usuario con id ${id}:`, error.message);
            }
            throw error;
        }
    }

    async updateUser(user) {
        const headers = this.getHeadersAuthorization();

        const safeName = (user.name ?? `${user.firstName ?? ''} ${user.lastName ?? ''}`).trim();
        const parts = safeName.split(/\s+/);
        const firstName = user.firstName ?? (parts[0] || '');
        const lastName  = user.lastName  ?? (parts.slice(1).join(' ') || '');

        const userbody = {
            userId: user.id,
            firstName,
            lastName,
            age: user.age,
            phone: user.phone,
            email: user.email,
            password: user.password,
            profileImg: user.profileImg,
            occupation: user.occupation,
            bio: user.bio,
        };

        const resp = await this.http.put(`profiles/api/Profiles/${user.id}`, userbody, { headers });

        this.setUser(resp.data);

        return resp.data;
    }

    async getAllUsers() {
        try {
            const headers = this.getHeadersAuthorization();
            const response = await this.http.get('users/', { headers });
            return response;
        } catch (error) {
            console.error('Error al obtener todos los usuarios:', error);
            throw error;
        }
    }

    async getUsersByRole(role) {
        try {
            const response = await this.http.get(`users?role=${role}`);
            return response;
        } catch (error) {
            console.error(`Error al obtener usuarios con el rol ${role}:`, error);
            throw error;
        }
    }

    async createNewUser(user) {
        try {
            const headers = this.getHeadersAuthorization();
            console.log('user to create', user)
            return await this.http.post('users/', user, { headers });
        } catch (error) {
            console.error('Error al crear un nuevo usuario:', error);
            throw error;
        }
    }

    async updateUserByEmail(email, body) {
        const newBody = { ...body }; // Simplificado
        try {
            const headers = this.getHeadersAuthorization();
            const response = await this.http.put(`users?email=${email}`, newBody, { headers });
            return response;
        } catch(e) {
            console.log('Error to update user')
            return null;
        }
    }


    getHeadersAuthorization() {
        const token = localStorage.getItem('token');
        return {
            "Authorization": token ? `Bearer ${token}` : '',
            "Content-Type": "application/json"
        }
    }

    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));

    }
}