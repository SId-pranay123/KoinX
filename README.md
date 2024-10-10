# Crypto Data Fetcher & Analytics

This project is a Node.js application that fetches cryptocurrency data for Bitcoin, Ethereum, and Matic (Polygon), stores the data in MongoDB, and provides API endpoints to get the latest prices and calculate the standard deviation of the last 100 price records.

## Features

- Fetch cryptocurrency prices for Bitcoin, Ethereum, and Matic every 2 hours using a cron job.
- Store the fetched data in MongoDB for historical analysis.
- Expose APIs to:
  - Get the latest cryptocurrency price, market cap, and 24-hour price change.
  - Calculate the standard deviation of the last 100 price records.

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14.x or higher)
- [MongoDB](https://www.mongodb.com/) (locally or cloud-hosted)
- [Cron](https://www.npmjs.com/package/node-cron) for scheduling

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/crypto-data-fetcher.git
   cd crypto-data-fetcher

2. Install dependencies:

   ```bash 
   npm install

3. Environment file 

   ```bash
   MONGO_URI=mongodb://localhost:27017/cryptoDB
   PORT=3000 




