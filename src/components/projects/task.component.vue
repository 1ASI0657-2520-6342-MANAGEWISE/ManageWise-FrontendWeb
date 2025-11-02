<script setup>
import TieredMenu from "primevue/tieredmenu";
import Dialog from "primevue/dialog";
import Calendar from "primevue/calendar";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import {ref} from "vue";
import {deleteTask, editTask} from "@/services/projects-api.services.js";
import {TaskEntity} from "@/models/task.entity.js";

const props = defineProps({
  projectId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
   description: {
    type: String,
    required: true,
  },
  assigned: {
    type: String,
    required: true,
  },
  assignedID: {
    type: Number,
    required: true,
  },
  due: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
});
const toggle = (event) => {
  menu.value.toggle(event);
};

const emits = defineEmits(['taskDel', 'taskMoved']);


const taskDel = (projectId, id) => {
  console.log(`Deleted task in project ${projectId} with id: ${id}`);
  deleteTask(projectId, id).then(() => {
    emits('taskDel');
  }).then();
  // Aquí puedes agregar la lógica para eliminar la tarea
};

const editFunc = async (projectId, taskData) => {
  if (!thisTask.value.title || !thisTask.value.due || !thisTask.value.assigned) {
    alert('Por favor, ingrese el título, el asignado y la fecha.');
  } else {
    console.log(projectId, taskData);
    await editTask(projectId ,taskData).then(() => {
      visible.value = false;
    }).then(() => {
      emits('taskDel')
    });
  }


};

const resetTask = () => {
  thisTask.value = new TaskEntity(props.id, props.title, props.assigned, props.due, props.state, props.assignedID, props.description);
  console.log(thisTask.value, 'se reinicio');
};

const edit = async () => {
  visible.value = true;
  // Aquí puedes agregar la lógica para editar la tarea
};


const handleMove = (destination, data) => {
  console.log(`Moved to: ${destination}`);
  data.value.state = destination; // Cambia el state correctamente
  // Refleja el cambio en thisTask también
  thisTask.value.state = destination;
  editFunc(props.projectId, data.value);
  // Emitir el evento con la tarea actualizada y los campos correctos
  emits('taskMoved', { ...data.value });
};


const menu = ref();
const visible = ref(false);
const thisTask = ref(new TaskEntity(props.id, props.title, props.assigned, props.due, props.state, props.assignedID,props.description));

console.log(thisTask.value, 'se cargo');
console.log(props, 'se cargo props');

const items = ref([{
  label: 'Delete',
  icon: 'pi pi-trash',
  command() {

    taskDel(props.projectId, props.id);
  }
},
  {
    label: 'Edit',
    icon: 'pi pi-pen-to-square',
    command() {
      console.log(thisTask.value)
      edit();
    }
  },

  {
    separator: true
  },
  {
    label: 'Move',
    icon: 'pi pi-arrow-right-arrow-left',
    items: [
      {
        label: 'To Do',
        icon: 'pi pi-clock',
        command() {
          handleMove('To-Do', thisTask)
        }
      },
      {
        label: 'Doing',
        icon: 'pi pi-wrench',
        command() {
          handleMove('Doing', thisTask)
        }
      },
      {
        label: 'Done',
        icon: 'pi pi-check',
        command() {
          handleMove('Done', thisTask)
        }
      }
    ]
  }
]);


</script>

<template>

  <div class="task-card" style="margin-bottom: 1.2rem; border-bottom: 4px solid #4CAF50; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
    <div class="title">
      <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;">
        <h3 class="task-title" style="font-weight:normal; margin-bottom: 0;">{{ title }}</h3>
        <div class="p-button-icon">
          <Button style="color: #02513D;" icon="pi pi-ellipsis-h" aria-label="edit" text @click="toggle"></Button>
          <TieredMenu class="tier" ref="menu" id="overlay_tmenu" :model="items" popup/>
        </div>
      </div>
      <div style="color: #555; margin-bottom: 0.3rem;">
        <p style="margin: 0 0 0.2rem 0;">Assigned to: <span style="color: #02513D;">{{ assigned }}</span></p>
        <p style="margin: 0;">Due: <i class="pi pi-calendar" style="color: #02513D; margin-right: 4px;"></i>{{ due }}</p>
      </div>
      <div style="font-size: 0.92em; color: #888; margin-bottom: 0.2rem;">
        Estado: <span style="color: #4CAF50;">{{ state }}</span>
      </div>
      <div style="color: #666; font-size: 0.97em; margin-bottom: 0.2rem;">
        {{ description }}
      </div>
    </div>
  </div>

  <Dialog modal:true class="p-dialog" v-model:visible="visible" :closeOnOutsideClick="true">
    <div style="padding: 2rem">
      <h2 class="p-dialog-title block font-semibold mb-5">Edit your Task</h2>
      <span class="p-text-secondary block mb-5">Edit your Task info.</span>

      <!-- Campos para ingresar información del nuevo proyecto -->
      <div class=" align-items-center gap-3 mb-2">
        <label for="title" class="font-semibold w-6rem">Task Title</label>
        <InputText id="title" class="flex flex-auto" :placeholder="thisTask.title" autocomplete="off"
                   v-model="thisTask.title"/>
      </div>

      <div class=" align-items-center gap-3 mb-2">
        <label for="assigned" class="font-semibold w-6rem">Employee Assigned</label>
        <InputNumber id="assigned" class="flex flex-auto" autocomplete="off"
                   v-model="thisTask.assignedID"/>
      </div>

      <div class=" align-items-center gap-3 mb-2">
        <label for="calendar" class="font-semibold w-6rem">Due date</label>
        <Calendar class="flex flex-auto" id="due" :placeholder="thisTask.dueDate" v-model="thisTask.due" :minDate="new Date()"
                  :manualInput="false"/>

      </div>


      <!-- Botón para agregar el nuevo proyecto -->
      <div class=" justify-content-end gap-2">
        <Button label="edit" @click="editFunc(props.projectId, thisTask)" style="background-color: #02513D;"/>
      </div>
    </div>
  </Dialog>


</template>

<style>

.task-title {
  font-family: 'Lora', serif !important;
  font-weight: 600 !important;
  letter-spacing: 1px;
}

.title {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.p-menuitem-link {
  padding: 0.5rem;
}
.task-card {
  width: 100%;
  align-items: center;
  transition: 0.3s;
  background-color: #F7F7F7;
  border-radius: 1rem;
  padding: 0.3rem 1rem;
  user-select: none;
}

.task-card:hover {
  scale: 0.98;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.task-card:active {
  scale: 1;
  transition: 0.1s;

}
</style>