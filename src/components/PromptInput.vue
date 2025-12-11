<template>
  <div class="prompt-input-container">
    <div class="input-wrapper">
      <textarea
        v-model="prompt"
        @keydown.ctrl.enter="handleSubmit"
        placeholder="Describe the chart you want to create... (e.g., 'Create a bar chart showing monthly sales data')"
        class="prompt-textarea"
        rows="4"
        :disabled="loading"
      ></textarea>
      <button
        @click="handleSubmit"
        class="generate-btn"
        :disabled="!prompt.trim() || loading"
      >
        <span v-if="!loading">✨ Generate Chart</span>
        <span v-else> <span class="spinner"></span> Generating... </span>
      </button>
    </div>
    <div class="examples">
      <p class="examples-title">Try these examples:</p>
      <div class="example-chips">
        <button
          v-for="example in examples"
          :key="example"
          @click="prompt = example"
          class="example-chip"
        >
          {{ example }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "PromptInput",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["generate-chart"],
  setup(props, { emit }) {
    const prompt = ref("");
    const examples = [
      "Show monthly sales for last 6 months",
      "Display revenue vs expenses as a line chart",
      "Create a pie chart for product sales",
      "Show department budget breakdown",
      "Quarterly revenue trend as line chart",
      "Compare product sales using a radar chart",
      "Show department budget distribution as polar area",
      "Visualize sales vs growth with a bubble chart",
      "Scatter plot of marketing spend vs revenue",
    ];

    const handleSubmit = () => {
      if (prompt.value.trim() && !props.loading) {
        emit("generate-chart", prompt.value);
      }
    };

    return {
      prompt,
      examples,
      handleSubmit,
    };
  },
};
</script>

<style scoped>
.prompt-input-container {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.prompt-textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.3s ease;
}

.prompt-textarea:focus {
  outline: none;
  border-color: #667eea;
}

.prompt-textarea:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.generate-btn {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.generate-btn:active:not(:disabled) {
  transform: translateY(0);
}

.generate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.examples {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.examples-title {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.example-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.example-chip {
  padding: 0.5rem 1rem;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.example-chip:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
  transform: translateY(-1px);
}
</style>
