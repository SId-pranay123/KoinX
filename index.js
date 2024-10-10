const express = require('express');
const mongoose = require('mongoose');
const Crypto = require('./models/cryptoModel');
const cron = require('node-cron');
const fetchCryptoData = require('./services/fetchCryptoService');
require('dotenv').config();

// Initialize express
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

connectDB();

// API to get the latest data of the requested cryptocurrency
app.get('/stats', async (req, res) => {
  const coin = req.query.coin;

  if (!['bitcoin', 'ethereum', 'matic-network'].includes(coin)) {
    return res.status(400).json({ error: 'Invalid coin provided' });
  }

  try {
    const latestRecord = await Crypto.findOne({ coinId: coin })
      .sort({ timestamp: -1 })
      .limit(1);

    if (!latestRecord) {
      return res.status(404).json({ error: 'No data found for the requested coin' });
    }

    res.json({
      price: latestRecord.priceUsd,
      marketCap: latestRecord.marketCapUsd,
      '24hChange': latestRecord.change24h
    });
  } catch (error) {
    console.error('Error fetching stats:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// API to calculate the standard deviation of the last 100 records for a given cryptocurrency
app.get('/deviation', async (req, res) => {
  const coin = req.query.coin;

  if (!['bitcoin', 'ethereum', 'matic-network'].includes(coin)) {
    return res.status(400).json({ error: 'Invalid coin provided' });
  }

  try {
    const records = await Crypto.find({ coinId: coin })
      .sort({ timestamp: -1 })
      .limit(100);

    if (records.length < 2) {
      return res.status(400).json({ error: 'Not enough data for standard deviation calculation' });
    }

    const prices = records.map(record => record.priceUsd);
    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
    const standardDeviation = Math.sqrt(variance);

    res.json({
      deviation: standardDeviation.toFixed(2)
    });
  } catch (error) {
    console.error('Error calculating deviation:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});



// Fetch data immediately when the server starts
(async () => {
    console.log('Fetching crypto data for the first time on server start...');
    await fetchCryptoData();
  })();
//0 */2 * * *
// Schedule the job to fetch crypto data every 2 hours
cron.schedule('0 */2 * * *', async () => {
  console.log('Fetching crypto data...');
  await fetchCryptoData();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
