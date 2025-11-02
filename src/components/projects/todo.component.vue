<script setup>
import { ref, onMounted,computed } from 'vue'
import columnC from './column.component.vue'
import { fetchTaskData, addTask } from '@/services/projects-api.services.js'
import { TaskEntity } from '@/models/task.entity.js'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Calendar from 'primevue/calendar'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import { useStore } from 'vuex'
import { UserService } from '@/services/user.service'
import TeamMembersService from '@/services/team-members.service'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})
const store = useStore()
const userRole = computed(() => store.state.user?.role || '')
const isTeamMember = computed(() => userRole.value === 'TeamMember')

const teamMembersService = new TeamMembersService()

const reload = ref(false)
const allTasks = ref([])
const loading = ref(false)
const visible = ref(false)
const newTask = ref(new TaskEntity())
const teamMembers = ref([])
const project = computed(() => store.state.selectedProject)

const fetchTasks = async () => {
  loading.value = true
  allTasks.value = await fetchTaskData(props.id)
  loading.value = false
}

const emit = defineEmits(['updAll'])

const handleUpdateAll = () => {
  // Solo recargar tareas si es estrictamente necesario (por ejemplo, tras crear/eliminar una tarea)
  fetchTasks()
}

onMounted(async () => {
  await fetchTasks()
  await fetchTeamMembers()
})

const fetchTeamMembers = async () => {

  await teamMembersService.getMembers(store.state.user.companyId)
    .then(response => {
      if (response && response.data) {
        teamMembers.value = response.data.map(member => ({
          id: member.id,
          name: member.name
        }))
      } else {
        console.error('Error fetching team members:', response)
      }
    })
    .catch(error => {
      console.error('Error fetching team members:', error)
    })
}

const getTasksByState = (state) => {
  return allTasks.value.filter(task => task.state === state)
}

const addsTask = () => {
  visible.value = true
}

const createTask = async (stateColumn) => {
  if (!newTask.value.title || !newTask.value.assignedID || !newTask.value.due) {
    alert('Por favor, ingrese el título, el asignado y la fecha de vencimiento para la nueva tarea.')
    return
  }
  try {
    const TaskData = {
      title: newTask.value.title,
      description: newTask.value.description,
      assigned: newTask.value.assignedID,
      due: newTask.value.due.toISOString().split('T')[0],
      state: stateColumn || 'To-Do',
    }
    await addTask(props.id, TaskData)
    newTask.value = new TaskEntity()
    visible.value = false
    fetchTasks()
  } catch (error) {
    console.error('Error al agregar el proyecto:', error.response?.data || error)
    alert('error al agregar el proyecto:' + (error.response?.data || error))
  }
}

const handleTaskMoved = (updatedTask) => {
  // Actualiza el estado local de las tareas sin recargar todo
  const prevState = allTasks.value.find(t => t.id === updatedTask.id)?.state;
  if (prevState && prevState !== updatedTask.state) {
    // Quita la tarea del array y la vuelve a agregar actualizada (nuevo array para reactividad)
    allTasks.value = [...allTasks.value.filter(t => t.id !== updatedTask.id), { ...updatedTask }];
  } else {
    // Solo actualiza la tarea si no cambió de columna
    allTasks.value = allTasks.value.map(t => t.id === updatedTask.id ? { ...t, ...updatedTask } : t);
  }
};

</script>

<template>
  <section class="board-bg">
    <div class="board-container">
      <header class="board-header">
        <div v-if="project" class="project-summary-card modern">
          <img v-if="project.imageUrl && project.imageUrl[0]" :src="project.imageUrl[0]" alt="Project image" class="project-summary-img" />
          <div class="project-summary-info">
            <h1 class="title-projects">{{ project.name }}</h1>
            <p class="project-summary-desc">{{ project.description }}</p>
            <div class="project-summary-meta">
              <span v-if="project.projectDate" class="meta-item"><i class="pi pi-calendar"></i> {{ project.projectDate }}</span>
              <span v-if="project.projectLocation" class="meta-item"><i class="pi pi-map-marker"></i> {{ project.projectLocation }}</span>
              <span v-if="project.audit" class="meta-item"><i class="pi pi-clock"></i> Audit: {{ project.audit }}</span>
            </div>
          </div>
        </div>
        <div class="board-header-actions">
          <h3 class="subtitle">Tareas asignadas</h3>
          <Button v-if="!isTeamMember" class="add-task modern" @click="addsTask">
            <i class="pi pi-plus-circle" style="margin-right:0.5rem;"></i> Nueva tarea
          </Button>
        </div>
      </header>
      <Dialog modal:true class="p-dialog" v-model:visible="visible" :closeOnOutsideClick="true">
        <form class="modern-task-dialog flex-dialog" @submit.prevent="() => createTask('To-Do')" autocomplete="off">
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
              <InputText id="title" class="dialog-input" autocomplete="off" v-model="newTask.title" placeholder="Task title" required aria-required="true"/>
            </div>
            <div class="dialog-field">
              <label for="description" class="dialog-label">Description</label>
              <InputText id="description" class="dialog-input" autocomplete="off" v-model="newTask.description" placeholder="Task description" required aria-required="true"/>
            </div>
            <div class="dialog-field">
              <label for="assigned" class="dialog-label">Employee Assigned</label>
              <Dropdown id="assigned" class="dialog-input" v-model="newTask.assignedID" :options="teamMembers" optionLabel="name" optionValue="id" placeholder="Select employee" required aria-required="true"/>
            </div>
            <div class="dialog-field">
              <label for="calendar" class="dialog-label">Due date</label>
              <Calendar id="due" v-model="newTask.due" :minDate="new Date()" :manualInput="false" class="dialog-input" placeholder="Select date" required aria-required="true"/>
            </div>
          </div>
          <div class="dialog-actions">
            <Button label="Add Task" type="submit" class="dialog-add-btn"/>
          </div>
        </form>
      </Dialog>
      <div v-if="loading" class="loader-modern">Cargando tareas...</div>
      <main v-else class="columns-board">
        <columnC class="column-card" :tasks="getTasksByState('To-Do')" taskColumn="To-Do" :id="props.id" @updAll="handleUpdateAll" :reload="reload" @taskMoved="handleTaskMoved"/>
        <columnC class="column-card" :tasks="getTasksByState('Doing')" taskColumn="Doing" :id="props.id" @updAll="handleUpdateAll" :reload="reload" @taskMoved="handleTaskMoved"/>
        <columnC class="column-card" :tasks="getTasksByState('Done')" taskColumn="Done" :id="props.id" @updAll="handleUpdateAll" :reload="reload" @taskMoved="handleTaskMoved"/>
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
  color: #02513D;
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
  color: #02513D;
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
  background: linear-gradient(90deg, #02513D 60%, #038c5a 100%);
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
.add-task.modern:hover, .add-task.modern:focus {
  background: linear-gradient(90deg, #038c5a 60%, #02513D 100%);
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
  color: #02513D;
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
  .modern-task-dialog, .flex-dialog {
    max-width: 98vw;
    min-width: 0;
    padding: 1.2rem 0.5rem 1rem 0.5rem;
  }
  .board-bg {
    padding: 0.5rem 0 1rem 0;
  }
}
</style>