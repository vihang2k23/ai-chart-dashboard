<template>
  <div id="app">
    <header class="app-header">
      <h1>🤖 AI Chart Dashboard</h1>
      <p class="subtitle">
        Generate beautiful charts with AI or explore sample data
      </p>

      <div class="mode-toggle">
        <button
          @click="mode = 'ai'"
          :class="['mode-btn', { active: mode === 'ai' }]"
        >
          ✨ AI Mode
        </button>
        <button
          @click="mode = 'manual'"
          :class="['mode-btn', { active: mode === 'manual' }]"
        >
          🎯 Manual Mode
        </button>
        <button
          @click="mode = 'chat'"
          :class="['mode-btn', { active: mode === 'chat' }]"
        >
          💬 Chat Assistant
        </button>
      </div>
    </header>

    <main class="app-main">
      <!-- AI Mode: Prompt-based chart generation -->
      <div v-if="mode === 'ai'" class="mode-content">
        <PromptInput @generate-chart="handleGenerateChart" :loading="loading" />
        <ChartDisplay
          v-if="chartData"
          :chart-config="chartData"
          @clear="handleClearChart"
        />
      </div>

      <!-- Manual Mode: Filter-based chart generation -->
      <div v-else-if="mode === 'manual'" class="mode-content">
        <FilterControls
          :initial-time-range="filters.timeRange"
          :initial-chart-type="filters.chartType"
          :initial-dataset="filters.dataset"
          :show-dataset-selector="true"
          @filter-change="handleFilterChange"
        />
        <ChartDisplay
          v-if="manualChartData"
          :chart-config="manualChartData"
          @clear="handleClearManualChart"
        />
      </div>

      <!-- Chat Mode: Text-based assistant -->
      <div v-else-if="mode === 'chat'" class="mode-content">
        <ChatBoard @send-prompt="handleChatPrompt" ref="chatBoard" />
      </div>
    </main>

    <!-- Info Panel -->
    <div class="info-panel glass" v-if="lastMessage">
      <div class="info-content">
        <span class="info-icon">ℹ️</span>
        <span class="info-text">{{ lastMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import PromptInput from "./components/PromptInput.vue";
import ChartDisplay from "./components/ChartDisplay.vue";
import FilterControls from "./components/FilterControls.vue";
import ChatBoard from "./components/ChatBoard.vue";
import aiService from "./services/aiService";
import {
  monthlySalesData,
  productSalesData,
  quarterlyRevenueData,
  departmentBudgetData,
  simpleSalesData,
  filterByTimeRange,
  extractMetric,
} from "./data/sampleData";

export default {
  name: "App",
  components: {
    PromptInput,
    ChartDisplay,
    FilterControls,
    ChatBoard,
  },
  setup() {
    const mode = ref("ai");
    const chartData = ref(null);
    const manualChartData = ref(null);
    const loading = ref(false);
    const lastMessage = ref("");
    const chatBoard = ref(null);

    const filters = ref({
      timeRange: "all",
      chartType: "bar",
      dataset: "monthly",
    });

    // Handle AI-generated chart
    const handleGenerateChart = async (prompt) => {
      loading.value = true;
      lastMessage.value = "Generating chart...";

      try {
        const result = await aiService.generateChart(prompt);
        if (result.success && result.chartConfig) {
          chartData.value = result.chartConfig;
          lastMessage.value = result.message + ` (Source: ${result.source})`;

          // Auto-hide message after 5 seconds
          setTimeout(() => {
            lastMessage.value = "";
          }, 5000);
        } else {
          throw new Error(result.message || "Failed to generate chart");
        }
      } catch (error) {
        console.error("Error generating chart:", error);
        lastMessage.value = "Failed to generate chart. Please try again.";
        setTimeout(() => {
          lastMessage.value = "";
        }, 5000);
      } finally {
        loading.value = false;
      }
    };

    const handleClearChart = () => {
      chartData.value = null;
      lastMessage.value = "Chart cleared";
      setTimeout(() => {
        lastMessage.value = "";
      }, 3000);
    };

    // Handle manual chart generation with filters
    const handleFilterChange = (newFilters) => {
      filters.value = { ...newFilters };
      generateManualChart();
    };

    const generateManualChart = () => {
      const { timeRange, chartType, dataset } = filters.value;

      // Get the appropriate dataset
      let data;
      let metric = "sales";
      let title = "";

      switch (dataset) {
        case "monthly":
          data = monthlySalesData;
          metric = "sales";
          title = "Monthly Sales";
          break;
        case "product":
          data = productSalesData;
          metric = "sales";
          title = "Product Sales";
          break;
        case "quarterly":
          data = quarterlyRevenueData;
          metric = "revenue";
          title = "Quarterly Revenue";
          break;
        case "department":
          data = departmentBudgetData;
          metric = "budget";
          title = "Department Budget";
          break;
        case "simple":
          data = simpleSalesData;
          metric = "sales";
          title = "Simple Sales Data";
          break;
        default:
          data = monthlySalesData;
          metric = "sales";
          title = "Monthly Sales";
      }

      // Apply time range filter (only for monthly data)
      if (dataset === "monthly") {
        data = filterByTimeRange(data, timeRange);
        if (timeRange === "last3months") title += " (Last 3 Months)";
        if (timeRange === "last6months") title += " (Last 6 Months)";
      }

      // Extract labels and values
      const { labels, values } = extractMetric(data, metric);

      // Build chart config
      manualChartData.value = aiService.createChartConfig({
        chartType,
        labels,
        values,
        datasetLabel: metric.charAt(0).toUpperCase() + metric.slice(1),
        title,
      });

      lastMessage.value = `Chart updated: ${title} (${chartType})`;
      setTimeout(() => {
        lastMessage.value = "";
      }, 3000);
    };

    const handleClearManualChart = () => {
      manualChartData.value = null;
      lastMessage.value = "Chart cleared";
      setTimeout(() => {
        lastMessage.value = "";
      }, 3000);
    };

    // Handle Chat Prompt
    const handleChatPrompt = async (prompt) => {
      if (!chatBoard.value) return;

      chatBoard.value.setLoading(true);

      try {
        // Check if the user is asking for a chart in chat mode
        if (
          prompt.toLowerCase().includes("chart") ||
          prompt.toLowerCase().includes("graph")
        ) {
          // If asking for chart, suggest switching to AI mode or generate text about data
          chatBoard.value.addAIResponse(
            "I notice you're asking for a chart. For visual charts, please switch to 'AI Mode'. Here, I can provide text-based insights about company details, revenue, sales, etc."
          );
        } else {
          // Generate text response
          const response = await aiService.generateTextResponse(prompt);
          chatBoard.value.addAIResponse(response);
        }
      } catch (error) {
        console.error("Error in chat:", error);
        chatBoard.value.addAIResponse(
          "Sorry, I encountered an error processing your request."
        );
      } finally {
        chatBoard.value.setLoading(false);
      }
    };

    // Generate initial manual chart
    watch(mode, (newMode) => {
      if (newMode === "manual" && !manualChartData.value) {
        generateManualChart();
      }
    });

    return {
      mode,
      chartData,
      manualChartData,
      loading,
      lastMessage,
      filters,
      handleGenerateChart,
      handleClearChart,
      handleFilterChange,
      handleClearManualChart,
      handleChatPrompt,
      chatBoard,
    };
  },
};
</script>

<style scoped>
#app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.app-header {
  text-align: center;
  color: white;
  margin-bottom: 2rem;
}

.app-header h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
}

.mode-toggle {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.mode-btn {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.mode-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
}

.mode-btn.active {
  background: white;
  color: #667eea;
  border-color: white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.app-main {
  max-width: 1200px;
  margin: 0 auto;
}

.mode-content {
  animation: fadeIn 0.4s ease;
}

.info-panel {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  max-width: 400px;
  padding: 1rem 1.5rem;
  border-radius: var(--radius-lg);
  animation: slideIn 0.3s ease;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.info-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.info-icon {
  font-size: 1.5rem;
}

.info-text {
  color: var(--text-primary);
  font-size: 0.9rem;
  line-height: 1.4;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  #app {
    padding: 1rem;
  }

  .app-header h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .mode-toggle {
    flex-direction: column;
    gap: 0.5rem;
  }

  .mode-btn {
    width: 100%;
  }

  .info-panel {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    max-width: none;
  }
}
</style>
