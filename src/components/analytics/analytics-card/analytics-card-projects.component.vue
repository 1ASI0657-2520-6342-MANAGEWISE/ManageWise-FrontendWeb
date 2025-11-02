<script>
import AnalyticsChartVerticalBar
  from "@/components/analytics/analytics-chart/analytics-chart-vertical-bar.component.vue";
import AnalyticsChartLine from "@/components/analytics/analytics-chart/analytics-chart-line.component.vue";
import AnalyticsChartHorizontalBar
  from "@/components/analytics/analytics-chart/analytics-chart-horizontal-bar.component.vue";
import AnalyticsChartDoughnut
  from "@/components/analytics/analytics-chart/analytics-chart-doughnut.component.vue";
import { analytic } from "@/models/analytic.entity.js";
import { AnalyticsService } from "@/services/analytics.service.js";
import AnalyticsCardReport from "@/components/analytics/analytics-card/analytics-card-report.component.vue";
import DropdownAnalytics from "@/components/analytics/dropdown-analytics/dropdown-analytics.component.vue";
import LinesModalContent from "@/components/analytics/lines-modal/lines-modal-content.component.vue";
import PaymentsModalContent from "@/components/analytics/payments-modal/payments-modal-content.component.vue";
import ProgressbarModalContent from "@/components/analytics/progressbar-modal/progressbar-modal-content.component.vue";
import StatsModalContent from "@/components/analytics/stats-modal/stats-modal-content.component.vue";
import TasksModalContent from "@/components/analytics/tasks-modal/tasks-modal-content.component.vue";
import ProjectsService from "@/public/projects.service.js";
import { fetchTaskData } from '@/services/projects-api.services.js';

export default {
  name: "analytics-card-projects",
  components: {
    TasksModalContent,
    StatsModalContent,
    ProgressbarModalContent,
    PaymentsModalContent,
    LinesModalContent,
    DropdownAnalytics,
    AnalyticsCardReport,
    AnalyticsChartVerticalBar, AnalyticsChartLine, AnalyticsChartHorizontalBar, AnalyticsChartDoughnut
  },
  data() {
    return {
      analytics: analytic,
      AnalyticsApiService: new AnalyticsService(),
      projectsService: new ProjectsService(),
      selectedCard: null,
      showDialog: false,
      showLinesChart: true,
      chartKey: 0,
      selectedProjectId: null,
      projectTasks: [] // <-- Aquí guardamos las tareas del proyecto seleccionado
    }
  },
  async created() {

  },
  methods: {
    handleIdProjectSelected(projectId) {
      console.log('Project ID selected:', projectId);
      if (!projectId) return;
      this.selectedProjectId = projectId;
      this.loadProjectTasks(projectId);
      this.getAnalyticsByProject(projectId);
    },

    async loadProjectTasks(projectId) {
      try {
        const tasks = await fetchTaskData(projectId);
        this.projectTasks = tasks;
        console.log('Tareas del proyecto seleccionado:', tasks);
      } catch (e) {
        this.projectTasks = [];
        console.error('Error al cargar tareas del proyecto:', e);
      }
    },

    handleNoProjects() {
      this.analytics = null;
    },

    updateAnalytics(analytics) {
    },

    async getAnalyticsByProject(projectId) {
      await this.AnalyticsApiService.getAnalyticsByProjectId(projectId)
        .then(r => {
          console.log(r.data);
          if (!r) console.error('Error to get analytics');
          else {
            this.analytics = r.data;
          }
        })
    },

    async handleButtonClick() {
      this.showLinesChart = false;

      // Espera 3 segundos (3000 milisegundos)
      await new Promise(resolve => setTimeout(resolve, 3000));

      this.showLinesChart = true;
      this.$forceUpdate();
    }
  }
}
</script>
<template>
  <section class="h-full p-4 lg:p-5 w-full relative" style="min-height: 100%">
    <div class="flex flex-row justify-content-between flex-wrap gap-0">
      <div class="flex flex-column gap-4" style="width: unset">
        <h2 class="title-analytics text-4xl" v-t="'analytics.analytics'"></h2>
        <dropdown-analytics @no-projects="handleNoProjects"
          @project-selected="handleIdProjectSelected"></dropdown-analytics>
      </div>
      <div class="align-self-center border-1 flex align-items-center
        flex-row border-round-2xl text-white mb-2"
        style="width: unset; background-color: #293A80; padding: 15px 20px; gap: 10px">
        <p class="w-max">You can view</p>
        <i class="text-lg pi pi-eye text-green-100"></i>
      </div>
    </div>
    <div v-if="analytics && analytics.status" class="analytics-container">
      <pv-card class="card stats w-full p-4 cursor-pointer" @click="selectedCard = 'stats'">
        <template #header>
          <p class="font-medium mb-3">Currents Status:</p>
        </template>
        <template #content>
          <ul class="flex flex-column flex-1 h-full gap-3">
            <li class="flex flex-row justify-content-between">
              <p>Time</p>
              <span class="text-green-700 font-light">{{ analytics?.status[0] }} ahead of schedule</span>
            </li>
            <li class="flex flex-row justify-content-between">
              <p>Tasks</p>
              <span class="text-green-700 font-light">{{ analytics?.status[1] }} tasks to be completed</span>
            </li>
            <li class="flex flex-row justify-content-between">
              <p>Workload</p>
              <span class="text-green-700 font-light">{{ analytics?.status[2] }} tasks overdue</span>
            </li>
            <li class="flex flex-row justify-content-between">
              <p>Progress</p>
              <span class="text-green-700 font-light">{{ analytics?.status[3] }} complete</span>
            </li>
            <li class="flex flex-row justify-content-between">
              <p>Cost</p>
              <span class="text-green-700 font-light">{{ analytics?.status[4] }} under buget</span>
            </li>
          </ul>
        </template>
      </pv-card>
      <pv-card class="card tasks flex w-full flex-column cursor-pointer" @click="selectedCard = 'tasks'">
        <template #header>
          <p class="text">Tasks aa:</p>
        </template>
        <template #content>
          <div class="flex w-full">
            <analytics-chart-doughnut :project-id="selectedProjectId" :tasks="projectTasks"></analytics-chart-doughnut>
          </div>
        </template>
      </pv-card>
      <pv-card class="card payments flex w-full flex-column w-full cursor-pointer" @click="selectedCard = 'payments'">
        <template #header>
          <p class="text">Expected payments:</p>
        </template>
        <template #content>
          <div class="graph">
            <analytics-chart-horizontal-bar :analytics="analytics"></analytics-chart-horizontal-bar>
          </div>
        </template>
      </pv-card>
      <pv-card class="card progress flex w-full flex-column w-full cursor-pointer" @click="selectedCard = 'lines'">
        <template #header>
          <p class="text">Progress:</p>
        </template>
        <template #content>
          <div class="flex">
            <analytics-chart-line :analytics="analytics" :key="chartKey"></analytics-chart-line>
          </div>
        </template>
      </pv-card>
      <pv-card class="card flex w-full flex-column cost cursor-pointer" @click="selectedCard = 'progressbar'">
        <template #header>
          <p class="text">Progress:</p>
        </template>
        <template #content>
          <div class="flex">
            <analytics-chart-vertical-bar :analytics="analytics"></analytics-chart-vertical-bar>
          </div>
        </template>
      </pv-card>
    </div>
    <section v-else>
      <div class="flex flex-column align-items-center justify-content-center h-full">
        <p class="text-2xl font-medium">No projects found</p>
      </div>
    </section>
  </section>
</template>

<style scoped>
.card:hover {
  background-color: #F5F5F5;
}

.title-analytics {
  font-family: 'Lora', serif;
  color: #02513D;
  font-weight: 600 !important;
  letter-spacing: 1.05px;
}

.analytics-container {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: auto 1fr;
  gap: 20px;
}

.stats {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
}

.tasks {
  grid-column: 3 / 5;
  grid-row: 1 / 2;
}

.payments {
  grid-column: 5 / 7;
  grid-row: 1 / 2;
}

.progress {
  grid-column: 1 / 4;
  grid-row: 2 / 3;
}

.cost {
  grid-column: 4 / 7;
  grid-row: 2 / 3;
}

@media (max-width: 1024px) {
  .analytics-container {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(5, auto);
  }

  .stats,
  .tasks,
  .payments,
  .progress,
  .cost {
    grid-column: 1 / 2;
  }

  .stats {
    grid-row: 1 / 2;
  }

  .tasks {
    grid-row: 2 / 3;
  }

  .payments {
    grid-row: 3 / 4;
  }

  .progress {
    grid-row: 4 / 5;
  }

  .cost {
    grid-row: 5 / 6;
  }
}

.flex {
  display: flex;
  justify-content: center;
  width: 100%;
}

.text {
  padding-left: 30px;
  padding-top: 20px;
  padding-bottom: 10px;
}

.paragraph {
  margin-right: 6rem;
  padding-left: 40px;
}

.icon {
  padding-top: 5.5rem;
  padding-left: 11rem;
}

.line {
  margin-bottom: 1rem;
}
</style>