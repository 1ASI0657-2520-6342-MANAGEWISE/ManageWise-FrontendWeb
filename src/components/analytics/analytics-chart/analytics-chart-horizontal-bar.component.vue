<script>
import {analytic} from "@/models/analytic.entity.js";
import {AnalyticsService} from "@/services/analytics.service.js";

export default {
  name: 'analytics-chart-horizontal-bar',
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
        this.chartData = this.setChartData();
        this.chartOptions = this.setChartOptions();
      },
      deep: true
    }
  },
  async created() {


    this.chartData = this.setChartData();
    this.chartOptions = this.setChartOptions();
  },
  methods: {
    setChartData() {
      const documentStyle = getComputedStyle(document.documentElement);

      const payments = this.analytics.payments;

      const midIndex = Math.ceil(payments?.length / 2);
      const currentData = payments?.slice(0, midIndex);
      const expectedData = payments?.slice(midIndex);

      return {
        labels: ['Transportation', 'Food', 'Water'],
        datasets: [
          {
            label: 'Current',
            backgroundColor: documentStyle.getPropertyValue('--green-300'),
            borderColor: documentStyle.getPropertyValue('--green-300'),
            data: currentData
          },
          {
            label: 'Expected',
            backgroundColor: documentStyle.getPropertyValue('--green-500'),
            borderColor: documentStyle.getPropertyValue('--green-500'),
            data: expectedData
          }
        ]
      };
    },
    setChartOptions() {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      return {
        indexAxis: 'y',
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
  <div class="card w-full flex p-3">
    <pv-chart type="bar" :data="chartData" :options="chartOptions" class="h-12rem w-full"/>
  </div>
</template>
