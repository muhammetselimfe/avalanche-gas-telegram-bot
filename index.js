const axios = require("axios");
const telegramBot = require("node-telegram-bot-api");
require("dotenv").config();
const token = process.env.API_TOKEN;
const bot = new telegramBot(token, { polling: true });
// const URL = "https://gavax.blockscan.com/gasapi.ashx?apikey=key&method=gasoracle"; //Source of SnowTrace block explorer which operated by Etherscan
const API_URL = process.env.URL
const COINGECKO_URL_AVAX = "https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd&include_24hr_change=true"

setInterval(() => {
  axios.post(API_URL, {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "eth_baseFee",
    "params": []
  })
    .then((response) => {
      baseFee = parseInt(response.data.result / 1000000000)

      console.log(baseFee)
    })
    .catch((error=> {
      console.log(error)
    }))
}, 5000)

setInterval(() => {
  axios.get(COINGECKO_URL_AVAX).then((res) => {
    avaxPrice = res.data["avalanche-2"].usd

    // UsdPrice= gas.UsdPrice
    console.log("AVAX PRICE= " + avaxPrice)
  })
    .catch((error) => {
      if (error.response) {
        //The response status is an error code
        console.log(error.response.status);
      } else if (error.request) {
        //Response not received though the request was sent
        console.log(error.request);
      } else {
        //An error occurred when setting up the request
        console.log(error.message);
      }
    });
}, 60000)

bot.on("message", (msg) => {
  const chatID = msg.chat.id;
  const message = msg.text.trim().toLowerCase();
  switch (message) {
    case "/get":
      bot.sendMessage(chatID,  "Base Fee: "+baseFee +" GWEI" + `\n`
      + "AVAX Price: $"+avaxPrice + `\n`
      );
      break;
    case "/p avalanche":
      bot.sendMessage(chatID, "Priceless");
      break;
    default:
      bot.sendMessage(chatID, "Type /get for current gas price");
  }
});
