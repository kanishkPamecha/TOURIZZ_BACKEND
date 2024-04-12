const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const apiKey =  require('stripe')(process.env.STRIPE_SECRET_KEY);

function generateTravelResponse(userInput) {
    // Check if the query is related to travel
    if (!userInput.toLowerCase().includes('travel'|| 'Trip'|| 'hotel '|| 'plane'||"place")) {
        return "I'm sorry, I can only help with travel-related queries.";
    }

    // Define a prompt that emphasizes the travel context
    const prompt = `Travel Q&A: ${userInput}\nAnswer:`;

    // Call the OpenAI API to generate a response
    return axios.post(
        'https://api.openai.com/v1/engines/text-davinci-002/completions',
        {
            prompt: prompt,
            max_tokens: 150, // Adjust as needed
            n: 1, // Number of completions to generate
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
        }
    )
        .then(response => response.data.choices[0].text.trim())
        .catch(error => {
            console.error('Error generating response:', error.response ? error.response.data : error.message);
            return 'Sorry, an error occurred while generating the response.';
        });
}

app.post('/ask', (req, res) => {
    const userInput = req.body.userInput;
    const assistantResponse = generateTravelResponse(userInput);
    res.json({ assistantResponse });
});

const PORT = 5083;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
