<script>
import { RegisterService } from '@/services/register.service';

export default {
  name: "signup-content",
  data() {
    return {
      token: "",
      registerService: new RegisterService(),
      users: [],
      confirmPassword: '',
      passwordFieldType: 'password',
     currentStep: 1,
      form: {
        firstName: "",
        lastName: "",
        age: 0,
        email: "",
        phone: "",
        password: "",
        profileImg: "",
        role: "",
        companyName: "",
        companyEmail: "",
        companyCountry: "",
        teamRegisterCode: "",
      },
      errors: {
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        missingInput: 'Not all fields are filled',
      },
    }
  },
  async created() {
    //await this.getUsers();
  },
  methods: {

    async getUsers() {
      // obtenemos la respuesta del endpoint
      const response = await this.userService.getAllUsers();

      this.users = response.data;
      console.log(response.data);
    },

    async onSubmitRegister() {
      // Create a new user using the userService or the function and call the service
      const formValidationOne = await this.registerService.validatePrimaryRegisterData(this.form, this.confirmPassword);
      const formValidationTwo = await this.registerService.validateSecondaryRegisterData(this.form);
      
      console.log(formValidationOne.valid, ': formValidation1');
      console.log(formValidationTwo.valid, ': formValidation2');
      if(!formValidationOne.valid || !formValidationTwo.valid){
        if(!formValidationOne.valid){
          console.log('step 1 is not ok...', formValidationOne.errors );    
          this.errors = formValidationOne.errors;
  
        }
        else if(!formValidationTwo.valid){
          console.log('step 2 is not ok...', formValidationTwo.errors);
          this.errors = formValidationTwo.errors;
        }
        return false;
      }else{
        console.log('forms are ok...');      
        this.errors = {};
        console.log('Sending Data:', this.form);
        // Sign Up User
        const response = await this.registerService.signUpUser(this.form);

      }

    },


    async validatePrimaryRegisterData(){
      const formValidationOne = await this.registerService.validatePrimaryRegisterData(this.form, this.confirmPassword);
      if(!formValidationOne.valid){
        console.log('step 1 is not ok...', formValidationOne.errors );  
        this.errors = formValidationOne.errors;
        return false;
      }else{
        this.errors = formValidationOne.errors;
        console.log('step 1 is ok...');      
        this.currentStep = 2;
      }
    },


    // validate fields in current step -> validate fields in next step -> submit form



    isValidEmail(email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        return false;
      }
      this.errors.email = '';
      return true;
    },

    togglePasswordFieldType() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    },

    goToLogin() {
      this.$store.commit('clearForm');
      this.isUserCreated = false;
      this.$router.push('/login');
    },

    nextStep() {
      if (this.currentStep === 1) {
        this.currentStep = 2;
      } else if (this.currentStep === 2) {
        // Si estás en el paso 2, puedes regresar al paso 1
        this.currentStep = 1;
        this.errors = {};
      }
    },
  }
}

</script>

<template>
  <div class="signup-container min-h-screen flex">
    <div class="logo-container flex">
      <img src="../../assets/logoAidManager.png" alt="logo" />
      <span class="font-bold text-4xl">AidManager</span>
    </div>
    <div class="card flex">
      <span class="title font-normal" style="font-size:1rem">Transform your fundraising efforts with precision
        analytics.</span>

      <form @submit.prevent="onSubmitRegister()">
        <div v-if="currentStep === 1" class="flex flex-column gap-3 align-items-center">
          <div class="user-name-container">
            <div class="input-container">
              <input type="text" placeholder="First Name" class="input-field p-3" v-model="form.firstName" />
              <p v-if="errors.firstName" class="error-message">{{ errors.firstName }}</p>
            </div>

            <div class="input-container">
              <input type="text" placeholder="Last Name" class="input-field p-3" v-model="form.lastName" />
              <p v-if="errors.lastName" class="error-message">{{ errors.lastName }}</p>
            </div>
          </div>

          <div class="input-container">
            <input type="email" placeholder="Institution Email" class="input-field  p-3" v-model="form.email" />
            <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
          </div>

          <div class="input-container"><input type="password" placeholder="Password" class="input-field p-3" v-model="form.password" />
            <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
          </div>


          <div class="confirm-password-field">
            <input :type="passwordFieldType" placeholder="Confirm password" class="input-field p-3"
              v-model="confirmPassword" />
            <i :class="passwordFieldType === 'password' ? 'pi pi-eye' : 'pi pi-eye-slash'"
              @click="togglePasswordFieldType" class="toggle-icon"></i>
          </div>
        </div>


        <!--Paso 2 del formulario para validar TRG o agregar datos de la compania-->
        <div v-if="currentStep === 2">
          <form class="flex flex-column gap-3" @submit.prevent="completeRegistration()">
            <h2>Almost there!</h2>
            <div v-if="form.role === 'team'">
              <input type="text" placeholder="Team Register Code" class="input-field p-3"
                v-model="form.teamRegisterCode" />
            </div>
            <div v-if="form.role === 'director'">
              <div class="flex flex-column gap-3">
                <input type="text" placeholder="Company Name" class="input-field p-3" v-model="form.companyName" />
                <div><input type="email" placeholder="Company Email" class="input-field p-3"
                    v-model="form.companyEmail" />
                  <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
                </div>

                <input type="text" placeholder="Company Country" class="input-field p-3"
                  v-model="form.companyCountry" />
              </div>

            </div>
          </form>
        </div>

        <div v-if="currentStep === 1" class="radio-button-container">
          <input class="radio-input" type="radio" id="director" name="type_user" value="director" v-model="form.role" />
          <label class="radio-label" for="director">Director</label>

          <input class="radio-input" type="radio" id="team" name="type_user" value="team" v-model="form.role" />
          <label class="radio-label" for="team">Team</label>
        </div>
        <p v-if="errors.role" class="error-message">{{ errors.role }}</p>
        <div class="flex flex-row gap-3 justify-content-center align-items-center">
          <button type="button" v-if="currentStep === 2" class="button p-3" style="color: #fff; margin-top:30px"
            @click="nextStep">Return</button>
          <button type="button" v-if="currentStep === 1" class="button p-3" style="color: #fff; margin-top:30px"
            @click="validatePrimaryRegisterData">Continiue</button>
          <button type="submit" v-if="currentStep === 2" class="button p-3" style="color: #fff; margin-top:30px">Sign
            up</button>
        </div>

      </form>

    </div>
    <h3 class="card-footer">Already have an account?
      <router-link to="/login" class="link" style="font-weight: 600">Log in</router-link>
    </h3>
  </div>
</template>

<style scoped>
.error-message {
  color: red;
  font-size: 0.8rem;
  margin-top: 5px;
}

.signup-container {
  background-color: #E6F4E2;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
}

.input-container {
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  font-size: 0.8rem;
}

.input-field {
  align-self: center;
  width: 100%;
  border-radius: 20px;
  border: 1px solid #BDBDBD;
  color: #0009;
}

.user-name-container {
  align-self: center;
  width: 90%;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.input-field:focus {
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

.link {
  width: 90%;
  align-self: center;
  text-align: right;
  color: #02513D;
  text-decoration: none;
}

.card-footer {
  font-weight: normal;
  font-size: 1rem;
  margin: 0 0 3rem 0;
}

.radio-button-container {
  margin-top: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

.radio-label {
  margin-right: 25px;
  line-height: 32px;
  font-size: 0.9rem;
}

.radio-input {
  appearance: none;

  border-radius: 50%;
  width: 16px;
  height: 16px;

  border: 2px solid #999;
  transition: 0.2s all linear;
  margin-right: 5px;

  position: relative;
}

.radio-input:checked {
  border: 8px solid #02513D;
}

.confirm-password-field {
  align-self: center;
  position: relative;
  width: 90%;
  display: flex;
  align-items: center;
}

.input-field {
  flex: 1;
}

.toggle-icon {
  color: #575757;
  position: absolute;
  right: 15px;
  cursor: pointer;
}

@media screen and (max-width: 500px) {
  .logo-container {
    flex-direction: column;
    text-align: center;
  }

  .input-field {
    width: 100%;
  }

  .confirm-password-field {
    width: 100%;
  }

  .link {
    width: 100%;
  }

  .user-name-container {
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