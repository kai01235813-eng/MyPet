// Gemini API Configuration
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Game State
class PetGame {
    constructor() {
        this.level = 1;
        this.exp = 0;
        this.expToNextLevel = 100;
        this.mood = 'normal'; // normal, happy, excited
        this.apiKey = localStorage.getItem('gemini_api_key') || '';
        this.conversationHistory = [];
        
        this.loadState();
        this.initializeUI();
    }

    loadState() {
        const savedState = localStorage.getItem('pet_game_state');
        if (savedState) {
            const state = JSON.parse(savedState);
            this.level = state.level || 1;
            this.exp = state.exp || 0;
            this.expToNextLevel = state.expToNextLevel || 100;
        }
    }

    saveState() {
        const state = {
            level: this.level,
            exp: this.exp,
            expToNextLevel: this.expToNextLevel
        };
        localStorage.setItem('pet_game_state', JSON.stringify(state));
    }

    initializeUI() {
        // Check if API key is saved
        if (this.apiKey) {
            document.getElementById('apiKeySection').style.display = 'none';
            document.getElementById('chatContainer').style.display = 'flex';
        }

        // Update stats display
        this.updateStatsDisplay();

        // Event listeners
        document.getElementById('saveApiKeyBtn').addEventListener('click', () => this.saveApiKey());
        document.getElementById('sendBtn').addEventListener('click', () => this.sendMessage());
        document.getElementById('userInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Suggestion buttons
        document.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('userInput').value = btn.dataset.query;
                this.sendMessage();
            });
        });
    }

    saveApiKey() {
        const apiKey = document.getElementById('apiKeyInput').value.trim();
        if (!apiKey) {
            alert('API 키를 입력해주세요.');
            return;
        }

        this.apiKey = apiKey;
        localStorage.setItem('gemini_api_key', apiKey);
        
        document.getElementById('apiKeySection').style.display = 'none';
        document.getElementById('chatContainer').style.display = 'flex';
        
        this.showPetMessage('API 키가 저장되었어요! 이제 대화할 수 있어요! 🎉');
    }

    updateStatsDisplay() {
        document.getElementById('level').textContent = this.level;
        document.getElementById('exp').textContent = `${this.exp}/${this.expToNextLevel}`;
        
        const moodEmoji = {
            'normal': '😊',
            'happy': '😄',
            'excited': '🤩'
        };
        document.getElementById('mood').textContent = moodEmoji[this.mood] || '😊';
        
        const expPercentage = (this.exp / this.expToNextLevel) * 100;
        document.getElementById('expBar').style.width = `${expPercentage}%`;
    }

    async sendMessage() {
        const userInput = document.getElementById('userInput').value.trim();
        if (!userInput) return;

        // Disable send button
        const sendBtn = document.getElementById('sendBtn');
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<span class="loading"></span>';

        // Add user message to chat
        this.addMessageToChat('user', userInput);
        document.getElementById('userInput').value = '';

        try {
            // Analyze activity type
            const activityType = this.analyzeActivity(userInput);
            
            // Call Gemini API
            const response = await this.callGeminiAPI(userInput);
            
            // Add AI response to chat
            this.addMessageToChat('ai', response, activityType);
            
            // Update pet based on activity
            if (activityType !== 'casual') {
                this.rewardActivity(activityType);
            }
        } catch (error) {
            console.error('Error:', error);
            this.addMessageToChat('system', `오류가 발생했습니다: ${error.message}`);
        } finally {
            sendBtn.disabled = false;
            sendBtn.textContent = '전송';
        }
    }

    analyzeActivity(message) {
        const lowerMessage = message.toLowerCase();
        
        // Creative activities
        if (lowerMessage.includes('노래') || lowerMessage.includes('가사') || 
            lowerMessage.includes('시') || lowerMessage.includes('이야기') ||
            lowerMessage.includes('창작') || lowerMessage.includes('만들어')) {
            return 'creative';
        }
        
        // News queries
        if (lowerMessage.includes('뉴스') || lowerMessage.includes('소식') ||
            lowerMessage.includes('최근') || lowerMessage.includes('오늘')) {
            return 'news';
        }
        
        // Knowledge queries
        if (lowerMessage.includes('설명') || lowerMessage.includes('알려') ||
            lowerMessage.includes('무엇') || lowerMessage.includes('어떻게') ||
            lowerMessage.includes('왜') || lowerMessage.includes('배우')) {
            return 'knowledge';
        }
        
        return 'casual';
    }

    async callGeminiAPI(message) {
        if (!this.apiKey) {
            throw new Error('API 키가 설정되지 않았습니다.');
        }

        const url = `${GEMINI_API_URL}?key=${this.apiKey}`;
        
        const requestBody = {
            contents: [{
                parts: [{
                    text: message
                }]
            }],
            generationConfig: {
                temperature: 0.9,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'API 호출에 실패했습니다.');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    addMessageToChat(type, message, activityType = null) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        
        if (type === 'user') {
            messageDiv.className = 'message user-message';
            messageDiv.textContent = message;
        } else if (type === 'ai') {
            messageDiv.className = 'message ai-message';
            messageDiv.textContent = message;
            
            if (activityType && activityType !== 'casual') {
                const badge = document.createElement('span');
                badge.className = 'activity-badge';
                const activityLabels = {
                    'creative': '🎨 창작',
                    'news': '📰 뉴스',
                    'knowledge': '📚 지식'
                };
                badge.textContent = activityLabels[activityType];
                messageDiv.appendChild(badge);
            }
        } else {
            messageDiv.className = 'message system-message';
            messageDiv.textContent = message;
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    rewardActivity(activityType) {
        // Grant experience based on activity type
        const expRewards = {
            'creative': 30,
            'news': 20,
            'knowledge': 25
        };
        
        const expGain = expRewards[activityType] || 10;
        this.exp += expGain;
        
        // Check for level up
        if (this.exp >= this.expToNextLevel) {
            this.levelUp();
        }
        
        // Update mood
        this.setMood('happy');
        setTimeout(() => this.setMood('normal'), 3000);
        
        // Animate pet
        const shiba = document.getElementById('shiba');
        shiba.classList.add('happy');
        setTimeout(() => shiba.classList.remove('happy'), 500);
        
        // Update display
        this.updateStatsDisplay();
        this.saveState();
        
        // Show reward message
        const activityLabels = {
            'creative': '창작 활동',
            'news': '뉴스 검색',
            'knowledge': '지식 탐구'
        };
        this.showPetMessage(`${activityLabels[activityType]}을 해서 기분이 좋아요! +${expGain} 경험치!`);
    }

    levelUp() {
        this.level += 1;
        this.exp = this.exp - this.expToNextLevel;
        this.expToNextLevel = Math.floor(this.expToNextLevel * 1.5);
        
        // Animate level up
        const shiba = document.getElementById('shiba');
        shiba.classList.add('grow');
        setTimeout(() => shiba.classList.remove('grow'), 500);
        
        this.setMood('excited');
        setTimeout(() => this.setMood('normal'), 5000);
        
        this.showPetMessage(`레벨 업! 🎉 이제 레벨 ${this.level}이에요!`);
        
        // Update shiba size based on level
        const newSize = 120 + (this.level - 1) * 10;
        shiba.style.fontSize = `${Math.min(newSize, 200)}px`;
    }

    setMood(mood) {
        this.mood = mood;
        this.updateStatsDisplay();
    }

    showPetMessage(message) {
        const petMessage = document.getElementById('petMessage');
        petMessage.textContent = message;
        petMessage.style.animation = 'none';
        setTimeout(() => {
            petMessage.style.animation = 'float 3s ease-in-out infinite';
        }, 10);
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.petGame = new PetGame();
});
