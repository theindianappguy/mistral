const { OpenAI } = require('openai');
const express = require('express');
const cors = require('cors');
const app = express();
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { default: axios } = require('axios');
const nlp = require('compromise');
const { exec } = require('child_process');


dotenv.config();

app.use(express.json());
app.use(cors());

app.post('/api', async (req, res) => {
  const { prompt } = req.body;
  const apiUrl = 'http://localhost:11434/api/generate';

const requestData = {
  model: 'mistral',
  prompt: prompt
};

axios.post(apiUrl, requestData)
  .then(response => {
    const responseData = response.data.split('\n');

    let fullResponse = '';
    responseData.forEach(line => {
      try {
        const jsonLine = JSON.parse(line);
        fullResponse += jsonLine.response + ' ';
      } catch (error) {
        console.error('Error parsing JSON:', error.message);
      }
    });

    // Replace multiple spaces between words with a single space
    fullResponse = fullResponse.replace(/\s{2,}/g, ' ');

    console.log('Complete Response:', fullResponse.trim());

    res.send({ output: fullResponse.trim() });
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
})



app.listen(process.env.PORT, () => {
  console.log('server is on');
});
