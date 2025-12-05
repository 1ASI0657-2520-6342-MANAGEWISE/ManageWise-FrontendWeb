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
const teamMembers = ref([])   // <--- importante
const project = computed(() => store.state.selectedProject)

const fetchTasks = async () => {
  loading.value = true
  allTasks.value = await fetchTaskData(props.id)
  loading.value = false
}

const emit = defineEmits(['updAll'])

const handleUpdateAll = () => {
  fetchTasks()
}

onMounted(async () => {
  await fetchTasks()
  await fetchTeamMembers()
})

const fetchTeamMembers = async () => {
  try {
    const members = await teamMembersService.getMembers(store.state.user.companyId)
    console.log('fetchTeamMembers members:', members)

    if (Array.isArray(members)) {
      teamMembers.value = members.map(member => ({
        id: member.id,
        name: member.name
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

const getTasksByState = (state) =>
    allTasks.value.filter(task => task.state === state)

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
  allTasks.value = allTasks.value.map(t =>
      t.id === updatedTask.id ? { ...t, ...updatedTask } : t
  )
}
</script>

<template>
  <section class="board-bg">
    <div class="board-container">

      <Dialog modal:true class="p-dialog" v-model:visible="visible" :closeOnOutsideClick="true">
      </Dialog>

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