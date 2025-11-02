<template>
  <div class="project-card">
    <Button class="img-but" @click="openTodo">
      <img :src="project.imageUrl[0] || 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'" alt="Project Image" class="project-image" />
    </Button>
    <div class="project-name">{{ project.name }}</div>
  </div>
</template>

<script setup>
import Button from "primevue/button";
import {defineProps} from 'vue';
import router from "@/router/index.js";
import { useStore } from 'vuex';
const props = defineProps({

  project: {
    type: Object, // Cambiado de ProjectsEntity a Object para evitar warnings
        required: true,
  },

});
const store = useStore();

const openTodo = () => {
  store.commit('setSelectedProject', props.project);
  router.push({
    name: 'projectTodo',
    params: {
      id: props.project.id,
    }
  });
  console.log('Project set in store:', props.project);
};


</script>

<style scoped>
.project-card {
  width: 20%;
  height: 100%;
  object-fit: cover;
}

.project-card img {
  width: 100%;
  height: 12rem;
  resize: both;
}

.project-name {
  text-align: left;
  margin-top: 0.5rem;
}

.img-but {
  width: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transform: scale(1);
}

.img-but:hover {
  cursor: pointer;
  transform: scale(1.05);
  transition: transform 0.3s ease;

}



@media (max-width: 768px) {
  .project-card {
    width: 100%;
    height: auto;
  }
}
</style>