import "./lib/db";
import express from "express";
import countryRoutes from "./routes/country";

import { bot } from "./lib/bot";
import { BinanceP2P } from "./binance/api";

if (!process.env.BINANCE_ACCESS_KEY)
  throw new Error("Please add a Binance access key");
if (!process.env.BINANCE_SECRET_KEY)
  throw new Error("Please add a Binance secret key");

const binanceP2P = new BinanceP2P({
  accessKey: process.env.BINANCE_ACCESS_KEY,
  secretKey: process.env.BINANCE_SECRET_KEY,
});

// ----- BOT -----
bot.start((ctx) => ctx.reply("Welcome! Waaasuup?"));
bot.hears("hello", (ctx) => {
  ctx.reply("Hello to you too! My friend!!");
});

bot.hears("binance", async (ctx) => {
  const orders = await binanceP2P.fetchTradeHistory({ tradeType: "BUY" });
  ctx.reply(JSON.stringify(orders));
});

bot.launch();

// ------ SERVER -----
const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());

app.get("/", async (req, res) => {
  res.json({ message: "Please visit /countries to view all the countries" });
});

app.use("/countries", countryRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
