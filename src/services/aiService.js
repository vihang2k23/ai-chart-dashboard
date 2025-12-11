import axios from "axios";
import {
  getSampleDataForPrompt,
  detectChartType,
  detectMetric,
  extractMetric,
  filterByTimeRange,
} from "../data/sampleData.js";

/**
 * AI Service for generating chart data from natural language prompts
 * Supports both OpenAI API and mock responses for testing
 */

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const USE_MOCK_AI =
  import.meta.env.VITE_USE_MOCK_AI === "true" || !OPENAI_API_KEY;

console.log("AI Service Config:", {
  hasApiKey: !!OPENAI_API_KEY,
  useMock: USE_MOCK_AI,
  envMockValue: import.meta.env.VITE_USE_MOCK_AI,
});

/**
 * Generate chart using OpenAI API
 * @param {string} prompt - Natural language prompt
 * @returns {Promise<Object>} Chart configuration
 */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.openai.com/v1";

async function generateChartWithOpenAI(prompt) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/completions`,
      {
        model: "gpt-3.5-turbo-instruct",
        prompt: `You are a data visualization expert. Given a user's request, generate a JSON object for creating charts.

User Request: ${prompt}

Response format:
{
  "chartType": "bar" | "line" | "pie" | "doughnut" | "radar" | "polarArea" | "bubble" | "scatter",
  "labels": ["Label1", "Label2", ...],
  "values": [value1, value2, ...],
  "datasetLabel": "Dataset Name",
  "title": "Chart Title"
}

Only respond with valid JSON, no additional text.`,
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "HTTP-Referer": window.location.origin, // Required for OpenRouter
          "X-Title": "AI Chart Dashboard", // Required for OpenRouter
        },
      }
    );

    const aiResponse = response.data.choices[0].text;
    const chartData = JSON.parse(aiResponse);

    return {
      success: true,
      source: "openai",
      chartConfig: buildChartConfig(chartData),
      message: `Generated ${chartData.chartType} chart using OpenAI (Completions)`,
    };
  } catch (error) {
    console.error("OpenAI API Error:", error.response?.data || error.message);
    throw error;
  }
}

/**
 * Generate chart using mock AI (sample data)
 * @param {string} prompt - Natural language prompt
 * @returns {Promise<Object>} Chart configuration
 */
async function generateChartWithMock(prompt) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Get relevant sample data based on prompt
  const { dataset, type, suggestedMetrics } = getSampleDataForPrompt(prompt);

  // Detect chart type from prompt
  const chartType = detectChartType(prompt);

  // Detect metric to display
  const metric = detectMetric(prompt, suggestedMetrics);

  // Detect time range filter
  let timeRange = "all";
  const lowerPrompt = prompt.toLowerCase();
  if (
    lowerPrompt.includes("last 3 months") ||
    lowerPrompt.includes("3 months")
  ) {
    timeRange = "last3months";
  } else if (
    lowerPrompt.includes("last 6 months") ||
    lowerPrompt.includes("6 months")
  ) {
    timeRange = "last6months";
  }

  // Filter data by time range
  const filteredData = filterByTimeRange(dataset, timeRange);

  // Extract labels and values
  const { labels, values } = extractMetric(filteredData, metric);

  const chartData = {
    chartType,
    labels,
    values,
    datasetLabel: `${metric.charAt(0).toUpperCase() + metric.slice(1)} Data`,
    title: generateTitle(prompt, type, metric, timeRange),
  };

  return {
    success: true,
    source: "mock",
    chartConfig: buildChartConfig(chartData),
    message: `Generated ${chartType} chart using sample data`,
  };
}

/**
 * Generate a descriptive title based on prompt analysis
 * @param {string} prompt - User prompt
 * @param {string} type - Data type
 * @param {string} metric - Metric being displayed
 * @param {string} timeRange - Time range filter
 * @returns {string} Chart title
 */
function generateTitle(prompt, type, metric, timeRange) {
  const metricName = metric.charAt(0).toUpperCase() + metric.slice(1);
  const rangeText =
    timeRange === "last3months"
      ? " (Last 3 Months)"
      : timeRange === "last6months"
      ? " (Last 6 Months)"
      : "";

  if (type === "monthly") {
    return `Monthly ${metricName}${rangeText}`;
  } else if (type === "product") {
    return `Product-wise ${metricName}`;
  } else if (type === "quarterly") {
    return `Quarterly ${metricName}`;
  } else if (type === "department") {
    return `Department ${metricName}`;
  }

  return `${metricName} Analysis${rangeText}`;
}

/**
 * Build Chart.js configuration from AI response
 * @param {Object} chartData - Structured chart data from AI
 * @returns {Object} Chart.js configuration
 */
function buildChartConfig(chartData) {
  const { chartType, labels, values, datasetLabel, title } = chartData;

  // Color schemes for different chart types
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

  const colors = colorSchemes[chartType] || colorSchemes.bar;

  const config = {
    type: chartType,
    data: {
      labels,
      datasets: [
        {
          label: datasetLabel || "Data",
          data: values,
          backgroundColor: colors.backgroundColor,
          borderColor: colors.borderColor,
          borderWidth: 2,
          tension:
            chartType === "line" || chartType === "radar" ? 0.4 : undefined,
          fill:
            chartType === "line" || chartType === "radar" ? true : undefined,
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
            chartType === "pie" ||
            chartType === "doughnut" ||
            chartType === "polarArea"
              ? "right"
              : "top",
          labels: {
            color: "#ffffff",
            font: {
              size: 12,
            },
          },
        },
        title: {
          display: !!title,
          text: title,
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
  if (chartType === "radar" || chartType === "polarArea") {
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
  } else if (chartType !== "pie" && chartType !== "doughnut") {
    config.options.scales = {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#b4b4c5",
          font: {
            size: 11,
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      x: {
        ticks: {
          color: "#b4b4c5",
          font: {
            size: 11,
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    };
  }

  return config;
}

/**
 * Main function to generate chart from prompt
 * @param {string} prompt - Natural language prompt for chart generation
 * @returns {Promise<Object>} Chart configuration object
 */
export async function generateChart(prompt) {
  try {
    // Use OpenAI if API key is available and not in mock mode
    if (!USE_MOCK_AI && OPENAI_API_KEY) {
      try {
        return await generateChartWithOpenAI(prompt);
      } catch (error) {
        console.warn(
          "OpenAI failed, falling back to mock data:",
          error.message
        );
        return await generateChartWithMock(prompt);
      }
    } else {
      // Use mock data
      return await generateChartWithMock(prompt);
    }
  } catch (error) {
    console.error("Chart generation error:", error);
    return {
      success: false,
      message: error.message || "Failed to generate chart",
      error: error,
    };
  }
}

/**
 * Get chart configuration directly from structured data
 * Useful for manual chart creation without AI
 * @param {Object} params - Chart parameters
 * @returns {Object} Chart configuration
 */
export function createChartConfig({
  chartType,
  labels,
  values,
  datasetLabel,
  title,
}) {
  return buildChartConfig({ chartType, labels, values, datasetLabel, title });
}

/**
 * Generate text response using OpenAI API
 * @param {string} prompt - User prompt
 * @returns {Promise<string>} AI response
 */
async function generateTextWithOpenAI(prompt) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/chat/completions`,
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a helpful AI assistant for a business dashboard. 
            You have access to the following company data:
            - Monthly Sales: Jan-Dec data, increasing trend.
            - Product Sales: Product A (12500), B (9800), C (15200), D (7600), E (11300).
            - Quarterly Revenue: Q1 (75k), Q2 (89k), Q3 (82k), Q4 (95k).
            - Department Budget: Engineering (45k), Marketing (30k), Sales (35k), Operations (25k), HR (15k).
            - Employees: 150 total across 3 offices.
            
            Answer questions based on this data. Keep answers concise and professional.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 150,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "HTTP-Referer": window.location.origin, // Required for OpenRouter
          "X-Title": "AI Chart Dashboard", // Required for OpenRouter
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API Error:", error.response?.data || error.message);
    throw error;
  }
}

export async function generateTextResponse(prompt) {
  // Use OpenAI if API key is available and not in mock mode
  if (!USE_MOCK_AI && OPENAI_API_KEY) {
    try {
      return await generateTextWithOpenAI(prompt);
    } catch (error) {
      console.warn("OpenAI failed, falling back to mock text:", error.message);
    }
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes("revenue")) {
    return "The company's total revenue for the current fiscal year is $12.5M, with a 15% increase compared to last year. Q3 contributed the most with $4.2M.";
  } else if (lowerPrompt.includes("sales")) {
    return "Total sales volume has reached 45,000 units. The top-selling product is 'AI Dashboard Pro' with 12,000 units sold.";
  } else if (lowerPrompt.includes("profit")) {
    return "Net profit margin is currently at 22%, which is 5% higher than the industry average. Total net profit stands at $2.75M.";
  } else if (lowerPrompt.includes("growth")) {
    return "Year-over-year growth is strong at 18%. We are seeing significant expansion in the Asian and European markets.";
  } else if (
    lowerPrompt.includes("employee") ||
    lowerPrompt.includes("staff")
  ) {
    return "We currently have 150 employees across 3 offices. The engineering team has grown by 20% this quarter.";
  } else {
    return "I can provide information about company revenue, sales, profit, growth, and employee statistics. What would you like to know?";
  }
}

export default {
  generateChart,
  createChartConfig,
  generateTextResponse,
};
