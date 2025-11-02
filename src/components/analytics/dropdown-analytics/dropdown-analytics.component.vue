<script>
import ProjectsService from "@/public/projects.service.js";

export default {
  name: "dropdown-analytics",
  data() {
    return {
      projectsService: new ProjectsService(),
      projectSelected: null,
      user: null,
      projects: []
    };
  },
  created() {
    this.user = JSON.parse(localStorage.getItem('user'));
  },
  watch: {
    projectSelected() {
      if (this.projectSelected) {
        this.$emit('projectSelected', this.projectSelected.id);
        localStorage.setItem('selectedProject', JSON.stringify(this.projectSelected));
      }
    }
  },
  async mounted() {
    console.log(this.user?.companyId);
    await this.projectsService.fetchProjects(this.user?.companyId)
        .then(r => {
          console.log(r);
          if (!r || r.length === 0) console.error('Error to get projects');
          else {
            this.projects = r.filter(p => p.name)
            if (this.projects.length === 0) {
              this.$emit('no-projects');
            } else {

              const selectedProject = JSON.parse(localStorage.getItem('selectedProject'));
              if (selectedProject) {
                if(this.projects.length > 0)
                  // Encuentra el proyecto correspondiente en la lista de proyectos
                  this.projectSelected = this.projects.find(p => p.id === selectedProject.id);
                // Emite el evento con el ID del proyecto seleccionado
                this.$emit('projectSelected', this.projectSelected.id);
              }

            }
          }
        })
  },
}
</script>


<template>
  <pv-dropdown v-model="projectSelected" :options="projects" optionLabel="name" placeholder="Select a project"
               class="w-full md:w-14rem p-2 mb-4">
    <template #value="slotProps">
      <div v-if="slotProps.value" class="flex align-items-start">
        <div>{{ slotProps.value.name }}</div>
      </div>
    </template>
    <template #option="slotProps">
      <div class="p-2">{{ slotProps.option.name }}</div>
    </template>
  </pv-dropdown>
</template>

<style scoped>

</style>