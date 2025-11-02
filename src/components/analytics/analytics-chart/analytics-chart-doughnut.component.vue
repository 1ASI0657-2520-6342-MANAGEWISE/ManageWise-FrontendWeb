<script>
import {AnalyticsService} from "@/services/analytics.service.js";
import {analytic} from "@/models/analytic.entity.js";
import { fetchTaskData, fetchTasksByCompanyId } from "@/services/projects-api.services";
export default {
  name: 'analytics-chart-doughnut',
  props: {
    analytics: {
      type: Object,
      required: false // Cambiado para evitar warning si no se pasa
    },
    selectedProjectId: {
      type: String,
      default: null
    },
    tasks: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chartData: null,
      chartOptions: {
        cutout: '60%'
      }
    };
  },
  watch: {
    tasks: {
      handler() {
        this.chartData = this.setChartData();
      },
      immediate: true,
      deep: true
    },
    analytics: {
      handler() {
        this.chartData = this.setChartData();
        this.chartOptions = this.setChartOptions();
      },
      deep: true
    },
    selectedProjectId: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.loadTasks();
        } else {
          this.allTasks = [];
        }
      }
    }
  },
  async created() {
    if (this.selectedProjectId) {
      await this.loadTasks();
    }
    this.chartData = this.setChartData();
    this.chartOptions = this.setChartOptions();
  },
  methods: {
    async loadTasks() {
      try {
        if (this.selectedProjectId) {
          this.allTasks = await fetchTaskData(this.selectedProjectId);
          console.log('DoughnutChart - Tareas cargadas para el proyecto:', this.selectedProjectId, this.allTasks);
        } else {
          this.allTasks = [];
          console.log('DoughnutChart - Sin proyecto seleccionado');
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
        this.allTasks = [];
      }
    },

    calculateTaskPercentages() {
      if (!this.tasks || this.tasks.length === 0) {
        return [0, 0, 0];
      }

      const totalTasks = this.tasks.length;
      const taskCounts = {
        'ToDo': 0,
        'InProgress': 0,
        'Done': 0
      };

      // Contar tareas por estado
      this.tasks.forEach(task => {
        if (task.state === 'To-Do') {
          taskCounts.ToDo++;
        } else if (task.state === 'Doing') {
          taskCounts.InProgress++;
        } else if (task.state === 'Done') {
          taskCounts.Done++;
        }
      });

      // Calcular porcentajes
      const todoPercentage = Math.round((taskCounts.ToDo / totalTasks) * 100);
      const inProgressPercentage = Math.round((taskCounts.InProgress / totalTasks) * 100);
      const donePercentage = Math.round((taskCounts.Done / totalTasks) * 100);

      return [todoPercentage, inProgressPercentage, donePercentage];
    },

    setChartData() {
      const documentStyle = getComputedStyle(document.body);
      
      // Usar datos calculados de las tareas reales
      const taskPercentages = this.calculateTaskPercentages();

      return {
        labels: ['To-Do', 'In Progress', 'Done'],
        datasets: [
          {
            data: taskPercentages,
            backgroundColor: [
              documentStyle.getPropertyValue('--teal-200'), 
              documentStyle.getPropertyValue('--orange-200'), 
              documentStyle.getPropertyValue('--green-500')
            ],
            hoverBackgroundColor: [
              documentStyle.getPropertyValue('--teal-300'), 
              documentStyle.getPropertyValue('--orange-300'), 
              documentStyle.getPropertyValue('--green-600')
            ]
          }
        ]
      };
    },
    
    setChartOptions() {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      return {
        plugins: {
          legend: {
            labels: {
              color: textColor
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.label + ': ' + context.parsed + '%';
              }
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%'
      };
    }
  }
};
</script>

<template>
    <div class="card w-full h-full p-3 flex">
      <pv-chart type="doughnut" :data="chartData" :options="chartOptions" class="flex w-full h-12rem" />
    </div>
</template>

<style scoped>
</style>