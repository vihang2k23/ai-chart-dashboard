# API Integration Guide

This guide explains how to integrate AI services (OpenAI, Gemini, Claude) with the AI Chart Dashboard and how to use mock responses for testing.

## Table of Contents

- [OpenAI Integration](#openai-integration)
- [Mock AI Mode](#mock-ai-mode)
- [Custom AI Integration](#custom-ai-integration)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Best Practices](#best-practices)

---

## OpenAI Integration

### Setup

1. **Get an API Key**

Visit [OpenAI Platform](https://platform.openai.com/) and create an account. Generate an API key from the API keys section.

2. **Configure Environment**

Add your API key to `.env`:

```env
VITE_OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
VITE_USE_MOCK_AI=false
```

> **Important**: Never commit your `.env` file to version control. It's already in `.gitignore`.

3. **Verify Configuration**

The app will automatically use OpenAI when:

- `VITE_OPENAI_API_KEY` is set
- `VITE_USE_MOCK_AI` is `false` or not set

### How It Works

1. **User Input**: User enters a prompt like "Show monthly sales as a bar chart"

2. **API Request**: The app sends a request to OpenAI's Chat Completions API:

```javascript
const response = await axios.post(
  "https://api.openai.com/v1/chat/completions",
  {
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a data visualization expert...",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 500,
  },
  {
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
  }
);
```

3. **AI Response**: OpenAI returns structured JSON:

```json
{
  "chartType": "bar",
  "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  "values": [2000, 2500, 1800, 2200, 2800, 3200],
  "datasetLabel": "Monthly Sales",
  "title": "Monthly Sales Performance"
}
```

4. **Chart Generation**: The JSON is converted to Chart.js configuration and rendered

### Cost Considerations

- **Model**: GPT-4 is used by default (more accurate but more expensive)
- **Tokens**: Each request uses ~200-500 tokens
- **Pricing**: Check [OpenAI Pricing](https://openai.com/pricing) for current rates

To use a cheaper model, edit `src/services/aiService.js`:

```javascript
model: 'gpt-3.5-turbo',  // Instead of 'gpt-4'
```

---

## Mock AI Mode

### When to Use

- Testing without API costs
- Development without internet
- Demonstrating the app
- Learning the codebase

### Setup

Set in `.env`:

```env
VITE_USE_MOCK_AI=true
```

Or simply don't provide an API key - mock mode is the default.

### How It Works

Mock mode uses intelligent prompt analysis:

1. **Keyword Detection**: Analyzes prompt for keywords

   - "monthly" → Monthly sales data
   - "product" → Product sales data
   - "quarterly" → Quarterly revenue data
   - "department" → Department budget data

2. **Chart Type Detection**:

   - "line" or "trend" → Line chart
   - "pie" or "distribution" → Pie chart
   - Default → Bar chart

3. **Time Range Detection**:

   - "last 3 months" → Filter to 3 months
   - "last 6 months" → Filter to 6 months
   - Default → All data

4. **Data Selection**: Selects appropriate sample dataset

5. **Chart Generation**: Builds Chart.js configuration

### Example Prompts for Mock Mode

```
"Show monthly sales for last 6 months"
→ Monthly data, last 6 months, bar chart

"Display product sales as a pie chart"
→ Product data, all time, pie chart

"Quarterly revenue trend as line chart"
→ Quarterly data, all time, line chart

"Department budget breakdown"
→ Department data, all time, bar chart
```

### Customizing Mock Responses

Edit `src/data/sampleData.js` to add your own datasets:

```javascript
export const myCustomData = [
  { label: "Item 1", value: 100 },
  { label: "Item 2", value: 200 },
  { label: "Item 3", value: 150 },
];
```

Then update the detection logic in `src/data/sampleData.js`:

```javascript
export function getSampleDataForPrompt(prompt) {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes("custom")) {
    return {
      dataset: myCustomData,
      type: "custom",
      suggestedMetrics: ["value"],
    };
  }

  // ... existing logic
}
```

---

## Custom AI Integration

### Using Other AI Services

You can integrate other AI services like Google Gemini or Anthropic Claude.

#### Google Gemini Example

1. **Get API Key**: [Google AI Studio](https://makersuite.google.com/app/apikey)

2. **Add to `.env`**:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_AI_SERVICE=gemini
```

3. **Update `aiService.js`**:

```javascript
async function generateChartWithGemini(prompt) {
  const response = await axios.post(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
    {
      contents: [
        {
          parts: [
            {
              text: `Generate a chart configuration as JSON for: ${prompt}`,
            },
          ],
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        key: import.meta.env.VITE_GEMINI_API_KEY,
      },
    }
  );

  // Parse and return response
}
```

#### Anthropic Claude Example

```javascript
async function generateChartWithClaude(prompt) {
  const response = await axios.post(
    "https://api.anthropic.com/v1/messages",
    {
      model: "claude-3-opus-20240229",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    },
    {
      headers: {
        "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
    }
  );

  // Parse and return response
}
```

### Using Your Own Backend

If you have a custom backend API:

```javascript
async function generateChartWithBackend(prompt) {
  const response = await axios.post(
    import.meta.env.VITE_API_BASE_URL + "/generate-chart",
    { prompt },
    {
      headers: {
        Authorization: `Bearer ${yourAuthToken}`,
      },
    }
  );

  return response.data;
}
```

---

## Error Handling

### Automatic Fallback

The app automatically falls back to mock mode if OpenAI fails:

```javascript
try {
  return await generateChartWithOpenAI(prompt);
} catch (error) {
  console.warn("OpenAI failed, falling back to mock data");
  return await generateChartWithMock(prompt);
}
```

### Custom Error Handling

Add custom error handling in `App.vue`:

```javascript
const handleGenerateChart = async (prompt) => {
  loading.value = true;
  try {
    const result = await aiService.generateChart(prompt);
    if (result.success) {
      chartData.value = result.chartConfig;
      showNotification("Chart generated successfully!", "success");
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Error:", error);
    showNotification("Failed to generate chart. Please try again.", "error");
  } finally {
    loading.value = false;
  }
};
```

### Common Errors

| Error                       | Cause                  | Solution                  |
| --------------------------- | ---------------------- | ------------------------- |
| `401 Unauthorized`          | Invalid API key        | Check API key in `.env`   |
| `429 Too Many Requests`     | Rate limit exceeded    | Implement rate limiting   |
| `500 Internal Server Error` | OpenAI service issue   | Use mock mode temporarily |
| `Network Error`             | No internet connection | Enable mock mode          |

---

## Rate Limiting

### OpenAI Rate Limits

OpenAI has rate limits based on your account tier:

- **Free tier**: 3 requests/minute
- **Pay-as-you-go**: 60 requests/minute
- **Higher tiers**: More requests

### Implementing Rate Limiting

Add a simple rate limiter:

```javascript
class RateLimiter {
  constructor(maxRequests, timeWindow) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = [];
  }

  async checkLimit() {
    const now = Date.now();
    this.requests = this.requests.filter(
      (time) => now - time < this.timeWindow
    );

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.timeWindow - (now - oldestRequest);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    this.requests.push(now);
  }
}

const limiter = new RateLimiter(3, 60000); // 3 requests per minute

export async function generateChart(prompt) {
  await limiter.checkLimit();
  // ... rest of the code
}
```

### User Feedback

Show rate limit status to users:

```vue
<div v-if="rateLimitWarning" class="warning">
  ⚠️ Rate limit approaching. Please wait before generating more charts.
</div>
```

---

## Best Practices

### 1. Secure API Keys

✅ **DO**:

- Store keys in `.env` file
- Add `.env` to `.gitignore`
- Use environment variables in production

❌ **DON'T**:

- Hardcode API keys in source code
- Commit `.env` to version control
- Share API keys publicly

### 2. Handle Errors Gracefully

```javascript
try {
  const result = await aiService.generateChart(prompt);
  // Handle success
} catch (error) {
  if (error.response?.status === 429) {
    showMessage("Too many requests. Please wait.");
  } else if (error.response?.status === 401) {
    showMessage("Invalid API key. Please check configuration.");
  } else {
    showMessage("An error occurred. Using sample data instead.");
    // Fall back to mock mode
  }
}
```

### 3. Optimize API Usage

- Cache frequently requested charts
- Debounce user input
- Use cheaper models for simple requests
- Implement request queuing

### 4. Monitor Costs

- Track API usage
- Set spending limits in OpenAI dashboard
- Log all API calls
- Use mock mode for development

### 5. Test Both Modes

Always test your app in both modes:

```bash
# Test with mock mode
VITE_USE_MOCK_AI=true npm run dev

# Test with OpenAI
VITE_USE_MOCK_AI=false npm run dev
```

---

## Troubleshooting

### API Key Not Working

1. Check if key is correctly set in `.env`
2. Restart dev server after changing `.env`
3. Verify key hasn't expired
4. Check OpenAI account has credits

### Charts Not Generating

1. Check browser console for errors
2. Verify network requests in DevTools
3. Test with mock mode first
4. Check API response format

### Slow Response Times

1. Use GPT-3.5-turbo instead of GPT-4
2. Reduce max_tokens
3. Implement caching
4. Consider using mock mode for development

---

## Additional Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [OpenAI Pricing](https://openai.com/pricing)
- [Rate Limits Guide](https://platform.openai.com/docs/guides/rate-limits)
- [Best Practices](https://platform.openai.com/docs/guides/production-best-practices)

---

For component usage, see [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md).
