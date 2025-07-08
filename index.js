require("dotenv").config();
const { Bot } = require("grammy");
const Parser = require("rss-parser");
const dayjs = require("dayjs");

// Add this part — Express server to listen on a port:
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("Bot is running!"));

app.listen(PORT, () => {
  console.log(`✅ Express server listening on port ${PORT}`);
});

// === Your existing bot code continues here ===

const bot = new Bot(process.env.BOT_TOKEN);
const parser = new Parser();

const chatId = Number(process.env.CHAT_ID);
const feedUrls = [
  "https://www.theverge.com/rss/index.xml",
  "https://techcrunch.com/feed/",
  "https://www.xda-developers.com/feed/",
  "https://hnrss.org/newest"
];

const keywords = ["AI", "Python", "JavaScript", "iPhone", "GPU", "ChatGPT", "OpenAI", "Apple", "Samsung"];

console.log("🚀 Bot is starting...");

const sentItems = new Set();
let lastSentDate = "";

async function fetchAndSendDailyNews() {
  // ... your existing function here unchanged
}

// Run once on startup
fetchAndSendDailyNews();

// Then check every hour, but only send once per day
setInterval(fetchAndSendDailyNews, 60 * 60 * 1000); // every hour

bot.start();
console.log("✅ Bot is running...");
