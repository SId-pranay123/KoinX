const axios = require('axios');
const Crypto = require('../models/cryptoModel');

const fetchCryptoData = async () => {
  try {
    const { data } = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price', 
      {
        params: {
          ids: 'bitcoin,ethereum,matic-network',
          vs_currencies: 'usd',
          include_market_cap: 'true',
          include_24hr_change: 'true',
        }
      }
    );

    const coins = [
      { id: 'bitcoin', data: data.bitcoin },
      { id: 'ethereum', data: data.ethereum },
      { id: 'matic-network', data: data['matic-network'] },
    ];

    // Save the data to MongoDB
    for (const coin of coins) {
      const cryptoData = new Crypto({
        coinId: coin.id,
        priceUsd: coin.data.usd,
        marketCapUsd: coin.data.usd_market_cap,
        change24h: coin.data.usd_24h_change,
      });
      await cryptoData.save();
      console.log(`Data for ${coin.id} saved successfully.`);
    }

    console.log('Crypto data saved successfully!');
  } catch (error) {
    console.error('Error fetching crypto data:', error.message);
  }
};

module.exports = fetchCryptoData;
