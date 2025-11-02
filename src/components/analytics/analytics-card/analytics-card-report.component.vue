<script>

export default {
  name: "analytics-card-report",

  data() {
    return {
      date: null,
      range: 0,
      ages1: 0,
      ages2: 0,
      ages3: 0,
      male: 0,
      female: 0,
      notDisclosed: 0,
      local: 0,
      national: 0,
      international: 0,
      veryDissatisfied: 0,
      dissatisfied: 0,
      neutral: 0,
      satisfied: 0,
      verySatisfied: 0,
      note: ''
    };
  }
}
</script>

<template>
  <h2 class="spacer-bottom">Clean Carpayo Beach</h2>
  <h3 class="spacer-bottom">Create new report</h3>
  <div class="card flex justify-content-left">
    <p class="spacer-left">Event:</p>
    <pv-calendar v-model="date" class="spacer-bottom"/>
  </div>
  <div class="flex">
    <pv-card class="card-content">
      <template #header>
        <p class="text">Age:</p>
      </template>
      <template #content>
        <div class="spacer-left">
          <div class="flex">
            <p class="line">Select Range:</p>
            <div class="flex-auto">
              <pv-input-number v-model="range" inputId="minmax-buttons" mode="decimal" showButtons :min="0" :max="100"/>
            </div>
          </div>
          <div class="flex">
            <p class="line">18-23:</p>
            <div class="flex-auto">
              <pv-input-number v-model="ages1" inputId="minmax-buttons" mode="decimal" :min="0" :max="100"/>
            </div>
          </div>
          <div class="flex">
            <p class="line">23-28:</p>
            <div class="flex-auto">
              <pv-input-number v-model="ages2" inputId="minmax-buttons" mode="decimal" :min="0" :max="100"/>
            </div>
          </div>
          <div class="flex">
            <p class="line">23-28:</p>
            <div class="flex-auto">
              <pv-input-number v-model="ages3" inputId="minmax-buttons" mode="decimal" min="0" :max="100"/>
            </div>
          </div>
        </div>
      </template>
    </pv-card>
    <pv-card class="card-content">
      <template #header>
        <p class="text">Gender of Attendees:</p>
      </template>
      <template #content>
        <div class="spacer-left">
          <div class="flex">
            <p class="line">Male:</p>
            <div class="flex-auto">
              <pv-input-number v-model="male" inputId="minmax-buttons" mode="decimal" :min="0" :max="100"/>
            </div>
          </div>
          <div class="flex">
            <p class="line">Female:</p>
            <div class="flex-auto">
              <pv-input-number v-model="female" inputId="minmax-buttons" mode="decimal" :min="0" :max="100"/>
            </div>
          </div>
          <div class="flex">
            <p class="line">Not disclosed:</p>
            <div class="flex-auto">
              <pv-input-number v-model="notDisclosed" inputId="minmax-buttons" mode="decimal" :min="0" :max="100"/>
            </div>
          </div>
        </div>
      </template>
    </pv-card>
    <pv-card class="card-content">
      <template #header>
        <p class="text">Note:</p>
      </template>
      <template #content>
        <div class="card flex justify-content-center">
          <pv-text-area v-model="note" autoResize rows="10" cols="40"/>
        </div>
      </template>
    </pv-card>
  </div>
  <br>
  <div class="flex">
    <pv-card class="card-content">
      <template #header>
        <p class="text">Location of Attendees:</p>
      </template>
      <template #content>
        <div class="spacer-left">
          <div class="flex">
            <p class="line">Local:</p>
            <div class="flex-auto">
              <pv-input-number v-model="local" inputId="minmax-buttons" mode="decimal" :min="0" :max="100"/>
            </div>
          </div>
          <div class="flex">
            <p class="line">National:</p>
            <div class="flex-auto">
              <pv-input-number v-model="national" inputId="minmax-buttons" mode="decimal" :min="0" :max="100"/>
            </div>
          </div>
          <div class="flex">
            <p class="line">international:</p>
            <div class="flex-auto">
              <pv-input-number v-model="international" inputId="minmax-buttons" mode="decimal" :min="0" :max="100"/>
            </div>
          </div>
        </div>
      </template>
    </pv-card>
    <pv-card class="card-content">
      <template #header>
        <p class="text">Satisfaction survey:</p>
      </template>
      <template #content>
        <div class="spacer-left">
          <div class="flex">
            <p class="line">Very dissatisfied:</p>
            <div class="flex-auto">
              <pv-input-number v-model="veryDissatisfied" inputId="minmax-buttons" mode="decimal" :min="0" :max="100"/>
            </div>
          </div>
          <div class="flex">
            <p class="line">Dissatisfied:</p>
            <div class="flex-auto">
              <pv-input-number v-model="dissatisfied" inputId="minmax-buttons" mode="decimal" :min="0" :max="100"/>
            </div>
          </div>
          <div class="flex">
            <p class="line">Neutral:</p>
            <div class="flex-auto">
              <pv-input-number v-model="neutral" inputId="minmax-buttons" mode="decimal" :min="0" :max="100"/>
            </div>
          </div>
          <div class="flex">
            <p class="line">Satisfied:</p>
            <div class="flex-auto">
              <pv-input-number v-model="satisfied" inputId="minmax-buttons" mode="decimal" min="0" :max="100"/>
            </div>
          </div>
          <div class="flex">
            <p class="line">Very satisfied:</p>
            <div class="flex-auto">
              <pv-input-number v-model="verySatisfied" inputId="minmax-buttons" mode="decimal" min="0" :max="100"/>
            </div>
          </div>
        </div>
      </template>
    </pv-card>
    <pv-card class="card-content">
      <template #content>
        <div class="icon">
          <i class="pi pi-plus" style="font-size: 3rem; color: green"></i>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<style scoped>
.spacer-left {
  margin-right: 20px;
  margin-left: 30px;
}

.spacer-bottom {
  margin-bottom: 20px;
}

.card-content {
  width: 25rem;
  height: 17.9rem;
  overflow: hidden;
  background-color: #E6F4E2;
  margin-right: 1rem;
}

@media (max-width: 767px) {
  .flex {
    flex-direction: column;
    gap: 20px;
  }
}

.flex {
  display: flex;
}

.text {
  padding-left: 30px;
  padding-top: 20px;
  padding-bottom: 10px;
}

.line {
  margin-bottom: 2rem;
  margin-right: 1rem;
}

.icon {
  padding-top: 5.5rem;
  padding-left: 11rem;
}
</style>