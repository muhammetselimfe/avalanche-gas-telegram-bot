const axios = require("axios");
const telegramBot = require("node-telegram-bot-api");
require("dotenv").config();
const token = process.env.API_TOKEN;
const bot = new telegramBot(token, { polling: true });
const URL = "https://gavax.blockscan.com/gasapi.ashx?apikey=key&method=gasoracle"; //Source of SnowTrace block explorer

setInterval(() => {
  axios.get(URL).then((res) => {
    gas = res.data.result
    LastBlock = gas.LastBlock
    SafeGasPrice= gas.SafeGasPrice
    ProposeGasPrice= gas.ProposeGasPrice
    FastGasPrice= gas.FastGasPrice
    UsdPrice= gas.UsdPrice
    console.log(gas)
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

bot.on("message", (msg) => {
  const chatID = msg.chat.id;
  const message = msg.text.trim().toLowerCase();
  switch (message) {
    case "/get":
      bot.sendMessage(chatID, "Last Block: "+LastBlock + `\n`
      + "Safe Gas Price: "+SafeGasPrice +" GWEI" + `\n`
      + "Propose Gas Price: "+ProposeGasPrice +" GWEI" + `\n`
      + "Fast Gas Price: "+FastGasPrice +" GWEI" + `\n`
      + "AVAX Price: $"+UsdPrice + `\n`
      );
      break;
    case "/p avalanche":
      bot.sendMessage(chatID, "Priceless");
      break;
    default:
      bot.sendMessage(chatID, "Type /get for current gas price");
  }
});
