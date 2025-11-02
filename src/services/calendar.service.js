import axios from "axios";
import {environment} from "@/environment/environment.js";
import {UserService} from "@/services/user.service.js";

class CalendarService {
    baseUrl = ""
    userService = null;
    constructor() {
        this.userService = new UserService();
        this.baseUrl = environment.baseUrl;
    }

    async getEventsCalendar(projectId) {
        let response = null;

        try {
            const headers = this.userService.getHeadersAuthorization();
            response = await axios.get(`${this.baseUrl}/events/${projectId}`, { headers });
        }catch(e) {
            console.error('Error to obtain the events calendar', e)
        }

        return response;
    }

    async saveNewEvent(event) {
        let response = null;

        try {
            console.log('event save:', event)
            const headers = this.userService.getHeadersAuthorization();
            response = await axios.post(`${this.baseUrl}/events`, event, { headers });
        }catch(e){
            console.error('Error to save the event', e)
        }
        return response;
    }

    async deleteEvent(id) {
        let response = null;

        try {
            const headers = this.userService.getHeadersAuthorization();
            response = await axios.delete(`${this.baseUrl}/events/${id}`, { headers });
        }catch(e) {
            console.error('Error to delete the event', id, e);
        }

        return response;
    }

    async editEvent(id, eventModified) {
        let response = null;

        try {
            const headers = this.userService.getHeadersAuthorization();
            response = await axios.put(`${this.baseUrl}/events/${id}`,  eventModified, { headers });
        }catch(e) {
            console.error('Error to edit the event', id, e);
        }

        return response;
    }
}

export default CalendarService