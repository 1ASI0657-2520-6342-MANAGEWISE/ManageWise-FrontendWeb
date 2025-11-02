<script>
import {AnalyticsService} from "@/services/analytics.service.js";

export default {
  name: "stats-modal-content",
  props: ['selectedCard', 'analytics'],
  emits: ['close', 'analytics-updated'],
  data() {
    return {
      hasUpdated: false,
      analyticsService: new AnalyticsService(),
      stats: Array(5).fill(0)
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

      for (let i = 0; i < this.stats.length; i++) {
        this.stats[i] = this.generateRandomNumber(mean, interval);
      }
    },

    async onUpdateStatsInformation() {
      if (this.analytics && this.analytics.id) {
        const requestBody = {
          id: this.analytics.id,
          status: this.stats
        }
        try {
          const response = await this.analyticsService.updateStatusChartByAnalyticsId(requestBody);
          console.log(requestBody);
          this.hasUpdated = true;

          this.$emit('analytics-updated', response);

          this.analytics.stats = response.stats;
        } catch (e) {
          console.error(e);
        }
      }
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
        <p class="text-xl font-medium">You are edit on <span class="text-green-700">Current Status</span></p>
        <i class="pi pi-times cursor-pointer shadow-2 border-gray-600
          bg-white border-round mb-1 hover:bg-green-700
          hover:text-white transition-all transition-duration-300 animation-ease-in"
           @click="closeModal()"
           style="font-size: 1.2rem; padding: 5px"></i>
      </div>
      <form class="flex relative flex-column gap-4" @submit.prevent="onUpdateStatsInformation()">
        <div class="flex flex-row justify-content-between flex-wrap">
          <label class="w-13rem stats-label">Time:</label>
          <div class="flex flex-row flex-1 justify-content-between flex-wrap gap-2">
            <input v-model="stats[0]" type="number" class="w-3rem"/>
            <p class="font-light">% ahead of schedule</p>
          </div>
        </div>
        <div class="flex flex-row justify-content-between flex-wrap">
          <label class="w-13rem stats-label">Tasks:</label>
          <div class="flex flex-row flex-1 justify-content-between flex-wrap gap-2">
            <input v-model="stats[1]" type="number" class="w-3rem"/>
            <p class="font-light">tasks to complete</p>
          </div>
        </div>
        <div class="flex flex-row justify-content-between flex-wrap">
          <label class="w-13rem stats-label">Workload:</label>
          <div class="flex flex-row flex-1 justify-content-between flex-wrap gap-2">
            <input v-model="stats[2]" type="number" class="w-3rem"/>
            <p class="font-light">tasks overdue</p>
          </div>
        </div>
        <div class="flex flex-row justify-content-between flex-wrap">
          <label class="w-13rem stats-label">Progress:</label>
          <div class="flex flex-row flex-1 justify-content-between flex-wrap gap-2">
            <input v-model="stats[3]" type="number" class="w-3rem"/>
            <p class="font-light">% completed</p>
          </div>
        </div>
        <div class="flex flex-row justify-content-between flex-wrap">
          <label class="w-13rem stats-label">Cost:</label>
          <div class="flex flex-row flex-1 justify-content-between flex-wrap gap-2">
            <input v-model="stats[4]" type="number" class="w-3rem"/>
            <p class="font-light">% under beaget</p>
          </div>
        </div>
        <button class="mt-3 align-self-end shadow-1 border-1 border-gray-300 uppercase py-2 px-5
          font-medium text-base cursor-pointer border-round-2xl
          hover:bg-green-700 hover:text-white transition-duration-200 transition-all animation-ease-in"
                style="letter-spacing: 1px; justify-self: center">
          update
        </button>
        <img src="../../../assets/bolita8.png" class="w-2rem absolute z-5
          bottom-0 left-0 h-2rem ball8" @click="generateData()">
      </form>
    </div>
  </section>
  <pv-dialog :style="{margin: '0 10px'}" :visible.sync="hasUpdated" :modal="true" :closable="false">
    <div class="error-modal p-5 flex flex-column align-items-center gap-5 text-center">
      <i class="text-7xl pi pi-check-circle text-green-700"></i>
      <h1>Update Successful!</h1>
      <p class="text-md">The data has been successfully updated</p>
      <pv-button class="py-3 px-5" label="OK" @click="handleOkButton()"/>
    </div>
  </pv-dialog>
</template>

<style scoped>

</style>