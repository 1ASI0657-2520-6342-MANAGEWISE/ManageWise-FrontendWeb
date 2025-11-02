<script setup>
import { ref, computed } from 'vue'
import Card from 'primevue/card'
import Task from './task.component.vue'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import { addTask } from '@/services/projects-api.services.js'
import { TaskEntity } from '@/models/task.entity.js'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Calendar from "primevue/calendar"
import { useStore } from 'vuex'

const store = useStore()
const userRole = computed(() => store.state.user?.role || '')
const isTeamMember = computed(() => userRole.value === 'TeamMember')

const state = ref({
  newTask: ref(new TaskEntity()),
})

const visible = ref(false)
const emits = defineEmits(['updAll'])

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  taskColumn: {
    type: String,
    required: true,
  },
  tasks: {
    type: Array,
    required: true,
  },
  reload: {
    type: Boolean,
    required: true,
  },
})

function cambiarColor(taskColumn) {
  switch (taskColumn) {
    case 'To-Do':
      return 'linear-gradient(135deg, #f8fafc 0%, #ffe5e5 100%)';
    case 'Doing':
      return 'linear-gradient(135deg, #f8fafc 0%, #fff7e5 100%)';
    case 'Done':
      return 'linear-gradient(135deg, #f8fafc 0%, #e5f7ff 100%)';
    default:
      return '';
  }
}

const createTask = async () => {
  if (!state.value.newTask.title || !state.value.newTask.assignedID || !state.value.newTask.due) {
    alert('Por favor, ingrese el título, el asignado y la fecha de vencimiento para la nueva tarea.')
    return
  }
  try {
    const TaskData = {
      title: state.value.newTask.title,
      description: state.value.newTask.description,
      assigned: state.value.newTask.assignedID,
      due: state.value.newTask.due.toISOString().split('T')[0],
      state: props.taskColumn,
    }
    await addTask(props.id, TaskData)
    emits('updAll')
    state.value.newTask.title = ''
    state.value.newTask.description = ''
    state.value.newTask.assignedID = 0
    state.value.newTask.due = ''
    visible.value = false
  } catch (error) {
    console.error('Error al agregar el proyecto:', error.response?.data || error)
    alert('error al agregar el proyecto:' + (error.response?.data || error))
  }
}

const addsTask = () => {
  visible.value = true
}

// Nueva función para actualizar tareas localmente al mover
function onTaskMoved(updatedTask) {
  // Buscar y actualizar la tarea en el array de tasks
  const idx = props.tasks.findIndex(t => t.id === updatedTask.id);
  if (idx !== -1) {
    // Si la tarea ya no pertenece a esta columna, la quitamos
    if (updatedTask.state !== props.taskColumn) {
      props.tasks.splice(idx, 1);
    } else {
      // Si sigue en la columna, solo actualizamos
      props.tasks[idx] = { ...props.tasks[idx], ...updatedTask };
    }
  } else if (updatedTask.state === props.taskColumn) {
    // Si la tarea fue movida a esta columna, la agregamos
    props.tasks.push(updatedTask);
  }
}
</script>

<template>
  <div class="project-card enhanced-column">
    <Card class="p-card vista" :style="{ background: cambiarColor(props.taskColumn) }">
      <template #title>
        <h3 class="column-title" :class="props.taskColumn.toLowerCase()">{{ props.taskColumn }}</h3>
      </template>
      <template #content>
        <div class="overflow">
          <Task v-for="(task, index) in props.tasks" :key="index"
                :title="task.title" :description="task.description" :assigned="task.assigneeName" :assignedID="task.assigneeId"
                :due="task.dueDate" :id="task.id" :projectId="props.id"
                @taskDel="emits('updAll')"
                @taskMoved="onTaskMoved"
                :state="props.taskColumn"/>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.column-title {
  text-align: center;
  font-weight: 600;
  font-size: 1.25rem;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.column-title.todo {
  color: #d7263d;
}
.column-title.doing {
  color: #fbbf24;
}
.column-title.done {
  color: #059669;
}

.p-card {
  width: 100%;
  padding: 1.5rem;
  height: 100%;
  border-radius: 1rem;
  background: #f8fafc;
  box-shadow: 0 4px 24px 0 rgba(2,81,61,0.07);
  border: 2.5px solid #e3e8ee;
}

.enhanced-column {
  background: linear-gradient(135deg, #f0f4f8 0%, #e9f7ef 100%);
  border-radius: 1.2rem;
  padding: 1.2rem 0.5rem 1.5rem 0.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 16px 0 rgba(2,81,61,0.06);
}

.add-task {
  width: 100%;
  background-color: #02513D;
  color: #fff;
  justify-content: center;
  border-radius: 8px;
  transition: background 0.2s;
  font-weight: 600;
  font-size: 1.05rem;
  box-shadow: 0 2px 8px 0 rgba(2,81,61,0.08);
}
.add-task:hover {
  background-color: #038c5a;
}

.overflow {
  padding-top: 1rem;
  overflow-y: auto;
  height: 46vh;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.overflow > * {
  transition: box-shadow 0.2s, background 0.2s;
}
.overflow > *:hover {
  background: #e6f7f1;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(2,81,61,0.10);
}


.dialog-content {
  padding: 1.5rem 0.5rem 0.5rem 0.5rem;
  border-radius: 1rem;
  background: #fff;
  width: 100%;
}

.project-card {
  width: 30%;
  max-width: 420px;
  min-width: 260px;
}

@media (max-width: 1028px) {
  .project-card {
    width: 100%;
    height: auto;
  }
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  opacity: 1;
  box-shadow: none;
}
::-webkit-scrollbar-thumb:hover {
  box-shadow: none;
  border-radius: 10px;
  opacity: 1;
}
::-webkit-scrollbar-track {
  background-color: rgba(0, 138, 102, 0);
  box-shadow: none;
  opacity: 1;
  border-radius: 10px;
}
::-webkit-scrollbar-track-piece {
  background-color: rgba(0, 138, 102, 0);
  opacity: 1;
  box-shadow: none;
  border-radius: 10px;
}
::-webkit-scrollbar {
  width: 0.2rem;
  opacity: 1;
  box-shadow: none;
  border-radius: 10px;
}
</style>