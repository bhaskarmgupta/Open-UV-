import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;
require('dotenv').config();

// Define your OpenUV API key
const OPENUV_API_KEY = 'openuv-1lfk38rlwotjwrf-io'; // Replace 'your-api-key-here' with your actual API key


// Middleware to serve static files
app.use(express.static('public'));

// Set view engine to EJS
app.set('view engine', 'ejs');

// Home route
app.get('/', async (req, res) => {
    res.render('index');
  });
  
  // Endpoint to fetch user's location
  app.get('/location', async (req, res) => {
    try {
      // Extract latitude and longitude from request query
      const { latitude, longitude } = req.query;
      const url = `https://api.openuv.io/api/v1/uv?lat=${latitude}&lng=${longitude}`;
  
      const response = await axios.get(url, {
        headers: {
          'x-access-token': OPENUV_API_KEY
        }
      });
  
      const uvIndex = response.data.result.uv;
      const needsSunscreen = uvIndex > 3 ? 'Yes, apply sunscreen!' : 'No, you don\'t need sunscreen.';
  
      res.json({ uvIndex, needsSunscreen });
    } catch (error) {
      console.error('Error fetching UV data:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  