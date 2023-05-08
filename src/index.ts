import "./lib/db";
import express from "express";
import countryRoutes from "./routes/country";

import { bot } from "./lib/bot";
import { Markup } from "telegraf";

import { BinanceP2P } from "./binance/api";
import { getInstInfo, startEBSInst, stopEBSInst } from "./aws/api";
import { mainEc2Id, proxyEc2Ids } from "./aws/data";

if (!process.env.BINANCE_ACCESS_KEY)
  throw new Error("Please add a Binance access key");
if (!process.env.BINANCE_SECRET_KEY)
  throw new Error("Please add a Binance secret key");

const binanceP2P = new BinanceP2P({
  accessKey: process.env.BINANCE_ACCESS_KEY,
  secretKey: process.env.BINANCE_SECRET_KEY,
});

// ----- BOT -----
const isAuth = (ctx: any) => ctx.from.id === 381604322;

const inlineMessageInstanceKeyboard = Markup.inlineKeyboard([
  Markup.button.callback("▶️ Start", "start"),
  Markup.button.callback("⏸️ Stop", "stop"),
]);

bot.telegram.deleteWebhook();
bot.start((ctx) => ctx.reply(`Hello ${ctx.message.from.username}!`));

bot.hears("binance", async (ctx) => {
  const orders = await binanceP2P.fetchTradeHistory({ tradeType: "BUY" });
  ctx.reply(JSON.stringify(orders));
});

bot.hears("/status", async (ctx) => {
  const rows = [];

  const [mainData, proxiesData] = await Promise.all([
    getInstInfo({
      InstanceIds: [mainEc2Id],
    }),
    getInstInfo({
      InstanceIds: proxyEc2Ids,
    }),
  ]);

  rows.push(
    `${
      mainData[0].Instances[0].State.Name === "running" ? "🟢" : "🔴"
    } Main VM: ${mainData[0].Instances[0].PublicIpAddress}`,
    `${mainData[0].Instances[0].PublicDnsName}\n`
  );

  rows.push(`Proxies`);
  proxiesData.forEach((record: any, i: number) => {
    rows.push(
      `${
        record.Instances[0].State.Name === "running" ? "🟢" : "🔴"
      } Proxy ${i}: ${record.Instances[0].PublicIpAddress}`
    );
  });

  const msg = rows.join("\n");

  isAuth(ctx)
    ? await ctx.telegram.sendMessage(
        ctx.from.id,
        msg,
        inlineMessageInstanceKeyboard
      )
    : await ctx.reply("Not authorized");
});

bot.action("start", (ctx) => {
  startEBSInst({ InstanceIds: [mainEc2Id, ...proxyEc2Ids] });
  ctx.editMessageText("Starting...");
});

bot.action("stop", (ctx) => {
  stopEBSInst({ InstanceIds: [mainEc2Id, ...proxyEc2Ids] });
  ctx.editMessageText("Stoping...");
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
