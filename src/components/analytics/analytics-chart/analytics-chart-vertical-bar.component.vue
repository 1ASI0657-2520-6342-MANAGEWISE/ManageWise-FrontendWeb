<script>
import {analytic} from "@/models/analytic.entity.js";
import {AnalyticsService} from "@/services/analytics.service.js";

export default {
  name: 'analytics-chart-vertical-bar',
  props: {
    analytics: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chartData: null,
      chartOptions: null,
    };
  },
  watch: {
    analytics: {
      handler() {
        // Actualiza los datos y opciones del gráfico cuando cambian los datos analíticos
        this.chartData = this.setChartData();
        this.chartOptions = this.setChartOptions();
      },
      deep: true
    }
  },
  async created() {
    // Inicializa los datos y opciones del gráfico al crear el componente
    this.chartData = this.setChartData();
    this.chartOptions = this.setChartOptions();
  },
  methods: {
    setChartData() {
      const documentStyle = getComputedStyle(document.documentElement);
      // Obtener el arreglo de progreso desde las props
      const progressbar = this.analytics?.progressbar;
      // te maldigo 👩‍🦲
      if (progressbar) {
        // Dividir el arreglo en 3 segmentos iguales
        const segmentSize = progressbar.length / 3;
        const currentDataActual = progressbar.slice(0, segmentSize);
        const currentDataPlanned = progressbar.slice(segmentSize, 2 * segmentSize);
        const currentDataBudget = progressbar.slice(2 * segmentSize);
        // Retornar la estructura de datos para el gráfico de barras
        return {
          labels: ['Actual', 'Planned', 'Budget'],
          datasets: [
            {
              label: 'Current',
              backgroundColor: documentStyle.getPropertyValue('--green-300'),
              borderColor: documentStyle.getPropertyValue('--green-300'),
              data: [currentDataActual[0], currentDataPlanned[0], currentDataBudget[0]]
            },
            {
              label: 'Expected',
              backgroundColor: documentStyle.getPropertyValue('--green-500'),
              borderColor: documentStyle.getPropertyValue('--green-500'),
              data: [currentDataActual[1], currentDataPlanned[1], currentDataBudget[1]]
            }
          ]
        };
      }
    },
    setChartOptions() {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      return {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          legend: {
            labels: {
              color: textColor
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
              font: {
                weight: 500
              }
            },
            grid: {
              display: false,
              drawBorder: false
            }
          },
          y: {
            ticks: {
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false
            }
          }
        }
      };
    }
  }
};
</script>
<template>
  <div class="card w-full p-5 flex">
    <pv-chart type="bar" :data="chartData" :options="chartOptions" class="h-12rem w-full"/>
  </div>
</template>
<style scoped>
</style>