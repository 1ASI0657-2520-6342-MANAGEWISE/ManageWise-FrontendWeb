<script>
import {AnalyticsService} from "@/services/analytics.service.js";

export default {
  name: "progressbar-modal-content",
  props: ['selectedCard', 'analytics'],
  emits: ['close', 'analytics-updated'],
  data() {
    return {
      hasUpdated: false,
      analyticsService: new AnalyticsService(),
      progressbar: Array(6).fill(0)
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

      for (let i = 0; i < this.progressbar.length; i++) {
        this.progressbar[i] = this.generateRandomNumber(mean, interval);
      }
    },

    async onUpdateProgressbarChart() {
      if (this.analytics && this.analytics.id) {
        const requestBody = {
          id: this.analytics.id,
          progressbar: this.progressbar
        }
        try {
          const response = await this.analyticsService.updateProgressChartByAnalyticsId(requestBody);
          console.log(requestBody);
          this.hasUpdated = true;

          // Emitimos el evento 'analytics-updated' para que el componente padre pueda actualizar la información
          this.$emit('analytics-updated', response);

          // Utilizamos Vue.set() para actualizar el array 'progressbar'
          this.analytics.progressbar = response.progressbar;

        } catch (e) {
          console.error(e);
        }
      } else {
        console.error('analytics is undefined');
      }
    },

    handleOkButton() {
      this.hasUpdated = false;
      this.$emit('close');
      window.location.reload();
    }
  }
}
</script>

<template>
  <section
      class="modal-background w-full bg-white-alpha-40 absolute top-0 left-0 bottom-0 right-0 flex align-items-center justify-content-center">
    <div class="modal relative z-5 p-5 border-round-2xl shadow-2">
      <div class="flex flex-row justify-content-between mb-4 align-items-center">
        <p class="text-xl font-medium">You are edit on <span class="text-green-700">Payments</span></p>
        <i class="pi pi-times cursor-pointer shadow-2 border-gray-600
          bg-white border-round mb-1 hover:bg-green-700
          hover:text-white transition-all transition-duration-300 animation-ease-in"
           @click="closeModal()"
           style="font-size: 1.2rem; padding: 5px"></i>
      </div>
      <div class="flex flex-column gap-3 align-items-center relative mt-0 w-full">
        <form class="flex flex-column align-items-center w-full" @submit.prevent="onUpdateProgressbarChart()">
          <div class="flex flex-column w-full gap-4">
            <div class="flex flex-column">
              <p class="mb-3">Actual:</p>
              <div class="label-container flex flex-row justify-content-between w-full px-5 flex-wrap gap-3">
                <div class="flex flex-row gap-2">
                  <label class="font-light">Current:</label>
                  <input v-model="progressbar[0]" class="w-3rem"/>
                </div>
                <div class="flex flex-row gap-2">
                  <label class="font-light">Expected:</label>
                  <input v-model="progressbar[1]" class="w-3rem"/>
                </div>
              </div>
            </div>
            <div class="flex flex-column">
              <p class="mb-3">Planned:</p>
              <div class="label-container flex flex-row justify-content-between w-full px-5 flex-wrap gap-3">
                <div class="flex flex-row gap-2">
                  <label class="font-light">Current:</label>
                  <input v-model="progressbar[2]" class="w-3rem"/>
                </div>
                <div class="flex flex-row gap-2">
                  <label class="font-light">Expected:</label>
                  <input v-model="progressbar[3]" class="w-3rem"/>
                </div>
              </div>
            </div>
            <div class="flex flex-column">
              <p class="mb-3">Budget:</p>
              <div class="label-container flex flex-row justify-content-between w-full px-5 flex-wrap gap-3">
                <div class="flex flex-row gap-2">
                  <label class="font-light">Current:</label>
                  <input v-model="progressbar[4]" class="w-3rem"/>
                </div>
                <div class="flex flex-row gap-2">
                  <label class="font-light">Expected:</label>
                  <input v-model="progressbar[5]" class="w-3rem"/>
                </div>
              </div>
            </div>
          </div>
          <div class="my-6 flex">
            <img src="../../../assets/image-progressbar.png" class="w-full sm:w-26rem h-full"/>
          </div>
          <div class="flex flex-row align-items-center justify-content-center flex-wrap gap-5">
            <div class="flex flex-row align-items-center gap-2">
              <div class="w-3rem h-1rem" style="background-color: #bfd6aa !important;"></div>
              <p>Current</p>
            </div>
            <div class="flex flex-row align-items-center gap-2">
              <div class="w-3rem h-1rem" style="background-color: #6b9c3c !important;"></div>
              <p>Expected</p>
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