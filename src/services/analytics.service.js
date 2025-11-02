import axios from "axios";
import {environment} from "@/environment/environment.js";
import {UserService} from "@/services/user.service.js";

export class AnalyticsService {

    http = null;
    userService = null;
    constructor() {
        this.userService = new UserService();
        this.http = axios.create({
            baseURL: environment.baseUrl
        })
    }

    async getAnalyticsByProjectId(projectId) {
        try {
            const headers = this.userService.getHeadersAuthorization();
            const response = await this.http.get(`projects/${projectId}/analytics`, {headers});
            console.log('Analytics response', response)
            return response;
        }catch(e) {
            console.log('Error to get analytics by project id')
            return null;
        }
    }

    async updatePaymentsChartByAnalyticsId(paymentsData) {
        try {
            const headers = this.userService.getHeadersAuthorization();
            return await this.http.patch(`analytics/payments`, paymentsData, {headers});
        }catch(e) {
            console.log('Error to update payments chart by analytics id')
            return null;
        }
    }

    async updateLinesChartByAnalyticsId(linesData) {
        try {
            const headers = this.userService.getHeadersAuthorization();
            return await this.http.patch(`analytics/lines`, linesData, {headers});
        }catch(e) {
            console.log('Error to update sales chart by analytics id')
            return null;
        }
    }

    // for tasks
    async updateTasksChartByAnalyticsId(tasksData) {
        try {
            const headers = this.userService.getHeadersAuthorization();
            return await this.http.patch(`analytics/tasks`, tasksData, {headers});
        }catch(e) {
            console.log('Error to update tasks chart by analytics id')
            return null;
        }
    }

    // for progressbar
    async updateProgressChartByAnalyticsId(progressData) {
        try {
            const headers = this.userService.getHeadersAuthorization();
            return await this.http.patch(`analytics/progressbar`, progressData, {headers});
        }catch(e) {
            console.log('Error to update progress chart by analytics id')
            return null;
        }
    }

    // for status
    async updateStatusChartByAnalyticsId(statusData) {
        try {
            const headers = this.userService.getHeadersAuthorization();
            return await this.http.patch(`analytics/status`, statusData, {headers});
        }catch(e) {
            console.log('Error to update status chart by analytics id')
            return null;
        }
    }

}