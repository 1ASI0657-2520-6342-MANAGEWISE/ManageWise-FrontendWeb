<script setup>
import TieredMenu from "primevue/tieredmenu";
import Dialog from "primevue/dialog";
import Calendar from "primevue/calendar";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import { ref, computed, toRefs } from "vue";
import { deleteTask, editTask } from "@/services/projects-api.services.js";
import { TaskEntity } from "@/models/task.entity.js";

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
  teamMembers: {
    type: Array,
    default: () => [],
  },
});

const { teamMembers } = toRefs(props);

const emits = defineEmits(["taskDel", "taskMoved"]);

const menu = ref();
const visible = ref(false);
const thisTask = ref(
    new TaskEntity(
        props.id,
        props.title,
        props.assigned,
        props.due,
        props.state,
        props.assignedID,
        props.description
    )
);

console.log(thisTask.value, "se cargo");
console.log(props, "se cargo props");

const displayAssignee = computed(() => {
  const found = teamMembers.value.find((m) => m.id === props.assignedID);
  return found?.name || props.assigned || "Assignee Name Placeholder";
});

const toggle = (event) => {
  menu.value.toggle(event);
};

const taskDel = (projectId, id) => {
  deleteTask(projectId, id)
      .then(() => emits("taskDel"))
      .catch((err) => console.error("Error deleting task:", err));
};

const editFunc = async (projectId) => {
  if (!thisTask.value.title || !thisTask.value.due || !thisTask.value.assignedID) {
    alert("Por favor, ingrese el título, el asignado y la fecha.");
    return;
  }
  try {
    await editTask(projectId, thisTask.value);
    visible.value = false;
    emits("taskDel");
  } catch (e) {
    console.error("Error editing task from component:", e);
  }
};

const edit = () => {
  visible.value = true;
};

const handleMove = async (destination) => {
  console.log(`Moved to: ${destination}`);
  thisTask.value.state = destination;
  try {
    await editTask(props.projectId, thisTask.value);
    emits("taskMoved", { ...thisTask.value });
  } catch (error) {
    console.error("Error updating task state:", error);
  }
};

const items = ref([
  {
    label: "Delete",
    icon: "pi pi-trash",
    command() {
      taskDel(props.projectId, props.id);
    },
  },
  {
    label: "Edit",
    icon: "pi pi-pen-to-square",
    command() {
      edit();
    },
  },
  {
    separator: true,
  },
  {
    label: "Move",
    icon: "pi pi-arrow-right-arrow-left",
    items: [
      {
        label: "To Do",
        icon: "pi pi-clock",
        command() {
          handleMove("To-Do");
        },
      },
      {
        label: "Doing",
        icon: "pi pi-wrench",
        command() {
          handleMove("Doing");
        },
      },
      {
        label: "Done",
        icon: "pi pi-check",
        command() {
          handleMove("Done");
        },
      },
    ],
  },
]);
</script>

<template>
  <div
      class="task-card"
      style="margin-bottom: 1.2rem; border-bottom: 4px solid #4CAF50; box-shadow: 0 2px 8px rgba(0,0,0,0.06);"
  >
    <div class="title">
      <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;">
        <h3 class="task-title" style="font-weight:normal; margin-bottom: 0;">{{ title }}</h3>
        <div class="p-button-icon">
          <Button style="color: #02513D;" icon="pi pi-ellipsis-h" aria-label="edit" text @click="toggle" />
          <TieredMenu class="tier" ref="menu" id="overlay_tmenu" :model="items" popup />
        </div>
      </div>
      <div style="color: #555; margin-bottom: 0.3rem;">
        <p style="margin: 0 0 0.2rem 0;">
          Assigned to:
          <span style="color: #02513D;">{{ displayAssignee }}</span>
        </p>
        <p style="margin: 0;">
          Due:
          <i class="pi pi-calendar" style="color: #02513D; margin-right: 4px;"></i>{{ due }}
        </p>
      </div>
      <div style="font-size: 0.92em; color: #888; margin-bottom: 0.2rem;">
        Estado: <span style="color: #4CAF50;">{{ state }}</span>
      </div>
      <div style="color: #666; font-size: 0.97em; margin-bottom: 0.2rem;">
        {{ description }}
      </div>
    </div>
  </div>

  <Dialog modal:true class="p-dialog" v-model:visible="visible" :closeOnOutsideClick="true" :style="{ width: '500px' }">
    <template #header>
      <div style="width: 100%;">
        <h2 style="margin: 0; font-size: 1.5rem; color: #02513D; font-weight: 600;">
          <i class="pi pi-pencil" style="margin-right: 0.5rem;"></i>
          Edit Task
        </h2>
        <p style="margin: 0.5rem 0 0 0; color: #666; font-size: 0.9rem;">
          Update your task information below
        </p>
      </div>
    </template>

    <div style="padding: 1.5rem 0;">
      <!-- Task Title -->
      <div class="input-group" style="margin-bottom: 1.5rem;">
        <label for="title" class="input-label">
          <i class="pi pi-file-edit" style="margin-right: 0.5rem; color: #02513D;"></i>
          Task Title
        </label>
        <InputText
            id="title"
            class="custom-input"
            placeholder="Enter task title"
            autocomplete="off"
            v-model="thisTask.title"
        />
      </div>

      <!-- Description -->
      <div class="input-group" style="margin-bottom: 1.5rem;">
        <label for="description" class="input-label">
          <i class="pi pi-align-left" style="margin-right: 0.5rem; color: #02513D;"></i>
          Description
        </label>
        <InputText
            id="description"
            class="custom-input"
            placeholder="Enter task description"
            autocomplete="off"
            v-model="thisTask.description"
        />
      </div>

      <!-- Employee Assigned -->
      <div class="input-group" style="margin-bottom: 1.5rem;">
        <label for="assigned" class="input-label">
          <i class="pi pi-user" style="margin-right: 0.5rem; color: #02513D;"></i>
          Assigned To
        </label>
        <Dropdown
            id="assigned"
            class="custom-dropdown"
            v-model="thisTask.assignedID"
            :options="teamMembers"
            optionLabel="name"
            optionValue="id"
            placeholder="Select team member"
        />
      </div>

      <!-- Due Date -->
      <div class="input-group" style="margin-bottom: 1.5rem;">
        <label for="calendar" class="input-label">
          <i class="pi pi-calendar" style="margin-right: 0.5rem; color: #02513D;"></i>
          Due Date
        </label>
        <Calendar
            class="custom-calendar"
            id="due"
            placeholder="Select due date"
            v-model="thisTask.due"
            :minDate="new Date()"
            :manualInput="false"
            dateFormat="yy-mm-dd"
        />
      </div>
    </div>

    <template #footer>
      <div style="display: flex; justify-content: flex-end; gap: 0.75rem; padding-top: 1rem; border-top: 1px solid #e0e0e0;">
        <Button
            label="Cancel"
            icon="pi pi-times"
            @click="visible = false"
            text
            style="color: #666;"
        />
        <Button
            label="Save Changes"
            icon="pi pi-check"
            @click="editFunc(props.projectId)"
            style="background-color: #02513D; border: none;"
        />
      </div>
    </template>
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

/* Estilos mejorados para el diálogo */
.input-group {
  display: flex;
  flex-direction: column;
}

.input-label {
  font-weight: 600;
  font-size: 0.95rem;
  color: #333;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.custom-input,
.custom-dropdown,
.custom-calendar {
  width: 100%;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.custom-input:focus,
.custom-dropdown:focus,
.custom-calendar:focus {
  border-color: #02513D;
  box-shadow: 0 0 0 3px rgba(2, 81, 61, 0.1);
  outline: none;
}

.custom-input::placeholder {
  color: #999;
}

/* Mejorar el diálogo general */
.p-dialog .p-dialog-header {
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.p-dialog .p-dialog-content {
  padding: 0 1.5rem;
}

.p-dialog .p-dialog-footer {
  padding: 0 1.5rem 1.5rem 1.5rem;
}
</style>