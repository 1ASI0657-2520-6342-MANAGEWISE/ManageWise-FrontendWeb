<script>
import { UserService } from "@/services/user.service.js";
import { CompanyService } from "@/services/company.service.js";

export default {
  name: "setup-content",
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  data() {
    return {
      userService: new UserService(),
      companyService: new CompanyService(),
      isFieldsEmpty: false,
      hasSuccessful: false,
      form: {
        brandName: '',
        country: '',
        phone: '',
        identificationCode: '',
        userId: 0
      }
    }
  },
  async created() {
    //await this.getUsers();
  },
  methods: {

    async onSubmitSetup() {
      if (!this.areCardFieldsComplete()) {
        this.isFieldsEmpty = true;
        return;
      }

      try {
        this.form.identificationCode = this.generateOrganizationId();
        this.form.userId = this.user.id;
        const response = await this.companyService.createCompany(this.form);

        if (response.data.status_code !== 200) {
          throw new Error('Error al crear la compañía');
        }
        try {
          await this.companyService.editCompanyId(this.form.userId, this.form.identificationCode);
          console.log(this.form);

          if (this.form.brandName) {
            this.$store.commit('updateForm', {
              ...this.$store.state.form,
              companyName: this.form.brandName
            });

            const userToUpdate = {
              userId: this.user.id,
              companyName: this.form.brandName
            };
            await this.companyService.editUserCompanyName(userToUpdate);

            // Actualiza el companyName en el estado local
            this.user.companyName = this.form.brandName;

            this.$store.commit('setUser', this.user);
            this.hasSuccessful = true;
          }

          route.push('/login');
        } catch (error) {
          console.error('Error al editar el id de la compañía:', error);
        }
      } catch (error) {
        console.error('Error al crear la compañía:', error);
      }
    },

    async getUsers() {
      // obtenemos la respuesta del endpoint
      const response = await this.userService.getAllUsers();

      this.users = response.data;
      console.log(response.data);
    },

    generateOrganizationId() {
      let id = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      for (let i = 0; i < 8; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return id;
    },

    areCardFieldsComplete() {
      // Verificar que todos los campos estén completos
      if (!this.form.brandName || !this.form.country || !this.form.phone) {
        return false;
      }

      return true;
    },

    clipboardSuccessHandler() {
      alert('Copy to clipboard: ' + this.form.identificationCode)
    },

    clipboardErrorHandler() {
      console.log('error', this.form.identificationCode)
    },

    navigateToLogin() {
      this.$store.commit('clearForm');
      this.$router.push('/login');
    }

  }
}
</script>

<template>
  <div class="setup-container h-screen flex">
    <div class="logo-container flex">
      <img src="../../assets/logoAidManager.png" alt="logo" />
      <span class="font-bold text-4xl">AidManager</span>
    </div>
    <form class="card flex gap-3" @submit.prevent="onSubmitSetup">

      <h1 class="title font-normal text-xl">Preliminar Setup</h1>

      <input type="text" placeholder="Organization Trademark" class="input-field  p-3" v-model="form.brandName" />

      <input type="text" placeholder="Country/Region" class="input-field  p-3" v-model="form.country" />

      <input type="text" placeholder="Phone Number" class="input-field  p-3" v-model="form.phone" />
      <button type="submit" class="button p-3 font-medium uppercase text-md" style="color: #fff; margin-top:30px">Start
      </button>

    </form>
  </div>
  <!-- Display modal when the inputs are empty -->
  <pv-dialog :style="{ margin: '0 10px' }" :visible.sync="isFieldsEmpty" :modal="true" :closable="false">
    <div class="error-modal p-5 flex flex-column align-items-center gap-5 text-center">
      <i class="text-7xl pi pi-times-circle text-red-500"></i>
      <h1>Fill the formulary!</h1>
      <p class="text-md">Some input is not complete, try again</p>
      <pv-button class="py-3 px-5" label="OK" @click="isFieldsEmpty = false" />
    </div>
  </pv-dialog>
  <!--  Display modal when the user has successfully registered-->
  <pv-dialog :style="{ margin: '0 10px' }" :visible.sync="hasSuccessful" :modal="true" :closable="false">
    <div class="error-modal p-5 flex flex-column align-items-center gap-5 text-center">
      <i class="text-7xl pi pi-check-circle text-green-500"></i>
      <h2>You are ready to start a new journey!</h2>
      <div class="relative border-1 w-full border-round-md border-gray-500 py-2 text-xl font-light"
        style="letter-spacing: 1.5px">
        {{ this.form.identificationCode }}
        <button class="cursor-pointer absolute right-0 mr-2 inline-block p-1 border-round-md
          border-1 border-gray-500 hover:bg-black-alpha-10 transition-all transition-duration-300"
          v-clipboard="this.form.identificationCode" v-clipboard:success="clipboardSuccessHandler"
          v-clipboard:error="clipboardErrorHandler">
          <i class="flex text-xl pi pi-clipboard text-green-800" style="margin-bottom: 2px"></i>
        </button>
      </div>
      <p class="text-md line-height-4">Share this code with your collaborators,<br /><span
          class="text-green-700 font-medium">don't forget to keep it in a safe place.</span></p>
      <pv-button style="letter-spacing: .8px" class="py-3 px-5" label="Join" @click="navigateToLogin()" />
    </div>
  </pv-dialog>
</template>

<style scoped>
.setup-container {
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
  padding: 40px;
  margin: 40px;
  flex-direction: column;
}

.title {
  margin-bottom: 40px;
}

.input-field {
  align-self: center;
  width: 90%;
  border-radius: 20px;
  border: 1px solid #BDBDBD;
  color: #0009;
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
  .logo-container {
    flex-direction: column;
    text-align: center;
  }

  .input-field {
    width: 100%;
  }
}

@media screen and (max-width: 560px) {
  .button {
    width: 80%;
  }
}
</style>