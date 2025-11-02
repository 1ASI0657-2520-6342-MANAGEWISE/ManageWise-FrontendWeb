<script>
export default {
  name: "modal-card-content",
  props: ['selectedCard'],
  emits: ['close'],
  data() {
    return {
        hasUpdated: false
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },

    onUpdate() {
      this.hasUpdated = true;
    }
  }
}
</script>

<template>
  <section
      class="modal-background w-full bg-white-alpha-40 absolute top-0 left-0 bottom-0 right-0 flex align-items-center justify-content-center">
    <div v-if="selectedCard === 'stats'" class="modal z-5 p-5 border-round-2xl shadow-2">
      <div class="flex flex-row justify-content-between mb-5 align-items-center">
        <p class="text-xl font-medium">You are edit on <span class="text-green-700">Current Status</span></p>
        <i class="pi pi-times cursor-pointer shadow-2 border-gray-600
          bg-white border-round mb-1 hover:bg-green-700
          hover:text-white transition-all transition-duration-300 animation-ease-in"
           @click="closeModal()"
           style="font-size: 1.2rem; padding: 5px"></i>
      </div>
      <form class="flex flex-column gap-4" @submit.prevent="onUpdate()">
        <div class="flex flex-row justify-content-between flex-wrap">
          <label class="w-13rem stats-label">Time:</label>
          <div class="flex flex-row flex-1 justify-content-between flex-wrap gap-2">
            <input type="number" class="w-3rem"/>
            <p class="font-light">% ahead of schedule</p>
          </div>
        </div>
        <div class="flex flex-row justify-content-between flex-wrap">
          <label class="w-13rem stats-label">Tasks:</label>
          <div class="flex flex-row flex-1 justify-content-between flex-wrap gap-2">
            <input type="number" class="w-3rem"/>
            <p class="font-light">tasks to complete</p>
          </div>
        </div>
        <div class="flex flex-row justify-content-between flex-wrap">
          <label class="w-13rem stats-label">Workload:</label>
          <div class="flex flex-row flex-1 justify-content-between flex-wrap gap-2">
            <input type="number" class="w-3rem"/>
            <p class="font-light">tasks overdue</p>
          </div>
        </div>
        <div class="flex flex-row justify-content-between flex-wrap">
          <label class="w-13rem stats-label">Progress:</label>
          <div class="flex flex-row flex-1 justify-content-between flex-wrap gap-2">
            <input type="number" class="w-3rem"/>
            <p class="font-light">% completed</p>
          </div>
        </div>
        <div class="flex flex-row justify-content-between flex-wrap">
          <label class="w-13rem stats-label">Cost:</label>
          <div class="flex flex-row flex-1 justify-content-between flex-wrap gap-2">
            <input type="number" class="w-3rem"/>
            <p class="font-light">% under beaget</p>
          </div>
        </div>
        <button class="mt-3 align-self-end shadow-1 border-1 border-gray-300 uppercase py-2 px-5
          font-medium text-base cursor-pointer border-round-2xl
          hover:bg-green-700 hover:text-white transition-duration-200 transition-all animation-ease-in"
                style="letter-spacing: 1px; justify-self: center">
          update
        </button>
      </form>
    </div>
    <div v-if="selectedCard === 'tasks'" class="modal z-5 p-5 border-round-2xl shadow-2">
      <div class="flex flex-row justify-content-between mb-5 align-items-center">
        <p class="text-xl font-medium">You are edit on <span class="text-green-700">Tasks</span></p>
        <i class="pi pi-times cursor-pointer shadow-2 border-gray-600
          bg-white border-round mb-1 hover:bg-green-700
          hover:text-white transition-all transition-duration-300 animation-ease-in"
           @click="closeModal()"
           style="font-size: 1.2rem; padding: 5px"></i>
      </div>
      <div class="flex flex-row align-items-center justify-content-between flex-wrap gap-2">
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
        <form class="flex flex-column align-items-center" @submit.prevent="onUpdate()">
          <div class="flex relative">
            <img src="../../../assets/image-chart-ball.png" class="w-14rem h-full"/>
            <div class="flex absolute flex-column py-5 w-full h-full top-0 left-0">
              <div class="flex flex-row justify-content-between">
                <input class="w-3rem p-1" placeholder="200"/>
                <input class="w-3rem p-1" placeholder="100"/>
              </div>
              <div class="flex-1 flex flex-col align-items-end justify-content-end">
                <input class="w-3rem p-1 h-2rem border-1" placeholder="300"/>
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
      </div>
    </div>
    <div v-if="selectedCard === 'payments'" class="modal z-5 p-5 border-round-2xl shadow-2">
      <div class="flex flex-row justify-content-between mb-4 align-items-center">
        <p class="text-xl font-medium">You are edit on <span class="text-green-700">Payments</span></p>
        <i class="pi pi-times cursor-pointer shadow-2 border-gray-600
          bg-white border-round mb-1 hover:bg-green-700
          hover:text-white transition-all transition-duration-300 animation-ease-in"
           @click="closeModal()"
           style="font-size: 1.2rem; padding: 5px"></i>
      </div>
      <div class="flex flex-column gap-3 align-items-center relative mt-0 w-full">
        <form class="flex flex-column align-items-center w-full" @submit.prevent="onUpdate()">
          <div class="flex flex-column w-full gap-4">
            <div class="flex flex-column">
              <p class="mb-3">Transportation:</p>
              <div class="label-container flex flex-row justify-content-between w-full px-5 flex-wrap gap-3">
                <div class="flex flex-row gap-2">
                  <label class="font-light">Current:</label>
                  <input class="w-3rem"/>
                </div>
                <div class="flex flex-row gap-2">
                  <label class="font-light">Expected:</label>
                  <input class="w-3rem"/>
                </div>
              </div>
            </div>
            <div class="flex flex-column">
              <p class="mb-3">Food:</p>
              <div class="label-container flex flex-row justify-content-between w-full px-5 flex-wrap gap-3">
                <div class="flex flex-row gap-2">
                  <label class="font-light">Current:</label>
                  <input class="w-3rem"/>
                </div>
                <div class="flex flex-row gap-2">
                  <label class="font-light">Expected:</label>
                  <input class="w-3rem"/>
                </div>
              </div>
            </div>
            <div class="flex flex-column">
              <p class="mb-3">Water:</p>
              <div class="label-container flex flex-row justify-content-between w-full px-5 flex-wrap gap-3">
                <div class="flex flex-row gap-2">
                  <label class="font-light">Current:</label>
                  <input class="w-3rem"/>
                </div>
                <div class="flex flex-row gap-2">
                  <label class="font-light">Expected:</label>
                  <input class="w-3rem"/>
                </div>
              </div>
            </div>
          </div>
          <div class="my-6 flex">
            <img src="../../../assets/image-paymant-progress.png" class="w-full sm:w-26rem h-full"/>
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
      </div>
    </div>
    <div v-if="selectedCard === 'progress'" class="modal-progress z-5 p-5 border-round-2xl shadow-2">
      <div class="flex flex-row justify-content-between mb-4 align-items-center">
        <p class="text-xl font-medium">You are edit on <span class="text-green-700">Payments</span></p>
        <i class="pi pi-times cursor-pointer shadow-2 border-gray-600
          bg-white border-round mb-1 hover:bg-green-700
          hover:text-white transition-all transition-duration-300 animation-ease-in"
           @click="closeModal()"
           style="font-size: 1.2rem; padding: 5px"></i>
      </div>
      <div class="flex flex-column gap-3 align-items-center relative mt-0 w-full">
        <form class="flex flex-column align-items-center w-full" @submit.prevent="onUpdate()">
          <p class="font-medium w-full mb-3 text-green-700">Current - Months:</p>
          <div class="flex flex-column w-full gap-3">
            <div class="flex flex-column">
              <div class="flex flex-row justify-content-between">
                <div class="flex flex-row gap-2">
                  <label>Jan</label>
                  <input class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Feb</label>
                  <input class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Mar</label>
                  <input class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Apr</label>
                  <input class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>May</label>
                  <input class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Jun</label>
                  <input class="w-3rem">
                </div>
              </div>
            </div>
            <div class="flex flex-column">
              <div class="flex flex-row justify-content-between">
                <div class="flex flex-row gap-2">
                  <label>Jul</label>
                  <input class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Aug</label>
                  <input class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Sep</label>
                  <input class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Oct</label>
                  <input class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Nov</label>
                  <input class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Dec</label>
                  <input class="w-3rem">
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
                  <input class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Feb</label>
                  <input class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Mar</label>
                  <input class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Apr</label>
                  <input class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>May</label>
                  <input class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Jun</label>
                  <input class="w-3rem">
                </div>
              </div>
            </div>
            <div class="flex flex-column">
              <div class="flex flex-row justify-content-between">
                <div class="flex flex-row gap-2">
                  <label>Jul</label>
                  <input class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Aug</label>
                  <input class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Sep</label>
                  <input class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Oct</label>
                  <input class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Nov</label>
                  <input class="w-3rem">
                </div>
                <div class="flex flex-row gap-2">
                  <label>Dec</label>
                  <input class="w-3rem">
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
      </div>
    </div>
    <div v-if="selectedCard === 'stadistics'" class="modal z-5 p-5 border-round-2xl shadow-2">
      <div class="flex flex-row justify-content-between mb-4 align-items-center">
        <p class="text-xl font-medium">You are edit on <span class="text-green-700">Payments</span></p>
        <i class="pi pi-times cursor-pointer shadow-2 border-gray-600
          bg-white border-round mb-1 hover:bg-green-700
          hover:text-white transition-all transition-duration-300 animation-ease-in"
           @click="closeModal()"
           style="font-size: 1.2rem; padding: 5px"></i>
      </div>
      <div class="flex flex-column gap-3 align-items-center relative mt-0 w-full">
        <form class="flex flex-column align-items-center w-full" @submit.prevent="onUpdate()">
          <div class="flex flex-column w-full gap-4">
            <div class="flex flex-column">
              <p class="mb-3">Actual:</p>
              <div class="label-container flex flex-row justify-content-between w-full px-5 flex-wrap gap-3">
                <div class="flex flex-row gap-2">
                  <label class="font-light">Current:</label>
                  <input class="w-3rem"/>
                </div>
                <div class="flex flex-row gap-2">
                  <label class="font-light">Expected:</label>
                  <input class="w-3rem"/>
                </div>
              </div>
            </div>
            <div class="flex flex-column">
              <p class="mb-3">Planned:</p>
              <div class="label-container flex flex-row justify-content-between w-full px-5 flex-wrap gap-3">
                <div class="flex flex-row gap-2">
                  <label class="font-light">Current:</label>
                  <input class="w-3rem"/>
                </div>
                <div class="flex flex-row gap-2">
                  <label class="font-light">Expected:</label>
                  <input class="w-3rem"/>
                </div>
              </div>
            </div>
            <div class="flex flex-column">
              <p class="mb-3">Budget:</p>
              <div class="label-container flex flex-row justify-content-between w-full px-5 flex-wrap gap-3">
                <div class="flex flex-row gap-2">
                  <label class="font-light">Current:</label>
                  <input class="w-3rem"/>
                </div>
                <div class="flex flex-row gap-2">
                  <label class="font-light">Expected:</label>
                  <input class="w-3rem"/>
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
      </div>
    </div>
  </section>
  <pv-dialog :style="{margin: '0 10px'}" :visible.sync="hasUpdated" :modal="true" :closable="false">
    <div class="error-modal p-5 flex flex-column align-items-center gap-5 text-center">
      <i class="text-7xl pi pi-check-circle text-green-700"></i>
      <h1>Update Successful!</h1>
      <p class="text-md">The data has been successfully updated</p>
      <pv-button class="py-3 px-5" label="OK" @click="hasUpdated = false"/>
    </div>
  </pv-dialog>
</template>

<style scoped>

.modal-background {
  backdrop-filter: blur(1px);
  min-height: inherit;
}

.modal-background::before {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.15); /* Ajusta la opacidad según tus necesidades */
}

.modal {
  width: 95%;
  margin-inline: auto;
  max-width: 500px;
  background-color: #E6F4E2;
  padding: 20px 0;
  max-height: 100%;
}

.modal-progress {
  width: 95%;
  margin-inline: auto;
  max-width: 650px;
  background-color: #E6F4E2;
  padding: 50px;
  max-height: 100%;
}

.modal-progress label {
  width: 2rem;
}

.modal input {
  text-indent: 5px;
}

@media (max-width: 499px) {

  .stats-label {
    width: 7rem !important;
  }

  .label-container {
    padding: 0 !important;
  }

}

</style>