//server.js

const express = require('express');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Welcome to AI Chatbot API. Send POST requests to /chat to interact with the chatbot.');
});

app.post('/chat', (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({error : 'Message is required'});
    }

    const python = spawn('python', ['aimodel.py', userMessage]);

    let botResponse = ' ';
    let errorOccured = false;


    python.stdout.on('data', (data) => {
        botResponse += data.toString();

    });

    python.stdout.on('data', (data) => {
        console.error(`Python Error: ${data}`);
        errorOccured = true;

    });

    python.on('close', (code) => {
        console.log(`Python script exited with code ${code}`);
        if (errorOccured){
            res.status(500).json({ error: 'An error occured while processing your request' });
        } else {
            res.json({ response: botResponse.trim() });
        }
    });
});

// app.use((req, res, next) => {
//     res.status(404).send("Sorry, that route doesn't exist. Have you tried /chat?");
// })

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});




