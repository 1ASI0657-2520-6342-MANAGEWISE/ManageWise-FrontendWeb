<script setup>
import { ref, onMounted, computed } from 'vue'
import columnC from './column.component.vue'
import { fetchTaskData, addTask } from '@/services/projects-api.services.js'
import { TaskEntity } from '@/models/task.entity.js'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Calendar from 'primevue/calendar'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import { useStore } from 'vuex'
import TeamMembersService from '@/services/team-members.service'

// id = projectId
const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const store = useStore()
const userRole = computed(() => store.state.user?.role || '')
const isTeamMember = computed(() => userRole.value === 'TeamMember')

const teamMembersService = new TeamMembersService()

const reload = ref(false)
const allTasks = ref([])
const loading = ref(false)

// diálogo para NUEVA tarea
const visible = ref(false)
const newTask = ref(new TaskEntity())

// lista de miembros de equipo (id + name)
const teamMembers = ref([])

// proyecto seleccionado (para mostrar card arriba)
const project = computed(() => store.state.selectedProject)

// ---------- CARGA DE TAREAS ----------
const fetchTasks = async () => {
  loading.value = true
  allTasks.value = await fetchTaskData(props.id)
  loading.value = false
}

// ---------- CARGA DE TEAM MEMBERS ----------
const fetchTeamMembers = async () => {
  try {
    const members = await teamMembersService.getMembers(store.state.user.companyId)
    console.log('fetchTeamMembers members:', members)

    if (Array.isArray(members)) {
      teamMembers.value = members.map(m => ({
        id: m.id,
        name: m.name
      }))
    } else {
      console.error('TeamMembers NO es un array:', members)
      teamMembers.value = []
    }
  } catch (error) {
    console.error('Error fetching team members:', error)
    teamMembers.value = []
  }
}

onMounted(async () => {
  await fetchTasks()
  await fetchTeamMembers()
})

// ---------- UTILIDADES ----------
const getTasksByState = (state) => {
  return allTasks.value.filter(task => task.state === state)
}

const addsTask = () => {
  // reset de la entidad
  newTask.value = new TaskEntity()
  visible.value = true
}

// Crear tarea nueva
const createTask = async (stateColumn) => {
  if (!newTask.value.title || !newTask.value.assignedID || !newTask.value.due) {
    alert('Por favor, ingrese el título, el asignado y la fecha de vencimiento para la nueva tarea.')
    return
  }

  try {
    const taskPayload = {
      title: newTask.value.title,
      description: newTask.value.description,
      // el service usa "due" y "assignedID" y allí los mapea a dueDate / assigneeId
      due: newTask.value.due.toISOString().split('T')[0],
      state: stateColumn || 'To-Do',
      assignedID: newTask.value.assignedID
    }

    await addTask(props.id, taskPayload)
    newTask.value = new TaskEntity()
    visible.value = false
    await fetchTasks()
  } catch (error) {
    console.error('Error al agregar el proyecto:', error.response?.data || error)
    alert('Error al agregar el proyecto: ' + (error.response?.data || error))
  }
}

// recargar todo (se usa cuando se elimina/edita desde card)
const handleUpdateAll = () => {
  fetchTasks()
}

// cuando una card emite que fue movida
const handleTaskMoved = (updatedTask) => {
  const idx = allTasks.value.findIndex(t => t.id === updatedTask.id)
  if (idx !== -1) {
    allTasks.value[idx] = { ...allTasks.value[idx], ...updatedTask }
  } else {
    allTasks.value.push(updatedTask)
  }
}
</script>

<template>
  <section class="board-bg">
    <div class="board-container">
      <!-- HEADER CON PROYECTO + TÍTULO Y BOTÓN -->
      <header class="board-header">
        <div v-if="project" class="project-summary-card modern">
          <img
              v-if="project.imageUrl && project.imageUrl[0]"
              :src="project.imageUrl[0]"
              alt="Project image"
              class="project-summary-img"
          />
          <div class="project-summary-info">
            <h1 class="title-projects">{{ project.name }}</h1>
            <p class="project-summary-desc">{{ project.description }}</p>
            <div class="project-summary-meta">
              <span v-if="project.projectDate" class="meta-item">
                <i class="pi pi-calendar"></i> {{ project.projectDate }}
              </span>
              <span v-if="project.projectLocation" class="meta-item">
                <i class="pi pi-map-marker"></i> {{ project.projectLocation }}
              </span>
              <span v-if="project.audit" class="meta-item">
                <i class="pi pi-clock"></i> Audit: {{ project.audit }}
              </span>
            </div>
          </div>
        </div>

        <div class="board-header-actions">
          <h3 class="subtitle">Tareas asignadas</h3>
          <Button
              v-if="!isTeamMember"
              class="add-task modern"
              @click="addsTask"
          >
            <i class="pi pi-plus-circle" style="margin-right:0.5rem;"></i>
            Nueva tarea
          </Button>
        </div>
      </header>

      <!-- DIALOG NUEVA TAREA -->
      <Dialog modal class="p-dialog" v-model:visible="visible" :closeOnOutsideClick="true">
        <form
            class="modern-task-dialog flex-dialog"
            @submit.prevent="() => createTask('To-Do')"
            autocomplete="off"
        >
          <div class="dialog-header">
            <span class="dialog-icon"><i class="pi pi-plus-circle"></i></span>
            <div>
              <h2 class="dialog-title">Add New Task</h2>
              <p class="dialog-sub">Fill in the details below to create a new task.</p>
            </div>
          </div>

          <div class="dialog-fields">
            <div class="dialog-field">
              <label for="title" class="dialog-label">Title</label>
              <InputText
                  id="title"
                  class="dialog-input"
                  autocomplete="off"
                  v-model="newTask.title"
                  placeholder="Task title"
                  required
                  aria-required="true"
              />
            </div>

            <div class="dialog-field">
              <label for="description" class="dialog-label">Description</label>
              <InputText
                  id="description"
                  class="dialog-input"
                  autocomplete="off"
                  v-model="newTask.description"
                  placeholder="Task description"
              />
            </div>

            <div class="dialog-field">
              <label for="assigned" class="dialog-label">Employee Assigned</label>
              <Dropdown
                  id="assigned"
                  class="dialog-input"
                  v-model="newTask.assignedID"
                  :options="teamMembers"
                  optionLabel="name"
                  optionValue="id"
                  placeholder="Select employee"
                  required
                  aria-required="true"
              />
            </div>

            <div class="dialog-field">
              <label for="due" class="dialog-label">Due date</label>
              <Calendar
                  id="due"
                  v-model="newTask.due"
                  :minDate="new Date()"
                  :manualInput="false"
                  class="dialog-input"
                  placeholder="Select date"
                  required
                  aria-required="true"
              />
            </div>
          </div>

          <div class="dialog-actions">
            <Button
                type="button"
                label="Cancel"
                text
                @click="visible = false"
            />
            <Button
                label="Add Task"
                type="submit"
                class="dialog-add-btn"
            />
          </div>
        </form>
      </Dialog>

      <!-- COLUMNAS -->
      <div v-if="loading" class="loader-modern">Cargando tareas...</div>
      <main v-else class="columns-board">
        <columnC
            class="column-card"
            :tasks="getTasksByState('To-Do')"
            taskColumn="To-Do"
            :id="props.id"
            :reload="reload"
            :teamMembers="teamMembers"
            @updAll="handleUpdateAll"
            @taskMoved="handleTaskMoved"
        />
        <columnC
            class="column-card"
            :tasks="getTasksByState('Doing')"
            taskColumn="Doing"
            :id="props.id"
            :reload="reload"
            :teamMembers="teamMembers"
            @updAll="handleUpdateAll"
            @taskMoved="handleTaskMoved"
        />
        <columnC
            class="column-card"
            :tasks="getTasksByState('Done')"
            taskColumn="Done"
            :id="props.id"
            :reload="reload"
            :teamMembers="teamMembers"
            @updAll="handleUpdateAll"
            @taskMoved="handleTaskMoved"
        />
      </main>
    </div>
  </section>
</template>

<style scoped>
.board-bg {
  min-height: 100vh;
  background: linear-gradient(120deg, #f8fafc 60%, #e6f7f1 100%);
  padding: 0;
  box-sizing: border-box;
}
.board-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 2rem 1.5rem;
}
.board-header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2.2rem;
}
.board-header-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 0 0.5rem;
}
.subtitle {
  font-family: 'Lora', serif;
  color: #FA8224;
  font-weight: 700;
  font-size: 1.35rem;
  margin: 0;
}
.project-summary-card.modern {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px 0 rgba(2,81,61,0.10);
  padding: 2rem 2.5rem 2rem 2rem;
  min-height: 180px;
  border: 1.5px solid #e3e8ee;
}
.project-summary-img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 1.2rem;
  box-shadow: 0 2px 8px 0 rgba(2,81,61,0.10);
  background: #e6f7f1;
}
.project-summary-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.title-projects {
  font-family: 'Lora', serif !important;
  font-weight: 700 !important;
  letter-spacing: 1px;
  color: #FA8224;
  font-size: 2.2rem;
  margin-bottom: 0.2rem;
}
.project-summary-desc {
  color: #374151;
  font-size: 1.08rem;
  margin: 0.2rem 0 0.5rem 0;
  font-weight: 400;
}
.project-summary-meta {
  display: flex;
  gap: 1.5rem;
  margin-top: 0.2rem;
  color: #02513D;
  font-size: 1.01rem;
  align-items: center;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.add-task.modern {
  background: linear-gradient(135deg, #FA8224, #606e9bff);
  color: #fff;
  border-radius: 0.8rem;
  font-weight: 700;
  font-size: 1.08rem;
  box-shadow: 0 2px 8px 0 rgba(2,81,61,0.10);
  padding: 0.7rem 1.7rem;
  border: none;
  transition: background 0.2s, box-shadow 0.2s;
  outline: none;
  display: flex;
  align-items: center;
}
.add-task.modern:hover,
.add-task.modern:focus {
  background: linear-gradient(135deg, #c46116ff, #475583ff);
  box-shadow: 0 4px 16px 0 rgba(2,81,61,0.13);
}
.columns-board {
  display: flex;
  justify-content: space-between;
  gap: 2.5rem;
  background: none;
  border-radius: 1.5rem;
  padding: 0;
  flex-wrap: wrap;
}
.column-card {
  flex: 1 1 0;
  min-width: 320px;
  max-width: 420px;
  margin: 0 auto;
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 4px 16px 0 rgba(2,81,61,0.07);
  border: 1.5px solid #e3e8ee;
  padding: 1.2rem 1rem 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  min-height: 500px;
}
.loader-modern {
  text-align: center;
  margin: 2.5rem 0;
  color: #cf844aff;
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}
@media (max-width: 1200px) {
  .columns-board {
    flex-direction: column;
    gap: 2rem;
  }
  .column-card {
    max-width: 98vw;
    min-width: 0;
  }
}
@media (max-width: 700px) {
  .project-summary-card.modern {
    flex-direction: column;
    align-items: center;
    padding: 1.2rem 0.7rem;
    gap: 1.2rem;
  }
  .project-summary-img {
    width: 90px;
    height: 90px;
  }
  .board-container {
    padding: 1rem 0.2rem 1rem 0.2rem;
  }
}
@media (max-width: 500px) {
  .board-bg {
    padding: 0.5rem 0 1rem 0;
  }
}
</style>
