<script>
import { UserService } from "@/services/user.service.js";
import { environment } from "@/environment/environment.js";

export default {
  name: "login-content",
  data() {
    return {
      userService: new UserService(),
      email: "",
      password: "",
      formValid: false,
      passwordFieldType: "password",
      isRegistered: false,
      showDialog: false,
      message_error: "",
      // reCAPTCHA
      siteKey: environment.recaptchaSiteKey,
      captchaWidgetId: null,
      captchaToken: "",
      captchaKey: 0,

    };
  },
  methods: {
    async resetAndRerenderCaptcha() {
      try {
        if (window.grecaptcha && this.captchaWidgetId !== null) {
          window.grecaptcha.reset(this.captchaWidgetId);
        }
      } catch (_) { /* ignore */ }

      // Fuerza re-montaje del contenedor para evitar widgets huérfanos
      this.captchaKey += 1;
      this.captchaToken = "";
      this.captchaWidgetId = null;
      await this.$nextTick();
      await this.renderCaptcha();
    },
    async ensureRecaptchaReady() {
      // si ya está listo, salir
      if (window.grecaptcha?.render) return;

      // cargar script si no existe
      if (!document.querySelector('script[src*="recaptcha/api.js"]')) {
        const s = document.createElement("script");
        s.src =
            "https://www.google.com/recaptcha/api.js?onload=__recaptchaOnload&render=explicit";
        s.async = true;
        s.defer = true;
        document.head.appendChild(s);
        await new Promise((resolve) => (window.__recaptchaOnload = resolve));
      } else {
        // esperar a que se inicialice
        await new Promise((resolve) => {
          const tick = () =>
              window.grecaptcha?.render ? resolve() : setTimeout(tick, 50);
          tick();
        });
      }
    },

    async renderCaptcha() {
      await this.ensureRecaptchaReady();

      // limpiar contenedor y renderizar explícitamente
      if (this.$refs.captchaBox) this.$refs.captchaBox.innerHTML = "";
      this.captchaWidgetId = window.grecaptcha.render(this.$refs.captchaBox, {
        sitekey: this.siteKey,
        theme: "light",
        size: "normal",
        callback: (token) => {
          this.captchaToken = token;
          console.log("captchaToken:", token);
        },
        "expired-callback": () => (this.captchaToken = ""), // expiró
        "error-callback": () => (this.captchaToken = ""), // error
      });
    },

    async handleSubmitLogin() {
      this.isRegistered = false;

      // 1) Asegurar token
      if (!this.captchaToken && this.captchaWidgetId !== null && window.grecaptcha) {
        this.captchaToken = window.grecaptcha.getResponse(this.captchaWidgetId);
      }
      if (!this.captchaToken) {
        this.message_error = "Por favor verifica el CAPTCHA.";
        this.showDialog = true;
        await this.resetAndRerenderCaptcha(); // <--
        return;
      }

      // 2) Intento de login
      let res;
      try {
        res = await this.userService.signInUser(this.email, this.password, this.captchaToken);
      } catch (err) {
        this.message_error = "No se pudo contactar al servidor.";
        this.showDialog = true;
        await this.resetAndRerenderCaptcha(); // <--
        return;
      }

      // 3) Respuesta backend
      if (res?.status === 200) {
        this.$store.commit("setToken", res.data.token);
        this.$store.commit("setUser", res.data.id);
        this.isRegistered = true;
        this.$router.push("/home");
        return;
      } else {
        // Si el backend rechazó el captcha o credenciales
        const msg = res?.response?.data || "Login failed";
        this.message_error = typeof msg === "string" ? msg : "Login failed";
        this.showDialog = true;
        await this.resetAndRerenderCaptcha(); // <--
        return;
      }
    },


    validateForm() {
      this.formValid = this.email !== "" && this.password !== "";
    },

    togglePasswordFieldType() {
      this.passwordFieldType =
          this.passwordFieldType === "password" ? "text" : "password";
    },
  },

  async mounted() {
    await this.renderCaptcha();

    const gtagId = import.meta.env.VITE_GTAG;
    console.log("Google Analytics in Login ID:", gtagId);
    console.log("NODE_ENV:", import.meta.env.MODE);
  },

  beforeUnmount() {
    if (this.$refs.captchaBox) this.$refs.captchaBox.innerHTML = "";
    this.captchaWidgetId = null;
    this.captchaToken = "";
  },
};
</script>

<template>
  <div class="login-container h-screen flex">
    <div class="logo-container flex">
      <img src="../../assets/ManageWise_logo.png" alt="logo" style="width: 100px; height: auto;" />
      <span class="font-bold text-3xl">ManageWise</span>
    </div>

    <div class="card flex">
      <span class="title font-normal text-xl" style="color: #FA8224;">Welcome!</span>

      <form class="flex flex-column gap-3" @submit.prevent="handleSubmitLogin">
        <input
            type="email"
            placeholder="Email"
            class="input-field p-3"
            v-model="email"
            @input="validateForm"
        />

        <div class="password-field">
          <input
              :type="passwordFieldType"
              placeholder="Password"
              class="input-field p-3"
              v-model="password"
              @input="validateForm"
          />
          <i
              :class="passwordFieldType === 'password' ? 'pi pi-eye' : 'pi pi-eye-slash'"
              @click="togglePasswordFieldType"
              class="toggle-icon"
          ></i>
        </div>

        <a class="link" href="#" style="color: #FA8224; font-style: italic; font-size: 0.8rem;">
          Forgot your password?
        </a>

        <div class="recaptcha-wrapper">
          <div :key="captchaKey" ref="captchaBox"></div>
        </div>

        <button :disabled="!formValid" type="submit" class="button p-3" style="color:#fff;margin-top:30px">
          Sign in
        </button>
      </form>
    </div>

    <h3 class="card-footer">
      New to ManageWise?
      <router-link to="/register" class="link" style="font-weight: 600">Join now</router-link>
    </h3>

    <pv-dialog :style="{ margin: '0 10px' }" :visible.sync="showDialog" :modal="true" :closable="false">
      <div class="error-modal p-5 flex flex-column align-items-center gap-5 text-center">
        <i class="text-7xl pi pi-exclamation-circle text-red-500"></i>
        <h1>Login Failed!</h1>
        <p class="text-md">{{ message_error }}</p>
        <pv-button class="py-3 px-5" label="OK" @click="showDialog = false" />
      </div>
    </pv-dialog>
  </div>
</template>

<style scoped>
.login-container {
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
  padding: 40px;
  margin: 40px;
  flex-direction: column;
}
.title { margin-bottom: 40px; }
.input-field {
  align-self: center;
  width: 90%;
  border-radius: 20px;
  border: 1px solid #BDBDBD;
  color: #0009;
}
.input-field:focus { background-color: #F7F7F7; }
.button {
  width: 40%;
  align-self: center;
  background-color: #FA8224;
  border: none;
  border-radius: 30px;
  cursor: pointer;
}
.button:hover { background-color: #d16716ff; }
.link {
  width: 90%;
  align-self: center;
  text-align: right;
  color: #FA8224;
  text-decoration: none;
}
.card-footer { font-weight: normal; font-size: 1rem; }
.password-field {
  align-self: center;
  position: relative;
  width: 90%;
  display: flex;
  align-items: center;
}
.input-field { flex: 1; padding-right: 2.5rem; }
.toggle-icon {
  color: #575757;
  position: absolute;
  right: 15px;
  cursor: pointer;
}
@media screen and (max-width: 500px) {
  .logo-container { flex-direction: column; text-align: center; }
  .input-field { width: 100%; }
  .password-field { width: 100%; }
  .link { width: 100%; }
}
@media screen and (max-width: 560px) { .button { width: 100%; } }

.recaptcha-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 78px;
  margin: 8px 0;
}
.recaptcha-wrapper iframe[src*="recaptcha"] {
  display: block !important;
  opacity: 1 !important;
  visibility: visible !important;
  transform: none !important;
  filter: none !important;
  position: static !important;
  z-index: 1 !important;
}
.recaptcha-wrapper > div > div { min-height: 78px !important; }
</style>
