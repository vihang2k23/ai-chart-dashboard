/**
 * Sample Dataset for AI Chart Dashboard
 * This module provides hardcoded sample data for testing and demonstration
 */

// Monthly Sales Data (12 months)
export const monthlySalesData = [
  { month: "Jan", sales: 2000, expenses: 1500, revenue: 2500 },
  { month: "Feb", sales: 2500, expenses: 1600, revenue: 2800 },
  { month: "Mar", sales: 1800, expenses: 1400, revenue: 2200 },
  { month: "Apr", sales: 2200, expenses: 1550, revenue: 2600 },
  { month: "May", sales: 2800, expenses: 1700, revenue: 3100 },
  { month: "Jun", sales: 3200, expenses: 1800, revenue: 3500 },
  { month: "Jul", sales: 2900, expenses: 1750, revenue: 3200 },
  { month: "Aug", sales: 3100, expenses: 1850, revenue: 3400 },
  { month: "Sep", sales: 2700, expenses: 1650, revenue: 3000 },
  { month: "Oct", sales: 2400, expenses: 1600, revenue: 2700 },
  { month: "Nov", sales: 2600, expenses: 1700, revenue: 2900 },
  { month: "Dec", sales: 3400, expenses: 2000, revenue: 3800 },
];

// Product-wise Sales Data
export const productSalesData = [
  { product: "Product A", sales: 12500, growth: 15 },
  { product: "Product B", sales: 9800, growth: 8 },
  { product: "Product C", sales: 15200, growth: 22 },
  { product: "Product D", sales: 7600, growth: -5 },
  { product: "Product E", sales: 11300, growth: 12 },
];

// Quarterly Revenue Data
export const quarterlyRevenueData = [
  { quarter: "Q1 2024", revenue: 75000, target: 70000 },
  { quarter: "Q2 2024", revenue: 89000, target: 85000 },
  { quarter: "Q3 2024", revenue: 82000, target: 90000 },
  { quarter: "Q4 2024", revenue: 95000, target: 95000 },
];

// Department Budget Data
export const departmentBudgetData = [
  { department: "Engineering", budget: 45000, spent: 42000 },
  { department: "Marketing", budget: 30000, spent: 28500 },
  { department: "Sales", budget: 35000, spent: 33000 },
  { department: "Operations", budget: 25000, spent: 24000 },
  { department: "HR", budget: 15000, spent: 14200 },
];

// Simple Sales Data (User provided)
export const simpleSalesData = [
  { month: "Jan", sales: 2000 },
  { month: "Feb", sales: 2500 },
  { month: "Mar", sales: 1800 },
  { month: "Apr", sales: 2200 },
];

/**
 * Filter data by time range
 * @param {Array} data - The data array to filter
 * @param {string} range - 'last3months', 'last6months', or 'all'
 * @returns {Array} Filtered data
 */
export function filterByTimeRange(data, range = "all") {
  if (!Array.isArray(data) || data.length === 0) return data;

  switch (range) {
    case "last3months":
      return data.slice(-3);
    case "last6months":
      return data.slice(-6);
    case "all":
    default:
      return data;
  }
}

/**
 * Get data by metric type
 * @param {Array} data - The data array
 * @param {string} metric - 'sales', 'revenue', 'expenses', etc.
 * @returns {Object} Object with labels and values
 */
export function extractMetric(data, metric = "sales") {
  if (!Array.isArray(data) || data.length === 0) {
    return { labels: [], values: [] };
  }

  const labels = data.map(
    (item) => item.month || item.product || item.quarter || item.department
  );
  const values = data.map((item) => item[metric] || 0);

  return { labels, values };
}

/**
 * Get sample data based on prompt keywords
 * @param {string} prompt - User's natural language prompt
 * @returns {Object} Relevant sample data
 */
export function getSampleDataForPrompt(prompt) {
  const lowerPrompt = prompt.toLowerCase();

  // Monthly sales patterns
  if (lowerPrompt.includes("monthly") || lowerPrompt.includes("month")) {
    return {
      dataset: monthlySalesData,
      type: "monthly",
      suggestedMetrics: ["sales", "revenue", "expenses"],
    };
  }

  // Product patterns
  if (lowerPrompt.includes("product")) {
    return {
      dataset: productSalesData,
      type: "product",
      suggestedMetrics: ["sales", "growth"],
    };
  }

  // Quarterly patterns
  if (
    lowerPrompt.includes("quarter") ||
    lowerPrompt.includes("q1") ||
    lowerPrompt.includes("q2")
  ) {
    return {
      dataset: quarterlyRevenueData,
      type: "quarterly",
      suggestedMetrics: ["revenue", "target"],
    };
  }

  // Department/Budget patterns
  if (lowerPrompt.includes("department") || lowerPrompt.includes("budget")) {
    return {
      dataset: departmentBudgetData,
      type: "department",
      suggestedMetrics: ["budget", "spent"],
    };
  }

  // Simple Sales patterns
  if (lowerPrompt.includes("simple") && lowerPrompt.includes("sales")) {
    return {
      dataset: simpleSalesData,
      type: "monthly",
      suggestedMetrics: ["sales"],
    };
  }

  // Default to monthly sales
  return {
    dataset: monthlySalesData,
    type: "monthly",
    suggestedMetrics: ["sales", "revenue", "expenses"],
  };
}

/**
 * Detect chart type from prompt
 * @param {string} prompt - User's natural language prompt
 * @returns {string} Chart type ('bar', 'line', 'pie', 'doughnut')
 */
export function detectChartType(prompt) {
  const lowerPrompt = prompt.toLowerCase();

  if (
    lowerPrompt.includes("line") ||
    lowerPrompt.includes("trend") ||
    lowerPrompt.includes("over time")
  ) {
    return "line";
  }

  if (
    lowerPrompt.includes("pie") ||
    lowerPrompt.includes("distribution") ||
    lowerPrompt.includes("breakdown")
  ) {
    return "pie";
  }

  if (lowerPrompt.includes("doughnut")) {
    return "doughnut";
  }

  if (lowerPrompt.includes("radar")) {
    return "radar";
  }

  if (lowerPrompt.includes("polar")) {
    return "polarArea";
  }

  if (lowerPrompt.includes("bubble")) {
    return "bubble";
  }

  if (lowerPrompt.includes("scatter")) {
    return "scatter";
  }

  // Default to bar chart
  return "bar";
}

/**
 * Detect metric from prompt
 * @param {string} prompt - User's natural language prompt
 * @param {Array} availableMetrics - Available metrics in the dataset
 * @returns {string} Detected metric
 */
export function detectMetric(prompt, availableMetrics = ["sales"]) {
  const lowerPrompt = prompt.toLowerCase();

  for (const metric of availableMetrics) {
    if (lowerPrompt.includes(metric.toLowerCase())) {
      return metric;
    }
  }

  // Check for common aliases
  if (lowerPrompt.includes("revenue") || lowerPrompt.includes("income"))
    return "revenue";
  if (lowerPrompt.includes("expense") || lowerPrompt.includes("cost"))
    return "expenses";
  if (lowerPrompt.includes("sale")) return "sales";
  if (lowerPrompt.includes("budget")) return "budget";
  if (lowerPrompt.includes("spent") || lowerPrompt.includes("spending"))
    return "spent";

  // Default to first available metric
  return availableMetrics[0];
}

export default {
  monthlySalesData,
  productSalesData,
  quarterlyRevenueData,
  departmentBudgetData,
  simpleSalesData,
  filterByTimeRange,
  extractMetric,
  getSampleDataForPrompt,
  detectChartType,
  detectMetric,
};
