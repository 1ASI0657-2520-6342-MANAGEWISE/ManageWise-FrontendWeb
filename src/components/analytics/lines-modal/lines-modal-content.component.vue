<script>
import {AnalyticsService} from "@/services/analytics.service.js";

export default {
  name: "lines-modal-content",
  props: ['selectedCard', 'analytics'],
  emits: ['close', 'updateAnalytics', 'analytics-updated'],
  data() {
    return {
      hasUpdated: false,
      analyticsService: new AnalyticsService(),
      lines: Array(24).fill(0)
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

      for (let i = 0; i < this.lines.length; i++) {
        this.lines[i] = this.generateRandomNumber(mean, interval);
      }
    },

    async onUpdateLinesChart() {
      if (this.analytics && this.analytics.id) {
        const requestBody = {
          id: this.analytics.id,
          lines: this.lines
        }
        try {
          const response = await this.analyticsService.updateLinesChartByAnalyticsId(requestBody);
          console.log(requestBody);
          this.hasUpdated = true;

          // Emitimos el evento 'analytics-updated' para que el componente padre pueda actualizar la información
          this.$emit('analytics-updated', response);

          // Utilizamos Vue.set() para actualizar el array 'lines'
          this.analytics.lines = response.lines;

        } catch (e) {
          console.error(e);
        }
      } else {
        console.error('analytics is undefined');
      }
      this.hasUpdated = true;
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
    <div class="modal-progress z-5 p-5 border-round-2xl shadow-2">
      <div class="flex flex-row justify-content-between mb-4 align-items-center">
        <p class="text-xl font-medium">You are edit on <span class="text-green-700">Payments</span></p>
        <i class="pi pi-times cursor-pointer shadow-2 border-gray-600
          bg-white border-round mb-1 hover:bg-green-700
          hover:text-white transition-all transition-duration-300 animation-ease-in"
           @click="closeModal()"
           style="font-size: 1.2rem; padding: 5px"></i>
      </div>
      <div class="flex relative flex-column gap-3 align-items-center relative mt-0 w-full">
        <form class="flex flex-column align-items-center w-full" @submit.prevent="onUpdateLinesChart()">
          <p class="font-medium w-full mb-3 text-green-700">Current - Months:</p>
          <div class="flex flex-column w-full gap-3">
            <div class="flex flex-column">
              <div class="flex flex-row justify-content-between">
                <div class="flex flex-row gap-2">
                  <label>Jan</label>
                  <input v-model="lines[0]" class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Feb</label>
                  <input v-model="lines[1]" class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Mar</label>
                  <input v-model="lines[2]" class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Apr</label>
                  <input v-model="lines[3]" class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>May</label>
                  <input v-model="lines[4]" class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Jun</label>
                  <input v-model="lines[5]" class="w-3rem">
                </div>
              </div>
            </div>
            <div class="flex flex-column">
              <div class="flex flex-row justify-content-between">
                <div class="flex flex-row gap-2">
                  <label>Jul</label>
                  <input v-model="lines[6]" class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Aug</label>
                  <input v-model="lines[7]" class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Sep</label>
                  <input v-model="lines[8]" class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Oct</label>
                  <input v-model="lines[9]" class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Nov</label>
                  <input v-model="lines[10]" class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Dec</label>
                  <input v-model="lines[11]" class="w-3rem">
                </div>
              </div>
            </div>
          </div>
          <p class="font-medium w-full mt-5 mb-3 text-green-700">Expected - Months:</p>
          <div class="flex flex-column w-full gap-3">
            <div class="flex flex-column">
              <div class="flex flex-row justify-content-between">
                <div class="flex flex-row gap-2">
                  <label>Jan</label>
                  <input v-model="lines[12]" class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Feb</label>
                  <input v-model="lines[13]" class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Mar</label>
                  <input v-model="lines[14]" class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Apr</label>
                  <input v-model="lines[15]" class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>May</label>
                  <input v-model="lines[16]" class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Jun</label>
                  <input v-model="lines[17]" class="w-3rem">
                </div>
              </div>
            </div>
            <div class="flex flex-column">
              <div class="flex flex-row justify-content-between">
                <div class="flex flex-row gap-2">
                  <label>Jul</label>
                  <input v-model="lines[18]" class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Aug</label>
                  <input v-model="lines[19]" class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Sep</label>
                  <input v-model="lines[20]" class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Oct</label>
                  <input v-model="lines[21]" class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Nov</label>
                  <input v-model="lines[22]" class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Dec</label>
                  <input v-model="lines[23]" class="w-3rem">
                </div>
              </div>
            </div>
          </div>
          <div class="flex" style="margin: 35px 0">
            <img src="../../../assets/image-progress-months(1).png" class="w-full sm:w-30rem h-full"/>
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