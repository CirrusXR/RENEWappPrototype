
document.addEventListener('DOMContentLoaded', () => {
    const chatWidgetButton = document.getElementById('chat-widget-button');
    const chatWindow = document.getElementById('chat-window');
    const closeChatButton = document.getElementById('close-chat');
    const sendButton = document.getElementById('send-message');
    const voiceButton = document.getElementById('voice-input');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const userNameDisplay = document.getElementById('homeUserNameDisplay'); // Get the username element
    const dynamicAssistantGreeting = document.getElementById('dynamicAssistantGreeting');

    // Initialize conversation history
    const conversationHistory = [];

    // Get the username from the home page
    const username = userNameDisplay ? userNameDisplay.textContent : 'User';

    // Function to display personalized greeting based on time of day
    function displayDynamicGreeting() {
        if (!dynamicAssistantGreeting) {
            return;
        }

        const hour = new Date().getHours();
        let greeting = "Hello";

        if (hour < 12) {
            greeting = "Good morning";
        } else if (hour < 18) {
            greeting = "Good afternoon";
        } else {
            greeting = "Good evening";
        }

        dynamicAssistantGreeting.textContent = `${greeting}${username ? ' ' + username : ''}, I am ReBot, your personal sustainability assistant. How may I help you?`;
    }

    // Call the function to set the initial greeting
    displayDynamicGreeting();

    console.log("ReBot.js: Attaching click listener to chatWidgetButton.");
    chatWidgetButton.addEventListener('click', () => {
        console.log("ReBot.js: chatWidgetButton clicked!");
        chatWindow.style.display = 'flex';
        chatWidgetButton.style.display = 'none';
        chatInput.focus();
    });

    closeChatButton.addEventListener('click', () => {
        chatWindow.style.display = 'none';
        chatWidgetButton.style.display = 'block';
    });

    sendButton.addEventListener('click', () => {
        const message = chatInput.value;
        if (message.trim() !== '') {
            addMessage(message, 'user');
            chatInput.value = '';

            // Get the current username
            const username = userNameDisplay ? userNameDisplay.textContent : 'User';

            // Add user message to history
            conversationHistory.push({ role: 'user', content: message });

            // Send message, history, and username to backend
            fetch('/api/assistant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message, history: conversationHistory, username: username })
            })
            .then(response => response.json())
            .then(data => {
                addMessage(data.response, 'assistant');
                // Add assistant response to history
                conversationHistory.push({ role: 'assistant', content: data.response });
            })
            .catch(error => {
                console.error('Error:', error);
                addMessage('Sorry, something went wrong.', 'assistant');
            });
        }
    });

    function addMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', `${sender}-message`);
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
