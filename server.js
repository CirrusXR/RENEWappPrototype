
const express = require('express');
const OpenAI = require('openai');
require('dotenv').config();
const app = express();
const port = 3000;

// The API key is now loaded from the .env file
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Sample user data (in a real app, you would fetch this from a database)
const userData = {
    name: 'Alex',
    averageDailyConsumption: 15, // kWh
    mostUsedDevice: 'Dishwasher',
    savingsGoal: 20, // %
    recentEnergySpike: true,
};

app.use(express.json());
app.use(express.static('public'));

app.post('/api/assistant', async (req, res) => {
    try {
        const { message: userMessage, history: conversationHistory, username } = req.body;
        console.log('User message:', userMessage);

        // Update userData with the actual username
        userData.name = username;

        // Dynamically create the system prompt with user data
        const systemPrompt = `You are an expert ReBot for the RENEW app. Your tone should be helpful, encouraging, and informative.

        Here is the user's data:
        - Name: ${userData.name}
        - Average Daily Consumption: ${userData.averageDailyConsumption} kWh
        - Most Used Device: ${userData.mostUsedDevice}
        - Savings Goal: ${userData.savingsGoal}%
        - Recent Energy Spike: ${userData.recentEnergySpike ? 'Yes' : 'No'}

        Use this data to provide personalized tips and answer questions about sustainability, energy saving, and reducing carbon emissions.`;

        // Construct messages array for OpenAI API
        const messages = [
            {
                role: 'system',
                content: systemPrompt,
            },
            ...conversationHistory, // Add previous messages
            {
                role: 'user',
                content: userMessage
            }
        ];

        const completion = await openai.chat.completions.create({
            messages: messages,
            model: 'gpt-3.5-turbo',
        });

        const assistantResponse = completion.choices[0].message.content;
        res.json({ response: assistantResponse });
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).json({ response: 'Sorry, I\'m having trouble connecting to the AI. Please try again later.' });
    }
});

app.get('/api/maps-key', (req, res) => {
    res.json({ apiKey: process.env.GOOGLE_MAPS_API_KEY });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
