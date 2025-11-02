<script>
import {PaymentDetailsService} from "@/services/payment-details.service.js";

export default {
  name: "payment-details-content",
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  data() {
    return {
      paymentService: new PaymentDetailsService(),
      isFieldsEmpty: false,
      areFieldsNotValid: false,
      paymentSuccess: false,
      form: {
        userId: 0,
        cardHolderName: '',
        cardNumber: '',
        expirationDate: '',
        cvv: ''
      }
    }
  },
  methods: {

    async onSubmitPayment() {

      if (!this.areCardFieldsComplete()) {
        this.isFieldsEmpty = true;
        return;
      }

      if(!this.areCardFieldsValid()) {
        this.areFieldsNotValid = true;
        return;
      }

      this.form.userId = this.user.id;

      await this.paymentService.savePaymentDetails(this.form)
          .then(r=> {
            const result = r.data;
            if(result.status_code === 202) {
              this.paymentSuccess = true;
              console.log(result)
            }

          })


    },

    areCardFieldsValid() {

      // Verificar que cardHolder no tenga más de 20 caracteres
      if (this.form.cardHolderName.trim().length > 20) {
        return false;
      }

      // Verificar que cvv tenga 3 digitos
      if (this.form.cvv.length !== 3) {
        return false;
      }

      // Verificar que expirationDate tenga el formato MM/DD/YY
      const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d\d$/;
      if (!datePattern.test(this.form.expirationDate)) {
        return false;
      }

      // Verificar que cardNumber tenga exactamente 16 dígitos
      if (this.form.cardNumber.trim().length !== 16) {
        return false;
      }

      return true;
    },

    areCardFieldsComplete() {
      // Verificar que todos los campos estén completos
      if (!this.form.cardHolderName || !this.form.cardNumber || !this.form.expirationDate || !this.form.cvv) {
        return false;
      }

      return true;
    },

    navigateToPreliminar() {
      this.$router.push('/setup');
    }

  }
}
</script>

<template>
  <div class="payment-details-container h-screen flex">
    <div class="logo-container flex">
      <img src="../../assets/logoAidManager.png" alt="logo"/>
      <span class="font-bold text-4xl">AidManager</span>
    </div>
    <div class="card flex gap-3">

      <h1 class="title text-2xl font-light align-self-start">Payment details</h1>

      <form class="flex flex-column gap-3" @submit.prevent="onSubmitPayment()">

        <input type="text" placeholder="Cardholder Name" class="input-field  p-3" v-model="form.cardHolderName"/>

        <input type="text" placeholder="Card Number" class="input-field  p-3" v-model="form.cardNumber"/>

        <div class="cardinfo-container">
          <input type="text" placeholder="Expiration date" class="input-field p-3" v-model="form.expirationDate"/>
          <input type="text" placeholder="CVV" class="input-field p-3" v-model="form.cvv"/>
        </div>

        <button type="submit" class="button p-3 uppercase font-medium text-md"
                style="color: #fff; margin-top:30px">Pay
        </button>
      </form>
    </div>

  </div>
  <!-- Display modal when the inputs are empty -->
  <pv-dialog :style="{margin: '0 10px'}" :visible.sync="isFieldsEmpty" :modal="true" :closable="false">
    <div class="error-modal p-5 flex flex-column align-items-center gap-5 text-center">
      <i class="text-7xl pi pi-times-circle text-red-500"></i>
      <h1>Fill the formulary!</h1>
      <p class="text-md">Some input is not complete, try again</p>
      <pv-button class="py-3 px-5" label="OK" @click="isFieldsEmpty = false"/>
    </div>
  </pv-dialog>
  <!-- display modal when the inputs format are not valid -->
  <pv-dialog :style="{margin: '0 10px'}" :visible.sync="areFieldsNotValid" :modal="true" :closable="false">
    <div class="error-modal p-5 flex flex-column align-items-center gap-5 text-center">
      <i class="text-7xl pi pi-exclamation-triangle text-yellow-500"></i>
      <h1>Verify the fields format!</h1>
      <p class="text-md">The fields entered are not valid, try again</p>
      <pv-button class="py-3 px-5" label="OK" @click="areFieldsNotValid = false"/>
    </div>
  </pv-dialog>
  <!--  Display modal when the payment form has accepted-->
  <pv-dialog :style="{margin: '0 10px'}" :visible.sync="paymentSuccess" :modal="true" :closable="false">
    <div class="error-modal p-5 flex flex-column align-items-center gap-5 text-center">
      <i class="text-7xl pi pi-check-circle text-green-500"></i>
      <h1>Your payment was successfull!</h1>
      <p class="text-md">Customize your organization to start a new adventure</p>
      <pv-button style="letter-spacing: .8px" class="py-3 px-5" label="Next step" @click="navigateToPreliminar()"/>
    </div>
  </pv-dialog>
</template>

<style scoped>
.payment-details-container {
  background-color: #E6F4E2;
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
  background-color: #02513D;
  border: none;
  border-radius: 30px;
  cursor: pointer;
}

.button:hover {
  background-color: #024030;
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

  .link {
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