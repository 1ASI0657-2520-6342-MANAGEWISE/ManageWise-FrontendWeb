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
      <Dialog
          modal
          class="task-dialog-custom"
          v-model:visible="visible"
          :closeOnEscape="true"
          :dismissableMask="true"
          :closable="true"
          :style="{ width: '540px', maxWidth: '95vw' }"
      >
        <template #header>
          <div class="custom-dialog-header">
            <div class="header-content-wrapper">
              <div class="header-icon-wrapper">
                <i class="pi pi-plus-circle"></i>
              </div>
              <div class="header-text">
                <h2 class="header-title">Add New Task</h2>
                <p class="header-subtitle">Fill in the details below to create a new task</p>
              </div>
            </div>
          </div>
        </template>

        <form
            class="task-form-content"
            @submit.prevent="() => createTask('To-Do')"
            autocomplete="off"
        >
          <div class="form-field-group">
            <label for="title" class="field-label">
              <i class="pi pi-bookmark"></i>
              Title <span class="required-star">*</span>
            </label>
            <InputText
                id="title"
                class="field-input"
                autocomplete="off"
                v-model="newTask.title"
                placeholder="Enter task title"
                required
                aria-required="true"
            />
          </div>

          <div class="form-field-group">
            <label for="description" class="field-label">
              <i class="pi pi-align-left"></i>
              Description
            </label>
            <InputText
                id="description"
                class="field-input"
                autocomplete="off"
                v-model="newTask.description"
                placeholder="Add task description (optional)"
            />
          </div>

          <div class="form-field-group">
            <label for="assigned" class="field-label">
              <i class="pi pi-user"></i>
              Assigned To <span class="required-star">*</span>
            </label>
            <Dropdown
                id="assigned"
                class="field-dropdown"
                v-model="newTask.assignedID"
                :options="teamMembers"
                optionLabel="name"
                optionValue="id"
                placeholder="Select team member"
                required
                aria-required="true"
            />
          </div>

          <div class="form-field-group">
            <label for="due" class="field-label">
              <i class="pi pi-calendar"></i>
              Due Date <span class="required-star">*</span>
            </label>
            <Calendar
                id="due"
                v-model="newTask.due"
                :minDate="new Date()"
                :manualInput="false"
                class="field-calendar"
                placeholder="Select due date"
                dateFormat="dd/mm/yy"
                required
                aria-required="true"
            />
          </div>

          <div class="form-actions">
            <Button
                type="button"
                label="Cancel"
                severity="secondary"
                outlined
                class="btn-cancel"
                @click="visible = false"
            />
            <Button
                label="Add Task"
                type="submit"
                class="btn-submit"
                icon="pi pi-check"
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


:deep(.task-dialog-custom .p-dialog-header) {
  padding: 0 !important;
  border: none !important;
  background: linear-gradient(135deg, #fef3e7 0%, #fef9f3 100%) !important;
  border-radius: 1.2rem 1.2rem 0 0 !important;
  border-bottom: 2px solid #f3e8dc !important;
}

:deep(.task-dialog-custom .p-dialog-header-icons) {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 10;
}

:deep(.task-dialog-custom .p-dialog-header-icon) {
  width: 2.5rem !important;
  height: 2.5rem !important;
  color: #6b7280 !important;
  background: transparent !important;
  border-radius: 0.5rem !important;
  transition: all 0.2s ease !important;
}

:deep(.task-dialog-custom .p-dialog-header-icon:hover) {
  background: rgba(255, 255, 255, 0.4) !important;
  color: #374151 !important;
}

:deep(.task-dialog-custom .p-dialog-content) {
  padding: 0 !important;
  background: #fff;
  border-radius: 0 0 1.2rem 1.2rem;
}

.custom-dialog-header {
  padding: 2.4rem 2rem 2.2rem 2rem;
  background: transparent;
  border-bottom: none;
}

.header-content-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 1.2rem;
}

.header-icon-wrapper {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, #FA8224, #ff9d4d);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(250, 130, 36, 0.25);
  flex-shrink: 0;
}

.header-icon-wrapper i {
  color: #fff;
  font-size: 1.6rem;
}

.header-text {
  flex: 1;
  padding-top: 0.2rem;
}

.header-title {
  font-family: 'Lora', serif;
  font-size: 1.85rem;
  font-weight: 700;
  color: #FA8224;
  margin: 0 0 0.4rem 0;
  letter-spacing: 0.3px;
}

.header-subtitle {
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0;
  font-weight: 400;
  line-height: 1.4;
}

.task-form-content {
  padding: 2rem 2rem 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-field-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.field-label i {
  color: #FA8224;
  font-size: 0.95rem;
}

.required-star {
  color: #FA8224;
  font-weight: 700;
  margin-left: 0.15rem;
}

.field-input,
.field-dropdown,
.field-calendar {
  width: 100%;
  border: 2px solid #e3e8ee;
  border-radius: 0.7rem;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #fff;
}

.field-input:focus,
.field-dropdown:focus,
.field-calendar:focus {
  border-color: #FA8224;
  box-shadow: 0 0 0 3px rgba(250, 130, 36, 0.1);
  outline: none;
}

.field-input::placeholder {
  color: #9ca3af;
}

:deep(.field-dropdown .p-dropdown-label) {
  padding: 0.8rem 1rem;
}

:deep(.field-dropdown .p-dropdown-trigger) {
  color: #FA8224;
}

:deep(.field-calendar input) {
  border: none;
  padding: 0;
  font-size: 1rem;
}

:deep(.field-calendar .p-datepicker-trigger) {
  color: #FA8224;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e3e8ee;
}

.btn-cancel {
  flex: 1;
  padding: 0.85rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.7rem;
  border: 2px solid #e3e8ee;
  color: #374151;
  background: #fff;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
  color: #1f2937;
}

.btn-submit {
  flex: 1;
  padding: 0.85rem 1.5rem;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 0.7rem;
  background: linear-gradient(135deg, #FA8224, #ff9d4d);
  border: none;
  color: #fff;
  box-shadow: 0 4px 12px rgba(250, 130, 36, 0.25);
  transition: all 0.2s ease;
}

.btn-submit:hover {
  background: linear-gradient(135deg, #e8751f, #f08a3d);
  box-shadow: 0 6px 16px rgba(250, 130, 36, 0.35);
  transform: translateY(-1px);
}

.btn-submit:active {
  transform: translateY(0);
}

@media (max-width: 600px) {
  .custom-dialog-header {
    padding: 2rem 1.2rem 1.6rem 1.2rem;
  }

  .header-content-wrapper {
    gap: 1rem;
  }

  .header-icon-wrapper {
    width: 44px;
    height: 44px;
  }

  .header-icon-wrapper i {
    font-size: 1.3rem;
  }

  .header-title {
    font-size: 1.5rem;
  }

  .header-subtitle {
    font-size: 0.88rem;
  }

  .task-form-content {
    padding: 1.5rem 1.2rem 1.2rem 1.2rem;
    gap: 1.2rem;
  }

  .form-actions {
    flex-direction: column;
    gap: 0.8rem;
  }

  :deep(.task-dialog-custom .p-dialog-header-icons) {
    top: 1.2rem;
    right: 1.2rem;
  }
}
</style>