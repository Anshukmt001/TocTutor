/**
 * chatbot.js - TOC Expert AI Chatbot Logic
 * Integrates with AI APIs for live chatting
 */

const Chatbot = {
    config: {
        model: 'llama3.2:1b',
        apiUrl: 'http://localhost:11434/v1/chat/completions',
        systemPrompt: "You are a Theory of Computation (TOC) Expert. You help students understand DFA, NFA, Turing Machines, Grammars, and Complexity. Keep responses educational, concise, and professional. Use LaTeX for math if needed (e.g. $Q \\times \\Sigma$)."
    },

    init() {
        if (this.initialized) return;
        this.chatbotContainer = document.getElementById('chatbot');
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.sendBtn = document.getElementById('btn-send-chat');
        this.toggleBtn = document.getElementById('btn-toggle-chat');
        this.closeBtn = document.getElementById('btn-close-chat');

        if (!this.chatbotContainer) return;

        this.bindEvents();
        this.initialized = true;
    },

    bindEvents() {
        this.toggleBtn.onclick = () => this.toggleChat();
        this.closeBtn.onclick = () => this.toggleChat(false);

        this.sendBtn.onclick = () => this.sendMessage();
        this.chatInput.onkeypress = (e) => {
            if (e.key === 'Enter') this.sendMessage();
        };
    },

    toggleChat(force) {
        const show = force !== undefined ? force : this.chatbotContainer.style.display === 'none';
        this.chatbotContainer.style.display = show ? 'flex' : 'none';
        if (show) this.chatInput.focus();
    },

    async sendMessage() {
        const text = this.chatInput.value.trim();
        if (!text) return;

        // 1. Add User Message
        this.addMessage(text, 'user');
        this.chatInput.value = '';

        // 2. Add Thinking Indicator
        const thinkingId = this.addThinkingIndicator();

        // 3. Get AI Response
        try {
            const response = await this.getAIResponse(text);
            this.removeThinkingIndicator(thinkingId);
            this.addMessage(response, 'bot');
        } catch (error) {
            this.removeThinkingIndicator(thinkingId);
            const errorMsg = error.message || "Unknown neural core disconnection.";
            this.addMessage(`**Error:** ${errorMsg}\n\n*Please check your API key or internet connection.*`, 'bot');
            console.error("Chatbot Error:", error);
        }
    },

    addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${sender}-message`;

        // Handle Markdown/Math if 'marked' or 'renderMathInElement' is available
        const p = document.createElement('p');
        if (sender === 'bot' && window.marked) {
            p.innerHTML = marked.parse(text);
        } else {
            p.textContent = text;
        }

        msgDiv.appendChild(p);
        this.chatMessages.appendChild(msgDiv);
        this.scrollToBottom();

        // Render Math if KaTeX is available
        if (sender === 'bot' && window.renderMathInElement) {
            renderMathInElement(msgDiv, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false }
                ],
                throwOnError: false
            });
        }
    },

    addThinkingIndicator() {
        const id = 'thinking-' + Date.now();
        const div = document.createElement('div');
        div.id = id;
        div.className = 'chat-message bot-message thinking';
        div.innerHTML = `
            <div class="typing-indicator">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;
        this.chatMessages.appendChild(div);
        this.scrollToBottom();
        return id;
    },

    removeThinkingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    },

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    },

async getAIResponse(userText) {
        return this.callOllamaAPI(userText);
    },

    async callOllamaAPI(text) {
        const response = await fetch(this.config.apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: this.config.model,
                messages: [
                    { role: 'system', content: this.config.systemPrompt },
                    { role: 'user', content: text }
                ],
                stream: false
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || "Failed to connect to Ollama. Make sure Ollama is running on port 11434.");
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }
};

// Initialize on Load (Robust)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Chatbot.init());
} else {
    Chatbot.init();
}
