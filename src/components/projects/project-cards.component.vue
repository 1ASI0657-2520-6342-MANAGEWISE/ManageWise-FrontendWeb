<template>
  <section class="flex h-full flex-column p-3 lg:p-5 lg:pb-0 widthsec">
    <h1 class="title-projects text-4xl font-medium">Projects</h1>
    <br>
    <h3 class="subtitle font-medium">Current Projects:</h3>
    <div class="all">
      <div class="project-cards">
        <!-- Paginador visual -->
        <Paginator
          :rows="pageSize"
          :totalRecords="projects.length"
          :first="first"
          @page="onPageChange"
          class=" w-full"
          template="PrevPageLink PageLinks NextPageLink"
        />
        <!-- Mostrar proyectos paginados con el componente CardsComponent -->
        <cards-component v-for="(project, index) in paginatedProjects" :key="project.id || index" :project="project"/>

        <!-- Botón para agregar un nuevo proyecto -->
        <div class="add-project">
          <Button label="+" class="addBut" @click="showAddProjectDialog" aria-label="Add new project"/>
        </div>

        <!-- Diálogo para agregar un nuevo proyecto -->
        <Dialog 
          modal 
          class="p-dialog modern-dialog" 
          v-model:visible="visible" 
          :closable="true"
          :dismissableMask="true"
          @hide="onDialogHide"
          :aria-modal="true"
          aria-labelledby="add-project-title"
        >
          <div class="dialog-content">
            <h2 id="add-project-title" class="dialog-title">Add your project</h2>
            <span class="dialog-subtitle">Add your project info.</span>
            <div v-if="Errors.length" class="error-list mb-3">
              <b>Please correct the following error(s):</b>
              <ul>
                <li v-for="error in Errors" :key="error">{{ error }}</li>
              </ul>
            </div>
            <!-- Campos para ingresar información del nuevo proyecto -->
            <div class="form-group">
              <label for="name" class="form-label">Name</label>
              <InputText id="name" ref="nameInput" class="form-input" autocomplete="off" v-model="newProject.name" aria-required="true" placeholder="Project name"/>
            </div>
            <div class="form-group">
              <label for="image" class="form-label">Image URL</label>
              <InputText id="image" class="form-input" autocomplete="off" v-model="newProject.image" aria-required="true" placeholder="https://..."/>
            </div>
            <div class="form-group">
              <label for="description" class="form-label">Description</label>
              <textarea id="description" class="form-input textarea" autocomplete="off" v-model="newProject.description" rows="4"
                        cols="50" name="description-area" aria-required="true" placeholder="Describe your project..."/>
            </div>
            <!-- Botón para agregar el nuevo proyecto -->
            <div class="dialog-actions">
              <Button type="submit" label="Add" @click="checkForm" class="add-btn"/>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  </section>
</template>

<script setup>
import {ref, computed, onMounted, watch, nextTick} from 'vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Paginator from 'primevue/paginator';
import CardsComponent from '@/components/projects/card.component.vue';
import {ProjectsEntity} from "@/models/projects.entity.js";
import {fetchProjects, addProject} from "@/services/projects-api.services.js";

const visible = ref(false);
const projects = ref([]);
const newProject = ref({ name: '', image: '', description: '' });
const Errors = ref([]);
const nameInput = ref(null);

// Paginación
const pageSize = 6; // Proyectos por página
const first = ref(0); // Índice del primer proyecto en la página actual
const paginatedProjects = computed(() => {
  return projects.value.slice(first.value, first.value + pageSize);
});
const onPageChange = (event) => {
  first.value = event.first;
};

// Persistencia del estado del diálogo y del formulario
const DIALOG_KEY = 'addProjectDialogOpen';
const FORM_KEY = 'addProjectFormData';

// Restaurar estado del diálogo y formulario si corresponde
onMounted(() => {
  const dialogOpen = localStorage.getItem(DIALOG_KEY);
  if (dialogOpen === 'true') {
    visible.value = true;
    const savedForm = localStorage.getItem(FORM_KEY);
    if (savedForm) {
      Object.assign(newProject.value, JSON.parse(savedForm));
    }
  }
  // get the user of local storage
  const user = JSON.parse(localStorage.getItem('user'));
  getProjects(user?.companyId);
});

// Persistir estado del diálogo y formulario
watch(visible, (val) => {
  localStorage.setItem(DIALOG_KEY, val ? 'true' : 'false');
  if (val) {
    // Focus automático al abrir
    nextTick(() => {
      nameInput.value?.$el?.focus?.();
    });
  }
});
watch(newProject, (val) => {
  localStorage.setItem(FORM_KEY, JSON.stringify(val));
}, { deep: true });

const checkForm = () => {
  Errors.value = [];
  if (!newProject.value.name || !newProject.value.image || !newProject.value.description) {
    Errors.value.push('Fill the Form [Title, Image, Description]');
  }
  projects.value.forEach((project) => {
    if (project.name.toUpperCase() === newProject.value.name.toUpperCase()) {
      Errors.value.push('This Project Already Exists');
    }
  });
  if (Errors.value.length === 0){
    createProject();
  }
}

const getProjects = (companyId) => {
  fetchProjects(companyId)
      .then(data => {
        projects.value = data;
        // Reiniciar paginación si hay menos proyectos en la nueva lista
        if (first.value >= data.length) {
          first.value = 0;
        }
      })
      .catch(error => {
        console.error('Error al obtener datos de la API:', error);
      });
};

const showAddProjectDialog = () => {
  visible.value = true;
};

const onDialogHide = () => {
  // Limpiar solo si se agregó correctamente o el usuario cierra manualmente
  clearForm();
};

const clearForm = () => {
  newProject.value.name = '';
  newProject.value.image = '';
  newProject.value.description = '';
  Errors.value = [];
  localStorage.removeItem(FORM_KEY);
};

const createProject = async () => {
  if (!newProject.value.name || !newProject.value.image || !newProject.value.description) {
    Errors.value = ['Please fill all fields.'];
    return;
  }
  const user = ref(JSON.parse(localStorage.getItem('user')));
  try {
    const now = new Date();
    const projectData = {
      name: newProject.value.name,
      description: newProject.value.description,
      imageUrl: [newProject.value.image],
      companyId: user.value?.companyId,
      projectDate: now.toISOString().split('T')[0],
      projectTime: now.toTimeString().split(' ')[0],
      projectLocation: 'Lima, Peru',
    };
    const addedProject = await addProject(projectData);
    projects.value.push({
      id: addedProject.id,
      name: addedProject.name,
      image: addedProject.image,
      description: addedProject.description,
    });
    clearForm();
    visible.value = false;
  } catch (error) {
    console.error('Error al agregar el proyecto:', error);
    Errors.value = ['Error adding project. Please try again.'];
  }
};
</script>

<style scoped>
.title-projects {
  font-family: 'Lora', serif;
  color: #02513D;
  font-weight: 600 !important;
  letter-spacing: 1.05px;
}
.project-cards {
  display: flex;
  flex-wrap: wrap;
  height: auto;
  width: 100%;
  gap: 2rem;
  justify-content: space-between;
}
.add-project {
  width: 20%;
  transition: transform 0.3s ease;
  display: flex;
}

.add-project:hover {
  cursor: pointer;
  transform: scale(1.02);
}

.addBut {
  width: 100%;
  height: 12rem;
  object-fit: cover;
  background-color: rgba(2, 81, 61, 0.4);
  color: #02513D;
  font-size: 6vh;
  font-weight: lighter;
  transition: background 0.2s, color 0.2s;
}
.addBut:focus {
  outline: 2px solid #02513D;
  background: #e6f4f1;
}
.error-list {
  color: #b91c1c;
  background: #fee2e2;
  border-radius: 8px;
  padding: 0.5rem 1rem;
}
.all {
  height: 100%;
}
@media (max-width: 768px) {
  .add-project {
    width: 100%;
  }
}
.title {
  font-family: 'Lora', serif;
  color: #02513D;
  font-weight: 600 !important;
}
.subtitle {
  font-family: 'Lora', serif;
  font-size: 2vh;
  color: #02513D;
  font-weight: bold;
}
.modern-dialog .p-dialog-content {
  background: #f8fafc;
  border-radius: 18px;
  box-shadow: 0 8px 32px 0 rgba(2,81,61,0.18);
  padding: 0;
}
.dialog-content {
  padding: 2.5rem 2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.dialog-title {
  font-family: 'Lora', serif;
  color: #02513D;
  font-size: 2.1rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
  letter-spacing: 0.5px;
}
.dialog-subtitle {
  color: #4b5563;
  font-size: 1.1rem;
  margin-bottom: 0.7rem;
  font-weight: 400;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.form-label {
  font-weight: 600;
  color: #02513D;
  margin-bottom: 0.1rem;
  font-size: 1rem;
}
.form-input {
  border-radius: 10px;
  border: 1.5px solid #d1d5db;
  padding: 0.7rem 1rem;
  font-size: 1.08rem;
  background: #fff;
  transition: border 0.2s, box-shadow 0.2s;
  outline: none;
}
.form-input:focus {
  border: 1.5px solid #02513D;
  box-shadow: 0 0 0 2px #c7f5e7;
}
.textarea {
  min-height: 90px;
  resize: vertical;
}
.dialog-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.2rem;
}
.add-btn {
  background-color: #02513D !important;
  color: #fff !important;
  border-radius: 10px !important;
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  padding: 0.7rem 2.2rem !important;
  box-shadow: 0 2px 8px 0 rgba(2,81,61,0.10);
  transition: background 0.18s, box-shadow 0.18s;
}
.add-btn:hover, .add-btn:focus {
  background: #03795a !important;
  box-shadow: 0 4px 16px 0 rgba(2,81,61,0.13);
}
</style>