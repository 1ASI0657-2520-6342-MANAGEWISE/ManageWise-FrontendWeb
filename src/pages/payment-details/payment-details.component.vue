<script>
import { PaymentDetailsService } from "@/services/payment-details.service.js";
import { RegisterService } from "@/services/register.service.js";

export default {
  name: "payment-details-content",
  computed: {
  },
  data() {
    return {
      paymentService: new PaymentDetailsService(),
      registerService: new RegisterService(),
      isFieldsEmpty: false,
      areFieldsNotValid: false,
      paymentSuccess: false,
      isProcessing: false, // Estado de carga
      form: {
        userId: 0,
        cardHolderName: '',
        cardNumber: '',
        expirationDate: '',
        cvv: ''
      }
    }
  },
  mounted() {
    if (!localStorage.getItem('temp_register_data')) {
      this.$router.push('/signup');
    }
  },
  methods: {

    async onSubmitPayment() {
      if (!this.areCardFieldsComplete()) {
        this.isFieldsEmpty = true;
        return;
      }

      if (!this.areCardFieldsValid()) {
        this.areFieldsNotValid = true;
        return;
      }

      this.isProcessing = true;

      try {
        const tempData = localStorage.getItem('temp_register_data');
        if (!tempData) throw new Error("No registration data found");

        const userData = JSON.parse(tempData);

        const registerResponse = await this.registerService.signUpUser(userData);

        if (registerResponse && (registerResponse.status === 200 || registerResponse.status === 201)) {
          const newUserId = registerResponse.data.id;

          this.form.userId = newUserId;

          const paymentResponse = await this.paymentService.savePaymentDetails(this.form);

          if (paymentResponse.status === 200 || paymentResponse.status === 201 || paymentResponse.data?.status_code === 202) {
            this.paymentSuccess = true;

            localStorage.removeItem('temp_register_data');
            localStorage.removeItem('selected_plan');
          }
        } else {
          throw new Error("Registration failed at backend.");
        }

      } catch (error) {
        console.error("Error during process:", error);
        alert("An error occurred during registration/payment. Please try again.");
      } finally {
        this.isProcessing = false;
      }
    },

    areCardFieldsValid() {
      if (this.form.cardHolderName.trim().length > 20) return false;

      if (this.form.cvv.length !== 3) return false;

      const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d\d$/;
      if (!datePattern.test(this.form.expirationDate)) return false;

      if (this.form.cardNumber.trim().length !== 16) return false;

      return true;
    },

    areCardFieldsComplete() {
      if (!this.form.cardHolderName || !this.form.cardNumber || !this.form.expirationDate || !this.form.cvv) {
        return false;
      }
      return true;
    },

    navigateToLogin() {
      this.$router.push('/login');
    }

  }
}
</script>

<template>
  <div class="payment-details-container h-screen flex">
    <div class="logo-container flex">
      <img src="../../assets/ManageWise_logo.png" alt="logo" style="width: 100px; height: auto;" />
      <span class="font-bold text-4xl">ManageWise</span>
    </div>
    <div class="card flex gap-3">

      <h1 class="title text-2xl font-light align-self-start">Payment details</h1>

      <form class="flex flex-column gap-3" @submit.prevent="onSubmitPayment()">

        <input type="text" placeholder="Cardholder Name" class="input-field  p-3" v-model="form.cardHolderName"/>

        <input type="text" placeholder="Card Number" class="input-field  p-3" v-model="form.cardNumber"/>

        <div class="cardinfo-container">
          <input type="text" placeholder="Expiration date (MM/DD/YY)" class="input-field p-3" v-model="form.expirationDate"/>
          <input type="text" placeholder="CVV" class="input-field p-3" v-model="form.cvv"/>
        </div>

        <button type="submit" class="button p-3 uppercase font-medium text-md"
                style="color: #fff; margin-top:30px" :disabled="isProcessing">
          {{ isProcessing ? 'Processing...' : 'Pay & Complete Registration' }}
        </button>
      </form>
    </div>

  </div>

  <pv-dialog :style="{margin: '0 10px'}" :visible.sync="isFieldsEmpty" :modal="true" :closable="false">
    <div class="error-modal p-5 flex flex-column align-items-center gap-5 text-center">
      <i class="text-7xl pi pi-times-circle text-red-500"></i>
      <h1>Fill the formulary!</h1>
      <p class="text-md">Some input is not complete, try again</p>
      <pv-button class="py-3 px-5" label="OK" @click="isFieldsEmpty = false"/>
    </div>
  </pv-dialog>

  <pv-dialog :style="{margin: '0 10px'}" :visible.sync="areFieldsNotValid" :modal="true" :closable="false">
    <div class="error-modal p-5 flex flex-column align-items-center gap-5 text-center">
      <i class="text-7xl pi pi-exclamation-triangle text-yellow-500"></i>
      <h1>Verify the fields format!</h1>
      <p class="text-md">The fields entered are not valid, try again</p>
      <pv-button class="py-3 px-5" label="OK" @click="areFieldsNotValid = false"/>
    </div>
  </pv-dialog>

  <!-- Modal de éxito -->
  <pv-dialog :style="{margin: '0 10px'}" :visible.sync="paymentSuccess" :modal="true" :closable="false">
    <div class="error-modal p-5 flex flex-column align-items-center gap-5 text-center">
      <i class="text-7xl pi pi-check-circle text-green-500"></i>
      <h1>Welcome Aboard!</h1>
      <p class="text-md">Your payment was successful and your account has been created.</p>
      <pv-button style="letter-spacing: .8px" class="py-3 px-5" label="Go to Login" @click="navigateToLogin()"/>
    </div>
  </pv-dialog>
</template>

<style scoped>
.payment-details-container {
  background-color: #F9F5EF;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
}

.logo-container {
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 4rem;
}

.card {
  width: 100%;
  max-width: 700px;
  background-color: #fff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  height: auto;
  text-align: center;
  justify-content: center;
  padding: 50px;
  margin: 40px;
  flex-direction: column;
}

.title {
  margin-bottom: 40px;
}

.input-field {
  align-self: center;
  width: 100%;
  border-radius: 20px;
  border: 1px solid #BDBDBD;
  color: #0009;
}

.cardinfo-container {
  align-self: center;
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.input-field:hover {
  background-color: #F7F7F7;
}

.button {
  width: 40%;
  align-self: center;
  background-color: #FA8224;
  border: none;
  border-radius: 30px;
  cursor: pointer;
}

.button:hover {
  background-color: #d16716ff;
}
.button:disabled {
  background-color: #fccda4;
  cursor: not-allowed;
}


@media screen and (max-width: 500px) {

  .card {
    padding: 30px;
  }

  .logo-container {
    flex-direction: column;
    text-align: center;
  }

  .input-field {
    width: 100%;
  }

  .cardinfo-container {
    flex-direction: column;
    width: 100%;
    gap: 1rem;
  }
}

@media screen and (max-width: 560px) {
  .button {
    width: 80%;
  }
}

</style>