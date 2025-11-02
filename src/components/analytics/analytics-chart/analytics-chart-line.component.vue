<script>
import {analytic} from "@/models/analytic.entity.js";
import {AnalyticsService} from "@/services/analytics.service.js";

export default {
  name: 'analytics-chart-line',
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
        this.updateChartData();
      },
      deep: true
    }
  },
  async created() {
    this.updateChartData();
  },
  methods: {

    updateChartData() {
      if (this.analytics && this.analytics.linesChartBarData && this.analytics.linesChartBarData.length > 0) {
        // Usar linesChartBarData del backend para el gráfico de líneas
        const lineData = this.analytics.linesChartBarData[0];
        const data = [
          lineData.sunAmount ?? lineData.data1 ?? 0,
          lineData.monAmount ?? lineData.data2 ?? 0,
          lineData.tueAmount ?? lineData.data3 ?? 0,
          lineData.wedAmount ?? lineData.data4 ?? 0,
          lineData.thuAmount ?? lineData.data5 ?? 0,
          lineData.friAmount ?? lineData.data6 ?? 0,
          lineData.satAmount ?? lineData.data7 ?? 0
        ];
        console.log('LineChart - Datos recibidos para linesChartBarData:', this.analytics.linesChartBarData);
        console.log('LineChart - Datos procesados para gráfico:', data);
        this.chartData = this.setChartData(data);
        this.chartOptions = this.setChartOptions(data);
      } else if (this.analytics && this.analytics.lines) {
        // Fallback: lógica anterior
        const currentData = this.analytics.lines.slice(0, 12);
        const expectedData = this.analytics.lines.slice(12, 24);
        console.log('LineChart - Datos recibidos para lines:', this.analytics.lines);
        this.chartData = this.setChartData(currentData, expectedData);
        this.chartOptions = this.setChartOptions(currentData, expectedData);
      }
    },

    setChartData(data, expectedData) {
      const documentStyle = getComputedStyle(document.documentElement);
      // Si solo hay un array (por semana), muestra una sola línea
      if (data && !expectedData) {
        return {
          labels: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
          datasets: [
            {
              label: 'Actividad semanal',
              data: data,
              fill: false,
              backgroundColor: documentStyle.getPropertyValue('--green-300'),
              borderColor: documentStyle.getPropertyValue('--green-300'),
              tension: 0.4
            }
          ]
        };
      }
      // ...lógica anterior para current/expected...
      return {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'september', 'October', 'November', 'december'],
        datasets: [
          {
            label: 'Current',
            data: data,
            fill: false,
            backgroundColor: documentStyle.getPropertyValue('--green-300'),
            borderColor: documentStyle.getPropertyValue('--green-300'),
            tension: 0.4
          },
          {
            label: 'Expected',
            data: expectedData,
            fill: false,
            backgroundColor: documentStyle.getPropertyValue('--green-500'),
            borderColor: documentStyle.getPropertyValue('--green-500'),
            tension: 0.4
          }
        ]
      };
    },
    setChartOptions(data, expectedData) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
      return {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
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
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder
            }
          },
          y: {
            ticks: {
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder
            }
          }
        }
      };
    }
  }
};
</script>
<template>
  <div class="card w-full flex p-3">
    <pv-chart type="line" :data="chartData" :options="chartOptions" class="w-full h-12rem"/>
  </div>
</template>

<style scoped>

</style>