<template>
  <div class="chat-board glass">
    <div class="chat-header">
      <h2>AI Chart Assistant</h2>
      <p class="subtitle">Describe the chart you want to create</p>
    </div>

    <div class="messages-container" ref="messagesContainer">
      <div v-if="messages.length === 0" class="welcome-message">
        <div class="welcome-icon">🤖</div>
        <h3>Welcome!</h3>
        <p>I can help you create beautiful charts. Try asking me to:</p>
        <ul class="suggestions">
          <li>"Create a bar chart showing monthly sales"</li>
          <li>"Show me a line chart of website traffic"</li>
          <li>"Generate a pie chart of browser usage"</li>
          <li>"What is the company revenue?"</li>
          <li>"Tell me about sales growth"</li>
        </ul>
      </div>

      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['message', message.type]"
        class="fade-in"
      >
        <div class="message-avatar">
          {{ message.type === "user" ? "👤" : "🤖" }}
        </div>
        <div class="message-content">
          <div class="message-text">{{ message.text }}</div>
          <div class="message-time">{{ message.time }}</div>
        </div>
      </div>

      <div v-if="isLoading" class="message ai fade-in">
        <div class="message-avatar">🤖</div>
        <div class="message-content">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>

    <div class="input-container">
      <input
        v-model="inputText"
        @keypress.enter="sendMessage"
        type="text"
        placeholder="Describe your chart..."
        class="input chat-input"
        :disabled="isLoading"
      />
      <button
        @click="sendMessage"
        :disabled="!inputText.trim() || isLoading"
        class="btn btn-primary send-btn"
      >
        <span v-if="!isLoading">Send</span>
        <span v-else>...</span>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, nextTick } from "vue";

export default {
  name: "ChatBoard",
  emits: ["send-prompt"],
  setup(props, { emit }) {
    const inputText = ref("");
    const messages = ref([]);
    const isLoading = ref(false);
    const messagesContainer = ref(null);

    const scrollToBottom = () => {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop =
            messagesContainer.value.scrollHeight;
        }
      });
    };

    const getCurrentTime = () => {
      const now = new Date();
      return now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const sendMessage = () => {
      if (!inputText.value.trim() || isLoading.value) return;

      const userMessage = {
        type: "user",
        text: inputText.value,
        time: getCurrentTime(),
      };

      messages.value.push(userMessage);
      const prompt = inputText.value;
      inputText.value = "";

      scrollToBottom();

      // Emit the prompt to parent component
      emit("send-prompt", prompt);
    };

    const addAIResponse = (text) => {
      const aiMessage = {
        type: "ai",
        text: text,
        time: getCurrentTime(),
      };
      messages.value.push(aiMessage);
      scrollToBottom();
    };

    const setLoading = (loading) => {
      isLoading.value = loading;
      if (loading) {
        scrollToBottom();
      }
    };

    return {
      inputText,
      messages,
      isLoading,
      messagesContainer,
      sendMessage,
      addAIResponse,
      setLoading,
    };
  },
};
</script>

<style scoped>
.chat-board {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.chat-header {
  padding: 24px;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 100%
  );
  border-bottom: 1px solid var(--border-color);
}

.chat-header h2 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 14px;
  color: var(--text-secondary);
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 300px;
  max-height: 500px;
}

.welcome-message {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-secondary);
}

.welcome-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.welcome-message h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.welcome-message p {
  margin-bottom: 16px;
  font-size: 14px;
}

.suggestions {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 400px;
  margin: 0 auto;
}

.suggestions li {
  background: var(--bg-tertiary);
  padding: 12px 16px;
  border-radius: var(--radius-md);
  font-size: 13px;
  text-align: left;
  border: 1px solid var(--border-color);
  transition: all var(--transition-fast);
  cursor: pointer;
}

.suggestions li:hover {
  border-color: rgba(102, 126, 234, 0.5);
  background: rgba(102, 126, 234, 0.05);
}

.message {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
}

.message.user .message-avatar {
  background: var(--primary-gradient);
  border: none;
}

.message-content {
  max-width: 70%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message.user .message-content {
  align-items: flex-end;
}

.message-text {
  padding: 12px 16px;
  border-radius: var(--radius-md);
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
}

.message.user .message-text {
  background: var(--primary-gradient);
  color: white;
  border-radius: var(--radius-md) var(--radius-md) 4px var(--radius-md);
}

.message.ai .message-text {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md) var(--radius-md) var(--radius-md) 4px;
}

.message-time {
  font-size: 11px;
  color: var(--text-muted);
  padding: 0 4px;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  width: fit-content;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-muted);
  animation: pulse 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

.input-container {
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 12px;
  background: var(--bg-secondary);
}

.chat-input {
  flex: 1;
}

.send-btn {
  min-width: 80px;
  flex-shrink: 0;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .chat-header {
    padding: 16px;
  }

  .messages-container {
    padding: 16px;
    max-height: 400px;
  }

  .message-content {
    max-width: 85%;
  }

  .input-container {
    padding: 12px 16px;
  }
}
</style>
