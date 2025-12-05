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
      style="margin-bottom: 1.2rem; border-bottom: 4px solid #fb923c; box-shadow: 0 2px 8px rgba(0,0,0,0.06);"
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
        Estado: <span style="color: #fb923c;">{{ state }}</span>
      </div>
      <div style="color: #666; font-size: 0.97em; margin-bottom: 0.2rem;">
        {{ description }}
      </div>
    </div>
  </div>

  <Dialog modal:true class="p-dialog custom-dialog" v-model:visible="visible" :closeOnEscape="true" :style="{ width: '520px' }">
    <template #header>
      <div style="width: 100%;">
        <h2 style="margin: 0; font-size: 1.3rem; color: #2c3e50; font-weight: 600;">
          <i class="pi pi-pencil" style="margin-right: 0.5rem;"></i>
          Edit Task
        </h2>
        <p style="margin: 0.3rem 0 0 0; color: #7f8c8d; font-size: 0.85rem;">
          Update your task information below
        </p>
      </div>
    </template>

    <div style="padding: 1rem 0; position: relative; z-index: 1;">
      <!-- Task Title -->
      <div class="input-group" style="margin-bottom: 1rem;">
        <label for="title" class="input-label">
          <i class="pi pi-file-edit" style="margin-right: 0.4rem; color: #5a6c7d;"></i>
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
      <div class="input-group" style="margin-bottom: 1rem;">
        <label for="description" class="input-label">
          <i class="pi pi-align-left" style="margin-right: 0.4rem; color: #5a6c7d;"></i>
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
      <div class="input-group" style="margin-bottom: 1rem;">
        <label for="assigned" class="input-label">
          <i class="pi pi-user" style="margin-right: 0.4rem; color: #5a6c7d;"></i>
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
      <div class="input-group" style="margin-bottom: 0.5rem;">
        <label for="calendar" class="input-label">
          <i class="pi pi-calendar" style="margin-right: 0.4rem; color: #5a6c7d;"></i>
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
            appendTo="self"
        />
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <button class="btn-cancel" @click="visible = false">
          <i class="pi pi-times"></i>
          Cancel
        </button>
        <button class="btn-save" @click="editFunc(props.projectId)">
          <i class="pi pi-check"></i>
          Save Changes
        </button>
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

.custom-dialog .p-dialog-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.custom-dialog .p-dialog-content {
  background-color: #ffffff;
  overflow: visible !important;
}

.custom-dialog .p-dialog-footer {
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
  padding: 1rem 1.5rem !important;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-label {
  font-weight: 600;
  font-size: 0.875rem;
  color: #495057;
  margin-bottom: 0.4rem;
  display: flex;
  align-items: center;
}

.custom-input,
.custom-dropdown,
.custom-calendar {
  width: 100%;
  border: 1px solid #ced4da;
  border-radius: 6px;
  padding: 0.6rem 0.75rem;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  background-color: #ffffff;
}

.custom-input:focus,
.custom-dropdown:focus,
.custom-calendar:focus {
  border-color: #fb923c;
  box-shadow: 0 0 0 3px rgba(251, 146, 60, 0.1);
  outline: none;
}

.custom-input:hover,
.custom-dropdown:hover,
.custom-calendar:hover {
  border-color: #adb5bd;
}

.custom-input::placeholder {
  color: #adb5bd;
}

.custom-calendar {
  position: relative;
}

.custom-calendar .p-inputtext {
  width: 100%;
  border: none;
  padding: 0;
  box-shadow: none;
}

.custom-calendar .p-datepicker {
  position: absolute !important;
  top: 100% !important;
  left: 0 !important;
  margin-top: 0.25rem !important;
  z-index: 9999 !important;
}

.p-dialog .p-dialog-header {
  padding: 1.25rem 1.5rem;
}

.p-dialog .p-dialog-content {
  padding: 0 1.5rem;
}

.p-dialog .p-dialog-footer {
  padding: 0 1.5rem 1.25rem 1.5rem;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 0.75rem;
}

.btn-cancel,
.btn-save {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.btn-cancel {
  background-color: #ffffff;
  color: #6b7280;
  border: 1.5px solid #d1d5db;
}

.btn-cancel:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
  color: #374151;
}

.btn-cancel:active {
  transform: scale(0.98);
}

.btn-save {
  background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(251, 146, 60, 0.3);
}

.btn-save:hover {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  box-shadow: 0 4px 12px rgba(251, 146, 60, 0.4);
  transform: translateY(-1px);
}

.btn-save:active {
  transform: translateY(0) scale(0.98);
}

.btn-cancel i,
.btn-save i {
  font-size: 0.875rem;
}
</style>