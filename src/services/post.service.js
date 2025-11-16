// services/post.service.js
import axios from "axios";
import { environment } from "@/environment/environment";
import { UserService } from "@/services/user.service.js";

export class PostApiService {
    http = null;
    userService = null;

    constructor() {
        this.userService = new UserService();
        this.http = axios.create({
            baseURL: environment.baseUrl, // ej.: http://localhost:8080/api/v1/
        });
    }

    getAuthHeaders() {
        // Debe devolver { Authorization: 'Bearer <token>' }
        return this.userService.getHeadersAuthorization?.() || {};
    }

    async getAllPostsByCompanyId(companyId, limit = 5) {
        try {
            const headers = this.userService.getHeadersAuthorization();
            const response = await this.http.get(`posts/company/${companyId}`, {
                headers,
                params: { limit }
            });
            return response.data; // <-- IMPORTANTE: devuelve el array
        } catch (error) {
            console.error(`Error fetching posts for ${companyId}:`, error);
            throw error;
        }
    }

    async createNewPost(userId, companyId, post) {
        try {
            const headersAuth = this.userService.getHeadersAuthorization();
            const headers = { ...headersAuth, 'Content-Type': 'application/json' };

            const payload = {
                title: post.title?.trim(),
                subject: post.subject?.trim(),
                description: post.description?.trim(),
                images: Array.isArray(post.images) ? post.images : [], // <- nunca null
                userId,
                companyId
            };

            return await this.http.post('posts', payload, { headers });
        } catch (error) {
            console.error('Error creating post', error?.response || error);
            throw error;
        }
    }

    async updatePostRating(postId, userId) {
        try {
            const headers = this.getAuthHeaders();
            const res = await this.http.patch(`posts/${postId}/rating/${userId}`, { postId, userId }, { headers });
            return res.data;
        } catch (error) {
            console.error("Error rating post", error);
            throw error;
        }
    }
}
