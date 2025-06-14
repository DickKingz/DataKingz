const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors()); // Allow all origins for local dev
app.use(express.json());

app.post('/api/gauntlet', async (req, res) => {
  console.log('Received request:', JSON.stringify(req.body, null, 2));
  try {
    console.log('Making request to Illuvium API...');
    const response = await axios({
      method: 'post',
      url: 'https://api.illuvium-game.io/gamedata/public/v1/gauntlet/search',
      data: {
        ...req.body,
        mode: "Ranked",
        count: 1000,
        sort: {
          field: "startTime",
          direction: "desc"
        },
        filter: {
          status: "completed"
        }
      },
      headers: {
        'Authorization': 'token v4.public.eyJqdGkiOiJmMmE2ZWZjZTRjYzA0NmYzOGUxN2NiOTRjNjMxNTAwNyIsImlzcyI6ImdhdGV3YXkuaWx2LnByb2QiLCJhdWQiOiJnYXRld2F5LmlsdiIsInN1YiI6ImQ0NDMyODM2OWVmYTQ3YjdhZWZjNDIwOGE4ZDU1NzRmIiwiZXhwIjoiMjAyNi0wNi0xMlQwODoxNzowNS40NzE0NzY0WiIsInBhcnRuZXI6aWQiOiJkNDQzMjgzNjllZmE0N2I3YWVmYzQyMDhhOGQ1NTc0ZiIsInBhcnRuZXI6bmFtZSI6IlJpY2giLCJlcDphcmVuYTpsb2JieTpjcmVhdGUiOiJUcnVlIiwiZXA6YXJlbmE6Z2F1bnRsZXQ6c2VhcmNoIjoiVHJ1ZSJ9q-afHUr8WhtcMbdIRtV_7iz5aBWhFKDIy5271wAysd3KftsG4heY7vareIdNh9GyrSs12QjAxEAUixT6jnNqDQ.ZDQ0MzI4MzY5ZWZhNDdiN2FlZmM0MjA4YThkNTU3NGY',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 60000,
      validateStatus: function (status) {
        return status >= 200 && status < 500;
      }
    });
    
    console.log('Received response from Illuvium API:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });
    
    if (response.status >= 400) {
      throw new Error(`API returned status ${response.status}: ${JSON.stringify(response.data)}`);
    }
    
    res.json(response.data);
  } catch (err) {
    console.error('Error details:', {
      message: err.message,
      response: err.response ? {
        status: err.response.status,
        statusText: err.response.statusText,
        data: err.response.data
      } : 'No response',
      request: err.request ? 'Request was made but no response received' : 'No request was made'
    });
    
    // Send a more detailed error response
    res.status(err.response?.status || 500).json({ 
      error: 'Failed to fetch from Illuvium API', 
      details: err.message,
      response: err.response?.data || null,
      status: err.response?.status || 500
    });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
