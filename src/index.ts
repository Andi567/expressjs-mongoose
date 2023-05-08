import "./lib/db";
import express from "express";
import countryRoutes from "./routes/country";

import { bot } from "./lib/bot";

bot.start((ctx) => ctx.reply("Welcome! Waaasuup?"));
bot.hears("hello", (ctx) => {
  ctx.reply("Hello to you too! My friend!!");
});

bot.launch();

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
