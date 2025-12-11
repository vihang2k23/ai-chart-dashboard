# 🤖 AI Chart Dashboard

A fully functional, AI-powered chart dashboard built with Vue.js that dynamically renders charts based on natural language prompts or manual filtering. Features modular, reusable components and supports both OpenAI integration and mock data for testing.

![Vue.js](https://img.shields.io/badge/Vue.js-3.4-4FC08D?logo=vue.js&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4.4-FF6384?logo=chart.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.1-646CFF?logo=vite&logoColor=white)

## ✨ Features

- 🎨 **Beautiful Modern UI** - Gradient backgrounds, glassmorphism, smooth animations
- 🤖 **AI-Powered** - Generate charts from natural language prompts using OpenAI
- 📊 **Multiple Chart Types** - Bar, Line, Pie, and Doughnut charts
- 🎯 **Dual Modes** - AI mode for prompts, Manual mode for filtering
- 📅 **Time Filtering** - Last 3 months, Last 6 months, or All time
- 💾 **Sample Datasets** - Hardcoded data for testing without API calls
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

Edit `.env` and add your OpenAI API key:

```env
VITE_OPENAI_API_KEY=your_actual_openai_api_key_here
VITE_USE_MOCK_AI=false  # Set to false to use real OpenAI API
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
3. Click **"✨ Generate Chart"** or press `Ctrl+Enter`
4. View your dynamically generated chart!

### Manual Mode

1. Click **"🎯 Manual Mode"** in the header
2. Use the filter controls to:
   - Select time range (Last 3 months, Last 6 months, All time)
   - Choose chart type (Bar, Line, Pie, Doughnut)
   - Pick dataset (Monthly Sales, Products, Quarterly, Departments)
3. Chart updates automatically!

## 📊 Sample Datasets

The application includes hardcoded sample data for testing:

### Monthly Sales Data

```javascript
const sampleSalesData = [
  { month: "Jan", sales: 2000, expenses: 1500, revenue: 2500 },
  { month: "Feb", sales: 2500, expenses: 1600, revenue: 2800 },
  // ... 12 months total
];
```

### Product Sales Data

```javascript
const productSalesData = [
  { product: "Product A", sales: 12500, growth: 15 },
  { product: "Product B", sales: 9800, growth: 8 },
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

**Props:**

- `chartConfig` - Complete Chart.js configuration object
- `chartType` - 'bar', 'line', 'pie', or 'doughnut'
- `labels` - Array of labels for x-axis
- `values` - Array of data values
- `datasetLabel` - Label for the dataset
- `title` - Chart title
- `showClear` - Show clear button (default: true)
- `showExport` - Show export button (default: true)

**Events:**

- `@clear` - Emitted when chart is cleared
- `@export` - Emitted when chart is exported

### FilterControls Component

```vue
<FilterControls
  initial-time-range="all"
  initial-chart-type="bar"
  initial-dataset="monthly"
  :show-dataset-selector="true"
  @filter-change="handleFilterChange"
/>
```

**Props:**

- `initialTimeRange` - 'last3months', 'last6months', or 'all'
- `initialChartType` - 'bar', 'line', 'pie', or 'doughnut'
- `initialDataset` - 'monthly', 'product', 'quarterly', or 'department'
- `showDatasetSelector` - Show dataset selector (default: false)

**Events:**

- `@time-range-change` - Emitted when time range changes
- `@chart-type-change` - Emitted when chart type changes
- `@dataset-change` - Emitted when dataset changes
- `@filter-change` - Emitted with all filter values

### PromptInput Component

```vue
<PromptInput :loading="false" @generate-chart="handleGenerateChart" />
```

**Props:**

- `loading` - Show loading state (default: false)

**Events:**

- `@generate-chart` - Emitted with prompt text when user submits

## 🔌 API Integration

### OpenAI Integration

The app uses OpenAI's GPT-4 to generate chart configurations from natural language.

**Setup:**

1. Get an API key from [OpenAI Platform](https://platform.openai.com/)
2. Add to `.env`:
   ```env
   VITE_OPENAI_API_KEY=sk-...
   VITE_USE_MOCK_AI=false
   ```

**How it works:**

1. User enters prompt: "Show monthly sales as a bar chart"
2. Prompt sent to GPT-4 with system instructions
3. AI returns structured JSON:
   ```json
   {
     "chartType": "bar",
     "labels": ["Jan", "Feb", "Mar"],
     "values": [2000, 2500, 1800],
     "datasetLabel": "Sales",
     "title": "Monthly Sales"
   }
   ```
4. JSON converted to Chart.js configuration
5. Chart rendered dynamically

### Mock AI (No API Key Required)

When `VITE_USE_MOCK_AI=true` or no API key is provided:

1. Prompt is analyzed for keywords
2. Relevant sample dataset is selected
3. Chart type and metric are detected
4. Chart configuration is built from sample data

**This works perfectly for testing and demonstration!**

## 🎨 Customization

### Adding New Datasets

Edit `src/data/sampleData.js`:

```javascript
export const myCustomData = [
  { label: "Item 1", value: 100 },
  { label: "Item 2", value: 200 },
];
```

### Changing Color Schemes

Edit the color schemes in `src/services/aiService.js`:

```javascript
const colorSchemes = {
  bar: {
    backgroundColor: "rgba(102, 126, 234, 0.6)",
    borderColor: "rgba(102, 126, 234, 1)",
  },
  // ... add your colors
};
```

### Styling

Global styles are in `src/assets/style.css`. Component-specific styles are scoped within each `.vue` file.

## 📁 Project Structure

```
ai-chart-dashboard/
├── src/
│   ├── components/
│   │   ├── ChartDisplay.vue      # Reusable chart component
│   │   ├── FilterControls.vue    # Filter UI component
│   │   ├── PromptInput.vue       # Prompt input component
│   │   └── ChatBoard.vue         # (Legacy, not used)
│   ├── data/
│   │   └── sampleData.js         # Sample datasets & utilities
│   ├── services/
│   │   └── aiService.js          # AI integration & chart generation
│   ├── assets/
│   │   └── style.css             # Global styles
│   ├── App.vue                   # Main application
│   └── main.js                   # Entry point
├── public/                       # Static assets
├── .env                          # Environment variables (gitignored)
├── .env.example                  # Environment template
├── package.json                  # Dependencies
├── vite.config.js                # Vite configuration
└── README.md                     # This file
```

## 🛠️ Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 Example Prompts

Try these prompts in AI mode:

- "Show monthly sales for last 6 months"
- "Display revenue vs expenses as a line chart"
- "Create a pie chart for product sales"
- "Show department budget breakdown"
- "Quarterly revenue trend as line chart"
- "Product A sales over last 3 months"
- "Compare all products as a bar chart"

## 🔧 Troubleshooting

### Charts not rendering?

- Check browser console for errors
- Ensure Chart.js is properly installed: `npm install chart.js`
- Verify data format matches expected structure

### OpenAI API not working?

- Verify API key is correct in `.env`
- Check API key has credits
- Set `VITE_USE_MOCK_AI=true` to use mock data instead

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
