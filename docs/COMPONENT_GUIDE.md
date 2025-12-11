# Component Usage Guide

This guide provides detailed documentation for all reusable components in the AI Chart Dashboard.

## Table of Contents

- [ChartDisplay Component](#chartdisplay-component)
- [FilterControls Component](#filtercontrols-component)
- [PromptInput Component](#promptinput-component)
- [Usage Examples](#usage-examples)

---

## ChartDisplay Component

The most versatile component for rendering charts. Supports two usage patterns for maximum flexibility.

### Import

```javascript
import ChartDisplay from "./components/ChartDisplay.vue";
```

### Props

| Prop              | Type         | Default              | Description                                  |
| ----------------- | ------------ | -------------------- | -------------------------------------------- |
| `chartConfig`     | Object       | `null`               | Complete Chart.js configuration object       |
| `chartType`       | String       | `'bar'`              | Chart type: 'bar', 'line', 'pie', 'doughnut' |
| `labels`          | Array        | `[]`                 | Array of labels for chart axes               |
| `values`          | Array        | `[]`                 | Array of data values                         |
| `datasetLabel`    | String       | `'Data'`             | Label for the dataset                        |
| `title`           | String       | `''`                 | Chart title                                  |
| `emptyMessage`    | String       | `'Send a prompt...'` | Message shown when no data                   |
| `showClear`       | Boolean      | `true`               | Show clear button                            |
| `showExport`      | Boolean      | `true`               | Show export button                           |
| `backgroundColor` | String/Array | `null`               | Custom background colors                     |
| `borderColor`     | String/Array | `null`               | Custom border colors                         |

### Events

| Event    | Payload | Description                                       |
| -------- | ------- | ------------------------------------------------- |
| `clear`  | -       | Emitted when chart is cleared                     |
| `export` | `url`   | Emitted when chart is exported (base64 image URL) |

### Usage Pattern 1: With chartConfig

Use this when you have a complete Chart.js configuration (e.g., from AI service):

```vue
<template>
  <ChartDisplay
    :chart-config="chartConfig"
    @clear="handleClear"
    @export="handleExport"
  />
</template>

<script>
import { ref } from "vue";
import ChartDisplay from "./components/ChartDisplay.vue";

export default {
  components: { ChartDisplay },
  setup() {
    const chartConfig = ref({
      type: "bar",
      data: {
        labels: ["Jan", "Feb", "Mar"],
        datasets: [
          {
            label: "Sales",
            data: [100, 200, 150],
            backgroundColor: "rgba(102, 126, 234, 0.6)",
          },
        ],
      },
      options: {
        responsive: true,
        // ... other options
      },
    });

    const handleClear = () => {
      chartConfig.value = null;
    };

    const handleExport = (imageUrl) => {
      console.log("Chart exported:", imageUrl);
    };

    return { chartConfig, handleClear, handleExport };
  },
};
</script>
```

### Usage Pattern 2: With Individual Props

Use this for simple, modular chart creation:

```vue
<template>
  <ChartDisplay
    chart-type="line"
    :labels="months"
    :values="salesData"
    dataset-label="Monthly Sales"
    title="Sales Performance 2024"
    :show-clear="false"
  />
</template>

<script>
import { ref } from "vue";
import ChartDisplay from "./components/ChartDisplay.vue";

export default {
  components: { ChartDisplay },
  setup() {
    const months = ref(["Jan", "Feb", "Mar", "Apr", "May", "Jun"]);
    const salesData = ref([2000, 2500, 1800, 2200, 2800, 3200]);

    return { months, salesData };
  },
};
</script>
```

### Custom Colors Example

```vue
<ChartDisplay
  chart-type="bar"
  :labels="['Q1', 'Q2', 'Q3', 'Q4']"
  :values="[75000, 89000, 82000, 95000]"
  dataset-label="Revenue"
  title="Quarterly Revenue"
  background-color="rgba(245, 87, 108, 0.6)"
  border-color="rgba(245, 87, 108, 1)"
/>
```

---

## FilterControls Component

A comprehensive filtering UI for time ranges, chart types, and datasets.

### Import

```javascript
import FilterControls from "./components/FilterControls.vue";
```

### Props

| Prop                  | Type    | Default     | Validator                           | Description                  |
| --------------------- | ------- | ----------- | ----------------------------------- | ---------------------------- |
| `initialTimeRange`    | String  | `'all'`     | 'last3months', 'last6months', 'all' | Initial time range selection |
| `initialChartType`    | String  | `'bar'`     | 'bar', 'line', 'pie', 'doughnut'    | Initial chart type           |
| `initialDataset`      | String  | `'monthly'` | -                                   | Initial dataset selection    |
| `showDatasetSelector` | Boolean | `false`     | -                                   | Show/hide dataset selector   |

### Events

| Event               | Payload  | Description                     |
| ------------------- | -------- | ------------------------------- |
| `time-range-change` | `string` | Emitted when time range changes |
| `chart-type-change` | `string` | Emitted when chart type changes |
| `dataset-change`    | `string` | Emitted when dataset changes    |
| `filter-change`     | `object` | Emitted with all filter values  |

### Basic Usage

```vue
<template>
  <FilterControls
    initial-time-range="last6months"
    initial-chart-type="line"
    @filter-change="handleFilterChange"
  />
</template>

<script>
import FilterControls from "./components/FilterControls.vue";

export default {
  components: { FilterControls },
  setup() {
    const handleFilterChange = (filters) => {
      console.log("Filters:", filters);
      // filters = { timeRange: 'last6months', chartType: 'line', dataset: 'monthly' }
    };

    return { handleFilterChange };
  },
};
</script>
```

### With Dataset Selector

```vue
<FilterControls
  :show-dataset-selector="true"
  initial-dataset="product"
  @dataset-change="handleDatasetChange"
  @filter-change="handleFilterChange"
/>
```

### Individual Event Handlers

```vue
<template>
  <FilterControls
    @time-range-change="onTimeRangeChange"
    @chart-type-change="onChartTypeChange"
    @dataset-change="onDatasetChange"
  />
</template>

<script>
export default {
  setup() {
    const onTimeRangeChange = (range) => {
      console.log("Time range:", range); // 'last3months', 'last6months', or 'all'
    };

    const onChartTypeChange = (type) => {
      console.log("Chart type:", type); // 'bar', 'line', 'pie', or 'doughnut'
    };

    const onDatasetChange = (dataset) => {
      console.log("Dataset:", dataset); // 'monthly', 'product', etc.
    };

    return { onTimeRangeChange, onChartTypeChange, onDatasetChange };
  },
};
</script>
```

---

## PromptInput Component

A text input component for AI-powered chart generation with example prompts.

### Import

```javascript
import PromptInput from "./components/PromptInput.vue";
```

### Props

| Prop      | Type    | Default | Description        |
| --------- | ------- | ------- | ------------------ |
| `loading` | Boolean | `false` | Show loading state |

### Events

| Event            | Payload  | Description                                |
| ---------------- | -------- | ------------------------------------------ |
| `generate-chart` | `string` | Emitted with prompt text when user submits |

### Basic Usage

```vue
<template>
  <PromptInput :loading="isGenerating" @generate-chart="handleGenerate" />
</template>

<script>
import { ref } from "vue";
import PromptInput from "./components/PromptInput.vue";
import aiService from "./services/aiService";

export default {
  components: { PromptInput },
  setup() {
    const isGenerating = ref(false);

    const handleGenerate = async (prompt) => {
      isGenerating.value = true;
      try {
        const result = await aiService.generateChart(prompt);
        console.log("Chart generated:", result);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        isGenerating.value = false;
      }
    };

    return { isGenerating, handleGenerate };
  },
};
</script>
```

---

## Usage Examples

### Example 1: Simple Dashboard with Manual Chart

```vue
<template>
  <div class="dashboard">
    <h1>Sales Dashboard</h1>
    <ChartDisplay
      chart-type="bar"
      :labels="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']"
      :values="[2000, 2500, 1800, 2200, 2800, 3200]"
      dataset-label="Sales"
      title="Monthly Sales Performance"
    />
  </div>
</template>

<script>
import ChartDisplay from "./components/ChartDisplay.vue";

export default {
  components: { ChartDisplay },
};
</script>
```

### Example 2: Dashboard with Filtering

```vue
<template>
  <div class="dashboard">
    <FilterControls
      :show-dataset-selector="true"
      @filter-change="updateChart"
    />
    <ChartDisplay
      :chart-type="filters.chartType"
      :labels="chartLabels"
      :values="chartValues"
      :title="chartTitle"
    />
  </div>
</template>

<script>
import { ref, computed } from "vue";
import ChartDisplay from "./components/ChartDisplay.vue";
import FilterControls from "./components/FilterControls.vue";
import {
  monthlySalesData,
  filterByTimeRange,
  extractMetric,
} from "./data/sampleData";

export default {
  components: { ChartDisplay, FilterControls },
  setup() {
    const filters = ref({
      timeRange: "all",
      chartType: "bar",
      dataset: "monthly",
    });

    const chartLabels = computed(() => {
      const filtered = filterByTimeRange(
        monthlySalesData,
        filters.value.timeRange
      );
      return extractMetric(filtered, "sales").labels;
    });

    const chartValues = computed(() => {
      const filtered = filterByTimeRange(
        monthlySalesData,
        filters.value.timeRange
      );
      return extractMetric(filtered, "sales").values;
    });

    const chartTitle = computed(() => {
      return `Monthly Sales (${filters.value.timeRange})`;
    });

    const updateChart = (newFilters) => {
      filters.value = newFilters;
    };

    return { filters, chartLabels, chartValues, chartTitle, updateChart };
  },
};
</script>
```

### Example 3: AI-Powered Dashboard

```vue
<template>
  <div class="dashboard">
    <PromptInput :loading="loading" @generate-chart="generateChart" />
    <ChartDisplay
      v-if="chartConfig"
      :chart-config="chartConfig"
      @clear="chartConfig = null"
    />
  </div>
</template>

<script>
import { ref } from "vue";
import PromptInput from "./components/PromptInput.vue";
import ChartDisplay from "./components/ChartDisplay.vue";
import aiService from "./services/aiService";

export default {
  components: { PromptInput, ChartDisplay },
  setup() {
    const chartConfig = ref(null);
    const loading = ref(false);

    const generateChart = async (prompt) => {
      loading.value = true;
      try {
        const result = await aiService.generateChart(prompt);
        if (result.success) {
          chartConfig.value = result.chartConfig;
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        loading.value = false;
      }
    };

    return { chartConfig, loading, generateChart };
  },
};
</script>
```

### Example 4: Multiple Charts

```vue
<template>
  <div class="multi-chart-dashboard">
    <div class="chart-grid">
      <ChartDisplay
        chart-type="bar"
        :labels="months"
        :values="sales"
        title="Sales"
      />
      <ChartDisplay
        chart-type="line"
        :labels="months"
        :values="revenue"
        title="Revenue"
      />
      <ChartDisplay
        chart-type="pie"
        :labels="products"
        :values="productSales"
        title="Product Distribution"
      />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import ChartDisplay from "./components/ChartDisplay.vue";

export default {
  components: { ChartDisplay },
  setup() {
    const months = ref(["Jan", "Feb", "Mar", "Apr", "May", "Jun"]);
    const sales = ref([2000, 2500, 1800, 2200, 2800, 3200]);
    const revenue = ref([2500, 2800, 2200, 2600, 3100, 3500]);
    const products = ref(["Product A", "Product B", "Product C", "Product D"]);
    const productSales = ref([12500, 9800, 15200, 7600]);

    return { months, sales, revenue, products, productSales };
  },
};
</script>

<style scoped>
.chart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}
</style>
```

---

## Best Practices

### 1. Choose the Right Pattern

- Use **chartConfig** when working with AI-generated charts or complex configurations
- Use **individual props** for simple, static charts or when you want maximum control

### 2. Handle Loading States

Always show loading indicators when generating charts:

```vue
<PromptInput :loading="isLoading" @generate-chart="handleGenerate" />
```

### 3. Validate Data

Ensure labels and values arrays have the same length:

```javascript
if (labels.length !== values.length) {
  console.error("Labels and values must have the same length");
}
```

### 4. Responsive Design

Charts automatically resize, but consider container sizing:

```css
.chart-container {
  max-width: 900px;
  margin: 0 auto;
}
```

### 5. Error Handling

Always handle errors when generating charts:

```javascript
try {
  const result = await aiService.generateChart(prompt);
  // handle success
} catch (error) {
  console.error("Chart generation failed:", error);
  // show error message to user
}
```

---

## TypeScript Support

While this project uses JavaScript, here are the type definitions for reference:

```typescript
// ChartDisplay Props
interface ChartDisplayProps {
  chartConfig?: ChartConfiguration | null;
  chartType?: "bar" | "line" | "pie" | "doughnut";
  labels?: string[];
  values?: number[];
  datasetLabel?: string;
  title?: string;
  emptyMessage?: string;
  showClear?: boolean;
  showExport?: boolean;
  backgroundColor?: string | string[];
  borderColor?: string | string[];
}

// FilterControls Props
interface FilterControlsProps {
  initialTimeRange?: "last3months" | "last6months" | "all";
  initialChartType?: "bar" | "line" | "pie" | "doughnut";
  initialDataset?: string;
  showDatasetSelector?: boolean;
}

// PromptInput Props
interface PromptInputProps {
  loading?: boolean;
}
```

---

For more examples and advanced usage, see the main [README.md](../README.md).
