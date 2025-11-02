<script>
import {UserService} from "@/services/user.service.js";
import {mapState} from "vuex";
import {fetchAllTaskDataByUserId} from "@/services/projects-api.services.js";

export default {
  name: "ProfileContent",
  computed: {
    user() {
      return this.$store.state.user;
    },
    filteredTasks() {
    return this.tasks
      .filter(task => !this.taskFilters.status || task.status === this.taskFilters.status)
      .filter(task => !this.taskFilters.date || task.dueDate === this.taskFilters.date);
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
      this.editField = {
        fullName: false,
        email: false,
        age: false,
        phone: false,
        occupation: false,
        bio: false,
        profileImg: false
      };
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

        this.clearInputUpdateInfo(); // limpamos el form luego de enviado
        this.togglePopUp(); // cerramos el popap >.<
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

      // verificamos si los campos de entrada están vacíos
      if (((!this.inputUpdateInfo.firstName || !this.inputUpdateInfo.lastName) && this.editField['fullName'])|| (!this.inputUpdateInfo.age && this.editField['age']) || (!this.inputUpdateInfo.phone && this.editField['phone']) || (!this.inputUpdateInfo.occupation && this.editField['occupation']) || (!this.inputUpdateInfo.bio && this.editField['bio']) || (!this.inputUpdateInfo.profileImg && this.editField['profileImg'])
      ) {
        this.isFieldsEmpty = true;
        return;
      }

      // si no se ha dado click en el lapiz para editar el campo, se le asigna el valor actual del usuario
      if (!this.editField['fullName']) {
        this.user.name = this.inputUpdateInfo.firstName + " " + this.inputUpdateInfo.lastName;
        
      }
      if (!this.editField['email']) {
        this.inputUpdateInfo.email = this.user.email;
      }
      if (!this.editField['age']) {
        this.inputUpdateInfo.age = this.user.age;
      }
      if (!this.editField['phone']) {
        this.inputUpdateInfo.phone = this.user.phone;
      }
      if (!this.editField['occupation']) {
        this.inputUpdateInfo.occupation = this.user.occupation;
      }
      if (!this.editField['bio']) {
        this.inputUpdateInfo.bio = this.user.bio;
      }
      if (!this.editField['profileImg']) {
        this.inputUpdateInfo.profileImg = this.user.profileImg;
      }

      // usamos el spread operator "..." para planchar la data del form en el estado user
      // , ademas incluyendo el id que recibimos por parametro de la ruta
      const newUser = {
        ...this.user,
        ...this.inputUpdateInfo,
        id: this.$route.params.id
      };

      const response = this.userService.updateUser(newUser);
      response.then((data) => {
        console.log('data', data)
        const user = data;
        this.$store.dispatch('updateUser', user);

        this.clearInputUpdateInfo(); // limpamos el form luego de enviado
        this.togglePopUp(); // cerramos el popap >.<
      })
      .catch((error) => {
        console.error('Error al actualizar el usuario:', error);
      });

    },
    async fetchUserTasks() {
    // Reemplaza esto por tu servicio real
    const allTasks = await fetchAllTaskDataByUserId(1,this.user.id);
    this.tasks = allTasks;
  },
  goToProject(projectId) {
  this.$router.push({ name: 'projectTodo', params: { id: projectId } });  }

  },
  
  mounted() {
  this.fetchUserTasks();
}

}


</script>

<template>
  <div class="content">
    <div class="profile-content flex">
      <form class="flex user-info form__update-profile" @submit.prevent="updateProfile">
        <h2>{{user.firstName + " " + user.lastName}}'s profile:</h2>

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

        <p class="editable flex gap-2"><strong>Phone: </strong>
          <span v-if="!editField['phone'] && user.phone === ''">No info to display</span>
          <span v-if="!editField['phone']">{{ user.phone}} </span>
          <input v-else type="text" placeholder="Phone" v-model="inputUpdateInfo['phone']" >
          <i v-if="!editField['phone'] && showPopUp" class="pi pi-pencil edit-icon" @click="toggleEditField('phone')"></i>
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
<div class="container-for-task" v-if="this.$store.state.user.role !== 'Manager'">
  <div class="user-tasks" style="margin-top: 2rem;">
    <h1 style="margin-bottom: 1rem;">My Tasks</h1>
    <!-- Filtros -->
    <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
      <select v-model="taskFilters.status" style="padding: 0.3rem; border-radius: 5px;">
        <option value="">All Status</option>
        <option value="Pendiente">Pendiente</option>
        <option value="En progreso">En progreso</option>
        <option value="Completada">Completada</option>
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
          <span style="font-size: 0.9em; color: #888;">{{ task.status }}</span>
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
  border: 1px solid #02513D;
  background-color: transparent;
  max-width: 180px;
  color: #02513D;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  transition: background-color 0.3s;
}

.edit-button:hover {
  background-color: #02513D;
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




</style>
