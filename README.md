# 🤖 AI Chart Dashboard

A fully functional, AI-powered chart dashboard built with Vue.js that dynamically renders charts based on natural language prompts or manual filtering. Features modular, reusable components and supports both OpenAI integration and mock data for testing.

![Vue.js](https://img.shields.io/badge/Vue.js-3.4-4FC08D?logo=vue.js&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4.4-FF6384?logo=chart.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.1-646CFF?logo=vite&logoColor=white)

## ✨ Features

- 🎨 **Beautiful Modern UI** - Gradient backgrounds, glassmorphism, smooth animations
- 🤖 **AI-Powered** - Generate charts and get text insights from natural language prompts
- 📊 **Extensive Chart Support** - Bar, Line, Pie, Doughnut, Radar, Polar Area, Bubble, and Scatter charts
- 🎯 **Triple Modes** - AI mode for chart prompts, Manual mode for filtering, and Chat Assistant for text insights
- 📅 **Time Filtering** - Last 3 months, Last 6 months, or All time
- 💾 **Sample Datasets** - Hardcoded data including Monthly Sales, Products, Quarterly Revenue, Department Budget, and Simple Sales
- 🔄 **Modular Components** - Reusable chart components with flexible props
- 💾 **Export Charts** - Download charts as PNG images
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm

### Installation

1. **Clone or download the project**

```bash
cd ai-chart-dashboard
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment** (Optional for AI features)

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your API key:

```env
VITE_OPENAI_API_KEY=your_actual_api_key_here
VITE_USE_MOCK_AI=false  # Set to false to use real API
VITE_API_BASE_URL=https://api.openai.com/v1 # Or https://openrouter.ai/api/v1 for OpenRouter
```

> **Note**: The app works perfectly with mock data even without an API key!

4. **Start the development server**

```bash
npm run dev
```

5. **Open your browser**

Navigate to `http://localhost:5173/`

## 📖 Usage

### AI Mode

1. Click **"✨ AI Mode"** in the header
2. Enter a natural language prompt like:
   - "Show monthly sales for last 6 months"
   - "Display revenue vs expenses as a line chart"
   - "Create a pie chart for product sales"
   - "Compare product sales using a radar chart"
3. Click **"✨ Generate Chart"** or press `Ctrl+Enter`
4. View your dynamically generated chart!

### Manual Mode

1. Click **"🎯 Manual Mode"** in the header
2. Use the filter controls to:
   - Select time range (Last 3 months, Last 6 months, All time)
   - Choose chart type (Bar, Line, Pie, Doughnut, Radar, Polar Area, Bubble, Scatter)
   - Pick dataset (Monthly Sales, Products, Quarterly, Departments, Simple Sales)
3. Chart updates automatically!

### Chat Assistant Mode

1. Click **"� Chat Assistant"** in the header
2. Ask questions about company data:
   - "What is the company revenue?"
   - "Tell me about sales growth"
   - "How many employees do we have?"
3. Receive text-based insights powered by AI!

## �📊 Sample Datasets

The application includes hardcoded sample data for testing:

### Monthly Sales Data

```javascript
const monthlySalesData = [
  { month: "Jan", sales: 2000, expenses: 1500, revenue: 2500 },
  // ... 12 months total
];
```

### Product Sales Data

```javascript
const productSalesData = [
  { product: "Product A", sales: 12500, growth: 15 },
  // ... 5 products total
];
```

### Quarterly Revenue Data

```javascript
const quarterlyRevenueData = [
  { quarter: "Q1 2024", revenue: 75000, target: 70000 },
  // ... 4 quarters total
];
```

### Department Budget Data

```javascript
const departmentBudgetData = [
  { department: "Engineering", budget: 45000, spent: 42000 },
  // ... 5 departments total
];
```

### Simple Sales Data

```javascript
const simpleSalesData = [
  { month: "Jan", sales: 2000 },
  { month: "Feb", sales: 2500 },
  // ...
];
```

## 🧩 Component Architecture

### ChartDisplay Component

The most reusable component with two usage patterns:

**Pattern 1: Using chartConfig (AI-generated)**

```vue
<ChartDisplay :chart-config="chartConfig" />
```

**Pattern 2: Using individual props (Manual)**

```vue
<ChartDisplay
  chart-type="bar"
  :labels="['Jan', 'Feb', 'Mar']"
  :values="[100, 200, 150]"
  dataset-label="Sales"
  title="Monthly Sales"
/>
```

### FilterControls Component

Handles user input for manual chart generation, supporting time ranges, chart types, and dataset selection.

### PromptInput Component

Accepts natural language input for AI chart generation, featuring suggested examples.

### ChatBoard Component

Provides a chat interface for text-based interaction with the AI assistant regarding company data.

## 🔌 API Integration

### OpenAI & OpenRouter Integration

The app uses OpenAI's API (compatible with OpenRouter) to generate chart configurations and text responses.

**Setup:**

1. Get an API key from [OpenAI Platform](https://platform.openai.com/) or [OpenRouter](https://openrouter.ai/)
2. Add to `.env`:
   ```env
   VITE_OPENAI_API_KEY=sk-...
   VITE_USE_MOCK_AI=false
   VITE_API_BASE_URL=https://api.openai.com/v1 # or https://openrouter.ai/api/v1
   ```

**How it works:**

1. **Charts**: Prompts are sent to the completions endpoint (`gpt-3.5-turbo-instruct`) to generate structured JSON for Chart.js.
2. **Text Chat**: Questions are sent to the chat completions endpoint (`gpt-4`) to generate natural language responses based on provided context.

### Mock AI (No API Key Required)

When `VITE_USE_MOCK_AI=true` or no API key is provided:

1. Prompt is analyzed for keywords
2. Relevant sample dataset is selected
3. Chart type and metric are detected
4. Chart configuration is built from sample data

**This works perfectly for testing and demonstration!**

## Example Prompts

Try these prompts in AI mode:

- "Show monthly sales for last 6 months"
- "Display revenue vs expenses as a line chart"
- "Create a pie chart for product sales"
- "Show department budget breakdown"
- "Quarterly revenue trend as line chart"
- "Compare product sales using a radar chart"
- "Show department budget distribution as polar area"
- "Visualize sales vs growth with a bubble chart"
- "Scatter plot of marketing spend vs revenue"

## 🔧 Troubleshooting

### Charts not rendering?

- Check browser console for errors
- Ensure Chart.js is properly installed: `npm install chart.js`
- Verify data format matches expected structure

### OpenAI API not working?

- Verify API key is correct in `.env`
- Check API key has credits
- Set `VITE_USE_MOCK_AI=true` to use mock data instead
- Check console logs for "AI Service Config" to verify settings

### Styles not loading?

- Clear browser cache
- Restart dev server: `Ctrl+C` then `npm run dev`

## 🚀 Deployment

### Build for production:

```bash
npm run build
```

Output will be in `dist/` directory.

### Deploy to Netlify, Vercel, or GitHub Pages:

1. Build the project
2. Upload `dist/` folder
3. Configure environment variables in hosting platform

## 📚 Learn More

- [Vue.js Documentation](https://vuejs.org/)
- [Chart.js Documentation](https://www.chartjs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [OpenAI API Documentation](https://platform.openai.com/docs)

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes!

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Add new chart types
- Improve AI prompt parsing
- Add more sample datasets
- Enhance UI/UX
- Fix bugs

---

**Built with ❤️ using Vue.js and Chart.js**
