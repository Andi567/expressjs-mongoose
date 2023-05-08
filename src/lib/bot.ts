import { Telegraf } from "telegraf";

if (!process.env.TELEGRAM_BOT_TOKEN) throw new Error("Please add a bot token");
export const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
