const axios = require("axios");
const telegramBot = require("node-telegram-bot-api");
require("dotenv").config();
const token = process.env.API_TOKEN;
const IP = process.env.IP;
const bot = new telegramBot(token, { polling: true });
const URL = `http://${IP}/ext/bc/C/rpc`;
const avalanche = 'avalanche-2'
const COINGECKO_URL =
  `https://api.coingecko.com/api/v3/simple/price?ids=${avalanche}&vs_currencies=usd`

setInterval(() => {
  axios({
    method: "post",
    url: URL,
    headers: {
      "content-type": "application/json",
    },
    data: {
      jsonrpc: "2.0",
      id: 1,
      method: "eth_gasPrice",
      params: [],
    },
  })
    .then((response) => {
      let gasPriceToDecimal = parseInt(response.data.result, 16) / 1000000000; //16 means hexadecimal to decimal
      gasPriceToFixed = gasPriceToDecimal.toFixed(0) + " GWEI";
      console.log(gasPriceToFixed);
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
}, 3000);

setInterval(() => {
  axios.get(COINGECKO_URL).then((res) => {
    avaxPrice = "$" + res.data["avalanche-2"].usd;
    console.log(avaxPrice);
  });
}, 10000);

bot.on("message", (msg) => {
  const chatID = msg.chat.id;
  // bot.sendMessage(chatID,gasPriceToFixed)
  const message = msg.text.trim().toLowerCase();
  switch (message) {
    case "/get":
      bot.sendMessage(chatID, gasPriceToFixed);
      break;
    case "/p avax":
      bot.sendMessage(chatID, avaxPrice);
      break;
    case "/p avalanche":
      bot.sendMessage(chatID, "Priceless");
      break;
    default:
      bot.sendMessage(chatID, "Type /get for current gas price");
  }
});
