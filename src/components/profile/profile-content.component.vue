<script>
import {UserService} from "@/services/user.service.js";
import {mapState} from "vuex";
import {fetchAllTaskDataByUserId} from "@/services/projects-api.services.js";
import Toast from 'primevue/toast'; // Importar Toast

export default {
  name: "ProfileContent",
  components: { Toast },
  computed: {
    user() {
      return this.$store.state.user || {};
    },
    displayHeaderName() {
      const u = this.user;

      const firstNameToken = (u.firstName || '').trim().split(/\s+/)[0] || '';
      const firstSurnameToken = (u.lastName || '').trim().split(/\s+/)[0] || '';

      if (firstNameToken || firstSurnameToken) {
        return [firstNameToken, firstSurnameToken].filter(Boolean).join(' ').trim();
      }

      const full = (u.name || '').trim();
      if (!full) return '';

      const parts = full.split(/\s+/);
      if (parts.length === 1) return parts[0];
      if (parts.length === 2) return `${parts[0]} ${parts[1]}`;
      return `${parts[0]} ${parts[parts.length - 2]}`;
    },
    filteredTasks() {
      return this.tasks
          .filter(task => !this.taskFilters.status || task.state === this.taskFilters.status)
          .filter(task => !this.taskFilters.date || task.dueDate === this.taskFilters.date);
    },
    isManager() {
      const role = String(this.user?.role || '').toLowerCase().trim();
      return role === '0' || role === 'manager' || role === 'director';
    },
    teamCode() {
      return this.user?.teamRegisterCode || '';
    }
  },
  data() {
    return {
      isFieldsEmpty: false,
      userService: new UserService(),
      showPopUp: false,
      showImageUrlInput: false,
      inputUpdateInfo: {
        firstName: "",
        lastName: "",
        email: "",
        age: "",
        phone: "",
        occupation: "",
        bio: "",
        profileImg: ""
      },
      editField: {
        fullName: false,
        email: false,
        age: false,
        phone: false,
        occupation: false,
        bio: false,
        profileImg: false
      },
      tasks: [],
      taskFilters: {
        status: '',
        date: ''
      }

    }
  },
  methods: {
    clearInputUpdateInfo() {
      this.inputUpdateInfo = {
        firstName: "",
        lastName: "",
        email: "",
        age: "",
        phone: "",
        occupation: "",
        bio: "",
        profileImg: ""
      };
    },

    togglePopUp() {
      this.showPopUp = !this.showPopUp;

      if (this.showPopUp) {
        const parts = (this.user.name || '').trim().split(/\s+/);
        const firstName = parts[0] || '';
        const lastName  = parts.slice(1).join(' ');
        this.inputUpdateInfo = {
          firstName,
          lastName,
          email: this.user.email || '',
          age: this.user.age ?? '',
          phone: this.user.phone || '',
          occupation: this.user.occupation || '',
          bio: this.user.bio || '',
          profileImg: this.user.profileImg || ''
        };
      }

      this.editField = {
        fullName: false, email: false, age: false, phone: false,
        occupation: false, bio: false, profileImg: false
      };
    },
    validatePhone(e) {
      const raw = e.target.value || '';
      const clean = raw.replace(/\D+/g, '').slice(0, 9);
      this.inputUpdateInfo.phone = clean;
      e.target.value = clean;
    },
    async updateProfileImg() {
      if(this.inputUpdateInfo.profileImg === "") {
        return;
      }

      const newUser = {
        ...this.user,
        profileImg: this.inputUpdateInfo.profileImg,
        id: this.$route.params.id
      };

      const response = this.userService.updateUser(newUser);
      response.then((data) => {

        console.log('data updated', data)

        const user = data;

        this.$store.dispatch('updateUser', user);

        this.clearInputUpdateInfo();
        this.togglePopUp();
      })
          .catch((error) => {
            console.error('Error al actualizar el usuario:', error);
          });
    },

    ToggleInputProfileImage() {
      this.showImageUrlInput = !this.showImageUrlInput;
      this.updateProfileImg();
    },

    toggleEditField(field) {
      this.editField[field] = true;
    },

    async updateProfile() {
      if (this.editField.fullName) {
        if (!this.inputUpdateInfo.firstName?.trim() || !this.inputUpdateInfo.lastName?.trim()) {
          this.isFieldsEmpty = true; return;
        }
      }
      if (this.editField.age && !this.inputUpdateInfo.age) { this.isFieldsEmpty = true; return; }
      if (this.editField.phone && !this.inputUpdateInfo.phone) { this.isFieldsEmpty = true; return; }
      if (this.editField.occupation && !this.inputUpdateInfo.occupation) { this.isFieldsEmpty = true; return; }
      if (this.editField.bio && !this.inputUpdateInfo.bio) { this.isFieldsEmpty = true; return; }
      if (this.editField.profileImg && !this.inputUpdateInfo.profileImg) { this.isFieldsEmpty = true; return; }

      if (this.editField.phone) {
        if (!/^\d{9}$/.test(this.inputUpdateInfo.phone)) {
          alert('El teléfono debe tener exactamente 9 dígitos numéricos.');
          return;
        }
      }
      // Construye solo los campos cambiados (PATCH-like)
      const onlyUpdated = {};

      if (this.editField.fullName) {
        const fn = this.inputUpdateInfo.firstName.trim();
        const ln = this.inputUpdateInfo.lastName.trim();
        onlyUpdated.name = `${fn} ${ln}`;
      }
      if (this.editField.age)        onlyUpdated.age        = Number(this.inputUpdateInfo.age);
      if (this.editField.phone)      onlyUpdated.phone      = this.inputUpdateInfo.phone;
      if (this.editField.occupation) onlyUpdated.occupation = this.inputUpdateInfo.occupation;
      if (this.editField.bio)        onlyUpdated.bio        = this.inputUpdateInfo.bio;
      if (this.editField.profileImg) onlyUpdated.profileImg = this.inputUpdateInfo.profileImg;

      const newUser = { ...this.user, ...onlyUpdated, id: this.$route.params.id };

      this.userService.updateUser(newUser)
          .then((data) => {
            this.$store.dispatch('updateUser', data);
            this.clearInputUpdateInfo();
            this.togglePopUp();
          })
          .catch((e) => console.error('Error al actualizar el usuario:', e));
    },

    async fetchUserTasks() {
      if (!this.user || !this.user.id) {
        console.warn("Esperando datos de usuario para cargar tareas...");
        return;
      }

      try {
        const allTasks = await fetchAllTaskDataByUserId(1, this.user.id);
        this.tasks = allTasks;
      } catch (error) {
        console.error("Error cargando tareas:", error);
        this.tasks = [];
      }
    },
    goToProject(projectId) {
      this.$router.push({ name: 'projectTodo', params: { id: projectId } });  },

    async copyTeamCode() {
      if (!this.teamCode) return;
      try {
        await navigator.clipboard.writeText(this.teamCode);
        this.$toast.add({ severity: 'success', summary: 'Copied', detail: 'Team Code copied to clipboard', life: 3000 });
      } catch {
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Could not copy code', life: 3000 });
      }
    },
    async shareTeamCode() {
      if (!this.teamCode) return;
      const text = `Join our organization in AidManager with this Team Register Code: ${this.teamCode}`;
      if (navigator.share) {
        try {
          await navigator.share({ title: 'Team Register Code', text });
        } catch { /* user cancel */ }
      } else {
        // Fallback: copiar
        await this.copyTeamCode();
      }
    }
  },

  async mounted() {
    try {
      await this.fetchUserTasks();
    } catch (e) {
      console.log("El módulo de tareas falló, pero mostramos el perfil igual.");
    }
  }

}
</script>

<template>
  <div class="content">
    <Toast />
    <div class="profile-content flex">
      <form class="flex user-info form__update-profile" @submit.prevent="updateProfile">
        <h2>{{ displayHeaderName }}'s profile:</h2>

        <p class="editable flex flex-col  gap-2">
          <strong>Full Name:</strong>
          <span v-if="!editField['fullName']">{{ user.name}} </span>
          <div v-else class="full-name-input">
            <input type="text" placeholder="First Name" v-model="inputUpdateInfo['firstName']" >
            <input type="text" placeholder="Last Name" v-model="inputUpdateInfo['lastName']" >
          </div>
          <i v-if="!editField['fullName'] && showPopUp" class="pi pi-pencil edit-icon" @click="toggleEditField('fullName')"></i>

        </p>

        <p class="editable flex gap-2"><strong>Age: </strong>
          <span v-if="user.age === 0 && !editField['age']">No info to display</span>
          <span v-if="!editField['age'] && user.age !== 0"> {{ user.age}} years</span>
          <input v-if="editField['age']" type="number" placeholder="Age" v-model="inputUpdateInfo['age']" >
          <i v-if="!editField['age'] && showPopUp" class="pi pi-pencil edit-icon" @click="toggleEditField('age')"></i>
        </p>

        <p class="editable flex gap-2"><strong>Email: </strong>
          <span class="non-editable">{{ user.email}}</span>
        </p>

        <p class="editable flex gap-2"><strong>ONG:</strong>
          <span class="non-editable">{{ user.companyName}}</span>
        </p>

        <div v-if="isManager" class="editable">
          <div class="team-code-row">
            <strong>Team Code:</strong>
            <span class="non-editable team-code-badge">{{ teamCode }}</span>
          </div>

          <div class="team-code-actions">
            <button type="button" class="edit-button btn-inline" @click="copyTeamCode" aria-label="Copy team register code">
              <i class="pi pi-copy icon-left"></i> Copy
            </button>

            <button type="button" class="edit-button btn-inline ml-2" @click="shareTeamCode" aria-label="Share team register code">
              <i class="pi pi-share-alt icon-left"></i> Share
            </button>
          </div>

          <small class="hint-text">
            Share this code with your team so they can join your organization.
          </small>
        </div>

        <p class="editable flex gap-2"><strong>Phone: </strong>
          <span v-if="!editField['phone'] && user.phone === ''">No info to display</span>
          <span v-if="!editField['phone']">{{ user.phone}} </span>
          <input v-else type="text" inputmode="numeric" placeholder="Phone" :value="inputUpdateInfo.phone" maxlength="9" pattern="\d{9}" @input="validatePhone"/>          <i v-if="!editField['phone'] && showPopUp" class="pi pi-pencil edit-icon" @click="toggleEditField('phone')"></i>
        </p>

        <p class="editable flex gap-2"><strong>Occupation: </strong>
          <span v-if="!editField['occupation'] && user.occupation === ''">No info to display</span>
          <span v-if="!editField['occupation']">{{ user.occupation }} </span>
          <input v-else type="text" placeholder="Ocupation" v-model="inputUpdateInfo['occupation']" >
          <i v-if="!editField['occupation'] && showPopUp" class="pi pi-pencil edit-icon" @click="toggleEditField('occupation')"></i>
        </p>

        <p class="editable"><strong>Bio: </strong>
          <span v-if="!editField['bio'] && user.bio === ''">No info to display</span>
          <span v-if="!editField['bio']">{{ user.bio}} </span>
          <textarea v-else placeholder="Bio" v-model="inputUpdateInfo['bio']" ></textarea>
          <i v-if="!editField['bio'] && showPopUp" class="pi pi-pencil edit-icon" @click="toggleEditField('bio')"></i>
        </p>

        <button v-if="!showPopUp" class="edit-button" @click="togglePopUp">Edit profile</button>
        <button v-else class="edit-button" type="submit">Save changes</button>

      </form>

      <div class="flex flex-col">
        <div class="avatar-wrapper">
          <div class="avatar-image">
            <img :src="user.profileImg || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'" alt="User Photo">
            <div class="avatar-content" @click="ToggleInputProfileImage">
              <i class="pi pi-camera" style="font-size: 4rem; color: #9f9f9f;"></i>
            </div>
          </div>
        </div>
      </div>
    </div>


    <pv-dialog :style="{margin: '0 10px'}" :visible.sync="showImageUrlInput" :modal="true" :closable="false">
      <div class="p-5 flex flex-column align-items-center gap-5 text-center">
        <h2>Enter your profile image url: </h2>
        <input type="text" placeholder="Profile Image Url" v-model="inputUpdateInfo['profileImg']" >
        <pv-button class="py-3 px-5" label="OK" @click="ToggleInputProfileImage"/>
      </div>
    </pv-dialog>

    <pv-dialog :style="{margin: '0 10px'}" :visible.sync="isFieldsEmpty" :modal="true" :closable="false">
      <div class="error-modal p-5 flex flex-column align-items-center gap-5 text-center">
        <i class="text-7xl pi pi-times-circle text-red-500"></i>
        <h1>Fill the formulary!</h1>
        <p class="text-md">There is no information to update a user</p>
        <pv-button class="py-3 px-5" label="OK" @click="isFieldsEmpty = false"/>
      </div>
    </pv-dialog>
    <div class="container-for-task">
      <div class="user-tasks" style="margin-top: 2rem;">
        <h1 style="margin-bottom: 1rem;">My Tasks</h1>
        <!-- Filtros -->
        <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
          <select v-model="taskFilters.status" style="padding: 0.3rem; border-radius: 5px;">
            <option value="">All Status</option>
            <option value="To-Do">Pendiente</option>
            <option value="Doing">En progreso</option>
            <option value="Done">Completada</option>
          </select>
          <input type="date" v-model="taskFilters.date" style="padding: 0.3rem; border-radius: 5px;" />
        </div>
        <!-- Lista de tareas -->
        <div v-if="filteredTasks.length">
          <div
              v-for="task in filteredTasks"
              :key="task.id"
              class="task-card"
              style="margin-bottom: 1rem; border-left: 4px solid #4CAF50; box-shadow: 0 2px 8px rgba(0,0,0,0.06); cursor:pointer;"
              @click="goToProject(task.projectId)"
          >
            <div class="title" style="display: flex; justify-content: space-between; align-items: center;">
              <span class="task-title" style="font-weight: bold;">{{ task.title }}</span>
              <span style="font-size: 0.9em; color: #888;">{{ task.state }}</span>
            </div>
            <div style="color: #555;">{{ task.description }}</div>
            <div style="font-size: 0.9em; color: #888;">
              Due: <i class="pi pi-calendar" style="color: #02513D; margin-right: 4px;"></i>{{ task.dueDate }}
            </div>
          </div>
        </div>
        <div v-else style="color: #888;">No tasks found.</div>
      </div>

    </div>

  </div>

  <!-- Se agrega Experiment card feature-->


</template>

<style scoped>

.content {
  padding:30px;
}
.user-info {
  width: 50%;
  justify-content:center;
  margin-right: 10%;
  flex-direction: column;
}
.user-info p, h2 {
  margin-bottom: 12px;
}
.user-info p:last-child {
  margin-bottom: 0;
}
.edit-icon {
  color: #9f9f9f;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.editable {
}
.non-editable {
  color: #737373;
}
.editable:hover .edit-icon {
  opacity: 1;
  cursor: pointer;
}


.profile-wrapper i {
  border-bottom-left-radius: 8px;
}
.full-name-input input {
  margin-right: 10px;
  width: 47%;
}

.edit-button {
  border: 1px solid #FA8224;
  background-color: transparent;
  max-width: 180px;
  color: #FA8224;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  transition: background-color 0.3s;
}

.edit-button:hover {
  background-color: #FA8224;
  color: white;
}

.form__update-profile {
  padding: .7rem;
  font-family: "Poppins", sans-serif;
}

.form__update-profile input {
  padding: 0.4rem;
  border-radius: 10px;
  outline: none;
  resize: none;
  border: 1px solid #DDDDDD;
}

.avatar-wrapper {
  width: 100%;
  height: auto;
  display: flex;
  align-items:center;
  justify-content: center;
}
.avatar-image {
  width: 300px;
  height: 350px;
  position:relative;
}
img {
  width:100%;
  display:block;
  margin:auto;
}
.avatar-content {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  opacity: 0;
  transition: all .5s ease-in-out;
}
.avatar-content:hover{
  opacity: 1;
  cursor: pointer;
}
@media only screen and (max-width: 700px) {
  .profile-content {
    width: 100%;
    height: auto;
    flex-direction: column;
    align-items: center;
  }
  .user-info{
    width: 100%;
    margin-right: 0;
  }
}
@media only screen and (max-width: 800px) {
  .full-name-input input {
    width: 100%;
    margin-right: 0;
  }

  .user-info p,
  h2 {
    margin-bottom: 0.5rem;
  }

  .editable p {
    margin-right: 0.5rem;
  }

  .edit-button {
    margin-top: 1rem;
  }
}

.team-code-row {
  display: flex;
  align-items: center;
  gap: .5rem;
  flex-wrap: wrap;
}

.team-code-badge {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
  "Courier New", monospace;
  background: #F3F4F6;
  padding: .2rem .5rem;
  border-radius: 6px;
}

.team-code-actions {
  display: flex;
  align-items: center;
}

.btn-inline {
  max-width: none;
  margin-left: 0;
  padding: 6px 12px;
}

.ml-2 {
  margin-left: .5rem;
}

.icon-left {
  margin-right: .4rem;
}

.hint-text {
  display: block;
  margin-top: .25rem;
  color: #888;
}

@media (max-width: 640px) {
  .team-code-row {
    gap: .4rem;
  }
  .btn-inline {
    padding: 6px 10px;
  }
}
</style>