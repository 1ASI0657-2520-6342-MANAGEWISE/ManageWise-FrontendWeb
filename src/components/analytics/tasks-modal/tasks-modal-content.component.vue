<script>
import {AnalyticsService} from "@/services/analytics.service.js";

export default {
  name: "tasks-modal-content",
  props: ['selectedCard', 'analytics'],
  emits: ['close', 'analytics-updated'],
  data() {
    return {
      hasUpdated: false,
      analyticsService: new AnalyticsService(),
      tasks: Array(3).fill(0)
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },

    generateRandomNumber(mean, interval) {
      return Math.floor(mean - interval / 2 + Math.random() * interval);
    },

    generateData() {
      const mean = 50; // El valor medio de los números aleatorios
      const interval = 10; // El intervalo alrededor del valor medio

      for (let i = 0; i < this.tasks.length; i++) {
        this.tasks[i] = this.generateRandomNumber(mean, interval);
      }
    },

    async onUpdateTasksChart() {
      if (this.analytics && this.analytics.id) {
        const requestBody = {
          id: this.analytics.id,
          tasks: this.tasks
        }
        try {
          const response = await this.analyticsService.updateTasksChartByAnalyticsId(requestBody);
          console.log(requestBody);
          this.hasUpdated = true;

          // Emitimos el evento 'analytics-updated' para que el componente padre pueda actualizar la información
          this.$emit('analytics-updated', response);

          // Utilizamos Vue.set() para actualizar el array 'tasks'
          this.analytics.tasks = response.tasks;

        } catch (e) {
          console.error(e);
        }
      } else {
        console.error('analytics is undefined');
      }
      this.hasUpdated = true;
    },

    handleOkButton() {
      this.hasUpdated = false
      this.$emit('close');
      window.location.reload();
    }
  }
}
</script>

<template>
  <section
      class="modal-background w-full bg-white-alpha-40 absolute top-0 left-0 bottom-0 right-0 flex align-items-center justify-content-center">
    <div class="modal z-5 p-5 border-round-2xl shadow-2">
      <div class="flex flex-row justify-content-between mb-5 align-items-center">
        <p class="text-xl font-medium">You are edit on <span class="text-green-700">Tasks</span></p>
        <i class="pi pi-times cursor-pointer shadow-2 border-gray-600
          bg-white border-round mb-1 hover:bg-green-700
          hover:text-white transition-all transition-duration-300 animation-ease-in"
           @click="closeModal()"
           style="font-size: 1.2rem; padding: 5px"></i>
      </div>
      <div class="flex relative flex-row align-items-center justify-content-between flex-wrap gap-2">
        <div class="flex flex-row align-items-center gap-2">
          <div class="w-3rem h-1rem" style="background-color: #6b9c3c"></div>
          <p>To-do</p>
        </div>
        <div class="flex flex-row align-items-center gap-2">
          <div class="w-3rem h-1rem bg-cyan-300" style="background-color: #91d2cc"></div>
          <p>In progress</p>
        </div>
        <div class="flex flex-row align-items-center gap-2">
          <div class="w-3rem h-1rem bg-cyan-300" style="background-color: #bfd6aa !important;"></div>
          <p>Done</p>
        </div>
      </div>
      <div class="flex flex-column gap-3 align-items-center relative mt-5">
        <form class="flex flex-column align-items-center" @submit.prevent="onUpdateTasksChart()">
          <div class="flex relative">
            <img src="../../../assets/image-chart-ball.png" class="w-14rem h-full"/>
            <div class="flex absolute flex-column py-5 w-full h-full top-0 left-0">
              <div class="flex flex-row justify-content-between">
                <input v-model="tasks[0]" class="w-3rem p-1" placeholder="200"/>
                <input v-model="tasks[1]" class="w-3rem p-1" placeholder="100"/>
              </div>
              <div class="flex-1 flex flex-col align-items-end justify-content-end">
                <input v-model="tasks[2]" class="w-3rem p-1 h-2rem border-1" placeholder="300"/>
              </div>
            </div>
          </div>
          <button class="mt-5 align-self-center shadow-1 border-1 border-gray-300 uppercase py-2 px-5
          font-medium text-base cursor-pointer border-round-2xl
          hover:bg-green-700 hover:text-white transition-duration-200 transition-all animation-ease-in"
                  style="letter-spacing: 1px; justify-self: center">
            update
          </button>
        </form>
        <img src="../../../assets/bolita8.png" class="w-2rem absolute z-5
          bottom-0 left-0 h-2rem ball8" @click="generateData()">
      </div>
    </div>
  </section>
  <pv-dialog :style="{margin: '0 10px'}" :visible.sync="hasUpdated" :modal="true" :closable="false">
    <div class="error-modal p-5 flex flex-column align-items-center gap-5 text-center">
      <i class="text-7xl pi pi-check-circle text-green-700"></i>
      <h1>Update Successful!</h1>
      <p class="text-md">The data has been successfully updated</p>
      <pv-button class="py-3 px-5" label="OK" @click="handleOkButton"/>
    </div>
  </pv-dialog>
</template>

<style scoped>

</style>