<template>
  <div class="chart-display">
    <div v-if="!hasData" class="empty-state">
      <div class="empty-icon">📊</div>
      <h3>No Chart Yet</h3>
      <p>{{ emptyMessage }}</p>
    </div>

    <div v-else class="chart-container glass">
      <div class="chart-header">
        <h3>{{ chartTitle }}</h3>
        <div class="chart-actions">
          <button
            v-if="showExport"
            @click="exportChart"
            class="btn-action"
            title="Export chart as image"
          >
            <span>💾</span>
          </button>
          <button
            v-if="showClear"
            @click="clearChart"
            class="btn-action btn-clear"
            title="Clear chart"
          >
            <span>✕</span>
          </button>
        </div>
      </div>
      <div class="chart-wrapper">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import Chart from "chart.js/auto";

export default {
  name: "ChartDisplay",
  props: {
    // Option 1: Pass complete chart configuration
    chartConfig: {
      type: Object,
      default: null,
      validator: (config) => {
        if (!config) return true;
        return config.type && config.data;
      },
    },
    // Option 2: Pass individual props for modularity
    chartType: {
      type: String,
      default: "bar",
      validator: (value) =>
        [
          "bar",
          "line",
          "pie",
          "doughnut",
          "radar",
          "polarArea",
          "bubble",
          "scatter",
        ].includes(value),
    },
    labels: {
      type: Array,
      default: () => [],
    },
    values: {
      type: Array,
      default: () => [],
    },
    datasetLabel: {
      type: String,
      default: "Data",
    },
    title: {
      type: String,
      default: "",
    },
    // Display options
    emptyMessage: {
      type: String,
      default: "Send a prompt to generate a chart",
    },
    showClear: {
      type: Boolean,
      default: true,
    },
    showExport: {
      type: Boolean,
      default: true,
    },
    // Custom colors
    backgroundColor: {
      type: [String, Array],
      default: null,
    },
    borderColor: {
      type: [String, Array],
      default: null,
    },
  },
  emits: ["clear", "export"],
  setup(props, { emit }) {
    const chartCanvas = ref(null);
    let chartInstance = null;

    // Determine if we have data to display
    const hasData = computed(() => {
      if (props.chartConfig) {
        return true;
      }
      return props.labels.length > 0 && props.values.length > 0;
    });

    // Get chart title
    const chartTitle = computed(() => {
      if (props.chartConfig?.options?.plugins?.title?.text) {
        return props.chartConfig.options.plugins.title.text;
      }
      return props.title || "Generated Chart";
    });

    // Build chart configuration from props
    const buildConfigFromProps = () => {
      const colorSchemes = {
        bar: {
          backgroundColor: "rgba(102, 126, 234, 0.6)",
          borderColor: "rgba(102, 126, 234, 1)",
        },
        line: {
          backgroundColor: "rgba(79, 172, 254, 0.1)",
          borderColor: "rgba(79, 172, 254, 1)",
        },
        pie: {
          backgroundColor: [
            "rgba(102, 126, 234, 0.8)",
            "rgba(240, 147, 251, 0.8)",
            "rgba(79, 172, 254, 0.8)",
            "rgba(245, 87, 108, 0.8)",
            "rgba(118, 75, 162, 0.8)",
            "rgba(0, 242, 254, 0.8)",
          ],
          borderColor: "#1a1a2e",
        },
        doughnut: {
          backgroundColor: [
            "rgba(102, 126, 234, 0.8)",
            "rgba(240, 147, 251, 0.8)",
            "rgba(79, 172, 254, 0.8)",
            "rgba(245, 87, 108, 0.8)",
            "rgba(118, 75, 162, 0.8)",
            "rgba(0, 242, 254, 0.8)",
          ],
          borderColor: "#1a1a2e",
        },
        radar: {
          backgroundColor: "rgba(240, 147, 251, 0.2)",
          borderColor: "rgba(240, 147, 251, 1)",
        },
        polarArea: {
          backgroundColor: [
            "rgba(102, 126, 234, 0.6)",
            "rgba(240, 147, 251, 0.6)",
            "rgba(79, 172, 254, 0.6)",
            "rgba(245, 87, 108, 0.6)",
            "rgba(118, 75, 162, 0.6)",
            "rgba(0, 242, 254, 0.6)",
          ],
          borderColor: "#1a1a2e",
        },
        bubble: {
          backgroundColor: "rgba(245, 87, 108, 0.6)",
          borderColor: "rgba(245, 87, 108, 1)",
        },
        scatter: {
          backgroundColor: "rgba(0, 242, 254, 0.6)",
          borderColor: "rgba(0, 242, 254, 1)",
        },
      };

      const colors = colorSchemes[props.chartType] || colorSchemes.bar;

      const config = {
        type: props.chartType,
        data: {
          labels: props.labels,
          datasets: [
            {
              label: props.datasetLabel,
              data: props.values,
              backgroundColor: props.backgroundColor || colors.backgroundColor,
              borderColor: props.borderColor || colors.borderColor,
              borderWidth: 2,
              tension:
                props.chartType === "line" || props.chartType === "radar"
                  ? 0.4
                  : undefined,
              fill:
                props.chartType === "line" || props.chartType === "radar"
                  ? true
                  : undefined,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position:
                props.chartType === "pie" ||
                props.chartType === "doughnut" ||
                props.chartType === "polarArea"
                  ? "right"
                  : "top",
              labels: {
                color: "#ffffff",
                font: { size: 12 },
              },
            },
            title: {
              display: !!props.title,
              text: props.title,
              color: "#ffffff",
              font: {
                size: 16,
                weight: "bold",
              },
            },
            tooltip: {
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              titleColor: "#ffffff",
              bodyColor: "#ffffff",
              borderColor: "rgba(102, 126, 234, 0.5)",
              borderWidth: 1,
            },
          },
          scales: {},
        },
      };

      // Configure scales based on chart type
      if (props.chartType === "radar" || props.chartType === "polarArea") {
        config.options.scales = {
          r: {
            ticks: {
              color: "#b4b4c5",
              backdropColor: "transparent",
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            pointLabels: {
              color: "#ffffff",
              font: { size: 12 },
            },
          },
        };
      } else if (props.chartType !== "pie" && props.chartType !== "doughnut") {
        config.options.scales = {
          y: {
            beginAtZero: true,
            ticks: {
              color: "#b4b4c5",
              font: { size: 11 },
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
          x: {
            ticks: {
              color: "#b4b4c5",
              font: { size: 11 },
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
        };
      }

      return config;
    };

    const createChart = () => {
      if (!chartCanvas.value || !hasData.value) return;

      // Destroy existing chart
      if (chartInstance) {
        chartInstance.destroy();
      }

      // Get configuration
      const config = props.chartConfig || buildConfigFromProps();

      // Create new chart
      const ctx = chartCanvas.value.getContext("2d");
      chartInstance = new Chart(ctx, config);
    };

    const clearChart = () => {
      if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
      }
      emit("clear");
    };

    const exportChart = () => {
      if (chartInstance) {
        const url = chartInstance.toBase64Image();
        const link = document.createElement("a");
        link.download = `chart-${Date.now()}.png`;
        link.href = url;
        link.click();
        emit("export", url);
      }
    };

    // Watch for changes in props
    watch(
      () => [props.chartConfig, props.labels, props.values, props.chartType],
      () => {
        createChart();
      },
      { deep: true }
    );

    onMounted(() => {
      if (hasData.value) {
        createChart();
      }
    });

    onBeforeUnmount(() => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    });

    return {
      chartCanvas,
      hasData,
      chartTitle,
      clearChart,
      exportChart,
    };
  },
};
</script>

<style scoped>
.chart-display {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  min-height: 400px;
}

.empty-state {
  text-align: center;
  color: var(--text-secondary);
  animation: fadeIn 0.5s ease;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.empty-state p {
  font-size: 14px;
  color: var(--text-muted);
}

.chart-container {
  width: 100%;
  max-width: 900px;
  padding: 24px;
  border-radius: var(--radius-lg);
  animation: fadeIn 0.5s ease;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.chart-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  padding: 0;
}

.btn-action:hover {
  background: rgba(102, 126, 234, 0.1);
  border-color: rgba(102, 126, 234, 0.5);
  color: #667eea;
}

.btn-clear:hover {
  background: rgba(245, 87, 108, 0.1);
  border-color: rgba(245, 87, 108, 0.5);
  color: #f5576c;
}

.btn-action span {
  font-size: 18px;
  line-height: 1;
}

.chart-wrapper {
  position: relative;
  height: 400px;
  width: 100%;
}

canvas {
  max-width: 100%;
  max-height: 100%;
}

@media (max-width: 768px) {
  .chart-display {
    padding: 16px;
  }

  .chart-container {
    padding: 16px;
  }

  .chart-wrapper {
    height: 300px;
  }
}
</style>
