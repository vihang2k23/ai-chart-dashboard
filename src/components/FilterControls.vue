<template>
  <div class="filter-controls glass">
    <div class="filter-section">
      <label class="filter-label">
        <span class="label-icon">📅</span>
        Time Range
      </label>
      <div class="filter-buttons">
        <button
          v-for="range in timeRanges"
          :key="range.value"
          @click="selectTimeRange(range.value)"
          :class="['filter-btn', { active: selectedTimeRange === range.value }]"
        >
          {{ range.label }}
        </button>
      </div>
    </div>

    <div class="filter-section">
      <label class="filter-label">
        <span class="label-icon">📊</span>
        Chart Type
      </label>
      <div class="filter-buttons">
        <button
          v-for="type in chartTypes"
          :key="type.value"
          @click="selectChartType(type.value)"
          :class="['filter-btn', { active: selectedChartType === type.value }]"
          :title="type.description"
        >
          <span class="btn-icon">{{ type.icon }}</span>
          {{ type.label }}
        </button>
      </div>
    </div>

    <div class="filter-section" v-if="showDatasetSelector">
      <label class="filter-label">
        <span class="label-icon">💾</span>
        Dataset
      </label>
      <div class="filter-buttons">
        <button
          v-for="dataset in datasets"
          :key="dataset.value"
          @click="selectDataset(dataset.value)"
          :class="['filter-btn', { active: selectedDataset === dataset.value }]"
        >
          {{ dataset.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";

export default {
  name: "FilterControls",
  props: {
    initialTimeRange: {
      type: String,
      default: "all",
      validator: (value) =>
        ["last3months", "last6months", "all"].includes(value),
    },
    initialChartType: {
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
    initialDataset: {
      type: String,
      default: "monthly",
    },
    showDatasetSelector: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    "time-range-change",
    "chart-type-change",
    "dataset-change",
    "filter-change",
  ],
  setup(props, { emit }) {
    const selectedTimeRange = ref(props.initialTimeRange);
    const selectedChartType = ref(props.initialChartType);
    const selectedDataset = ref(props.initialDataset);

    const timeRanges = [
      { label: "Last 3 Months", value: "last3months" },
      { label: "Last 6 Months", value: "last6months" },
      { label: "All Time", value: "all" },
    ];

    const chartTypes = [
      {
        label: "Bar",
        value: "bar",
        icon: "📊",
        description: "Compare values across categories",
      },
      {
        label: "Line",
        value: "line",
        icon: "📈",
        description: "Show trends over time",
      },
      {
        label: "Pie",
        value: "pie",
        icon: "🥧",
        description: "Show proportions of a whole",
      },
      {
        label: "Doughnut",
        value: "doughnut",
        icon: "🍩",
        description: "Show proportions with center space",
      },
      {
        label: "Radar",
        value: "radar",
        icon: "🕸️",
        description: "Compare multiple variables",
      },
      {
        label: "Polar Area",
        value: "polarArea",
        icon: "❄️",
        description: "Polar area chart",
      },
      {
        label: "Bubble",
        value: "bubble",
        icon: "🫧",
        description: "3D data visualization",
      },
      {
        label: "Scatter",
        value: "scatter",
        icon: "📍",
        description: "Correlation between variables",
      },
    ];

    const datasets = [
      { label: "Monthly Sales", value: "monthly" },
      { label: "Products", value: "product" },
      { label: "Quarterly", value: "quarterly" },
      { label: "Departments", value: "department" },
      { label: "Simple Sales (User)", value: "simple" },
    ];

    const selectTimeRange = (range) => {
      selectedTimeRange.value = range;
      emit("time-range-change", range);
      emitFilterChange();
    };

    const selectChartType = (type) => {
      selectedChartType.value = type;
      emit("chart-type-change", type);
      emitFilterChange();
    };

    const selectDataset = (dataset) => {
      selectedDataset.value = dataset;
      emit("dataset-change", dataset);
      emitFilterChange();
    };

    const emitFilterChange = () => {
      emit("filter-change", {
        timeRange: selectedTimeRange.value,
        chartType: selectedChartType.value,
        dataset: selectedDataset.value,
      });
    };

    return {
      selectedTimeRange,
      selectedChartType,
      selectedDataset,
      timeRanges,
      chartTypes,
      datasets,
      selectTimeRange,
      selectChartType,
      selectDataset,
    };
  },
};
</script>

<style scoped>
.filter-controls {
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  margin-bottom: 1.5rem;
  animation: fadeIn 0.3s ease;
}

.filter-section {
  margin-bottom: 1.5rem;
}

.filter-section:last-child {
  margin-bottom: 0;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.label-icon {
  font-size: 1.1rem;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.6rem 1rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: inherit;
}

.filter-btn:hover {
  background: var(--bg-secondary);
  border-color: rgba(102, 126, 234, 0.5);
  color: var(--text-primary);
  transform: translateY(-1px);
}

.filter-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.filter-btn.active:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.btn-icon {
  font-size: 1rem;
  line-height: 1;
}

@media (max-width: 768px) {
  .filter-controls {
    padding: 1rem;
  }

  .filter-buttons {
    gap: 0.4rem;
  }

  .filter-btn {
    padding: 0.5rem 0.8rem;
    font-size: 0.8rem;
  }
}
</style>
