import axios from "axios";
import {environment} from "@/environment/environment.js";
import {UserService} from "@/services/user.service.js";

export class PaymentDetailsService {
    userService = null;

    constructor() {
        this.userService = new UserService();
        this.http = axios.create({
            baseURL: environment.baseUrl
        })
    }
    async savePaymentDetails(paymentDetails) {
        const headers = this.userService.getHeadersAuthorization();
        return await this.http.post("payment-detail", paymentDetails, {headers});
    }

}