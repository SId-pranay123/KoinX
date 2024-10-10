const mongoose = require('mongoose');

const cryptoSchema = new mongoose.Schema({
  coinId: { type: String, required: true },
  priceUsd: { type: Number, required: true },
  marketCapUsd: { type: Number, required: true },
  change24h: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Crypto = mongoose.model('Crypto', cryptoSchema);
module.exports = Crypto;
