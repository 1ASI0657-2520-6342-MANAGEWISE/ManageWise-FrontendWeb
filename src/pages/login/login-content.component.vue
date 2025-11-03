<template>
  <div class="login-container h-screen flex">
    <div class="logo-container flex">
      <img src="../../assets/ManageWise_logo.png" alt="logo" class="logo-img" />
      <span class="brand-title">ManageWise</span>
    </div>

    <div class="card flex">
      <span class="title">Welcome!</span>

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

        <a class="link" href="#">Forgot your password?</a>

        <button :disabled="!formValid" type="submit" class="button p-3">
          Sign in
        </button>
      </form>
    </div>

    <h3 class="card-footer">
      New to ManageWise?
      <router-link to="/register" class="link strong">Join now</router-link>
    </h3>
  </div>

  <pv-dialog :style="{ margin: '0 10px' }" :visible.sync="showDialog" :modal="true" :closable="false">
    <div class="error-modal p-5 flex flex-column align-items-center gap-5 text-center">
      <i class="text-7xl pi pi-exclamation-circle text-red-500"></i>
      <h1>Login Failed!</h1>
      <p class="text-md">{{ message_error }}</p>
      <pv-button class="py-3 px-5" label="OK" @click="showDialog = false" />
    </div>
  </pv-dialog>
</template>

<style scoped>
.login-container {
  background-color: #f5f7f8;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
}

.logo-container {
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 3rem;
}

.logo-img {
  width: 80px;
  height: auto;
}

.brand-title {
  font-size: 2rem;
  font-weight: 700;
  color: #34424a;
  letter-spacing: 1px;
}

.card {
  width: 100%;
  max-width: 700px;
  background-color: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  padding: 40px;
  margin: 40px;
  flex-direction: column;
  text-align: center;
}

.title {
  margin-bottom: 40px;
  font-size: 1.8rem;
  color: #34424a;
  font-weight: 600;
}

.input-field {
  align-self: center;
  width: 100%;
  border-radius: 25px;
  border: 1px solid #bdbdbd;
  color: #34424a;
  padding: 12px 45px 12px 15px; /* espacio para el ícono */
  font-size: 1rem;
  transition: all 0.2s ease;
}

.input-field:focus {
  background-color: #f7f7f7;
  border-color: #f47c26;
  outline: none;
}

.password-field {
  align-self: center;
  position: relative;
  width: 90%;
  display: block;
}

.toggle-icon {
  color: #575757;
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 1.1rem;
}

.button {
  width: 40%;
  align-self: center;
  background-color: #f47c26;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  color: #fff;
  font-weight: 600;
  transition: background 0.2s ease;
}

.button:hover {
  background-color: #d4641f;
}

.link {
  color: #34424a;
  text-decoration: none;
  font-style: italic;
  font-size: 0.85rem;
}

.link.strong {
  font-weight: 600;
  color: #f47c26;
}

.card-footer {
  font-weight: normal;
  font-size: 1rem;
}

@media screen and (max-width: 500px) {
  .logo-container {
    flex-direction: column;
    text-align: center;
  }

  .logo-img {
    width: 70px;
  }

  .brand-title {
    font-size: 1.6rem;
  }

  .button {
    width: 100%;
  }
}
</style>
