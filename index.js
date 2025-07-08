require("dotenv").config();
const { Bot } = require("grammy");
const Parser = require("rss-parser");
const dayjs = require("dayjs");

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
  const today = dayjs().format("YYYY-MM-DD");

  if (lastSentDate === today) {
    console.log("✅ News already sent today. Skipping...");
    return;
  }

  console.log("🔄 Fetching tech news of the day...");

  let dailyArticles = [];

  for (const url of feedUrls) {
    try {
      const feed = await parser.parseURL(url);

      for (const item of feed.items) {
        if (dailyArticles.length >= 3) break;

        const key = item.guid || item.link;
        const title = item.title || "";
        const description = item.contentSnippet || "";
        const combinedText = `${title} ${description}`.toLowerCase();

        const hasKeyword = keywords.some((kw) => combinedText.includes(kw.toLowerCase()));

        if (hasKeyword && !sentItems.has(key)) {
          sentItems.add(key);
          dailyArticles.push(item);
        }
      }

      if (dailyArticles.length >= 3) break;
    } catch (err) {
      console.error(`❌ Error fetching from ${url}`, err);
    }
  }

  if (dailyArticles.length > 0) {
    const header = `🗞️ *Tech News of the Day* — ${dayjs().format("MMMM D, YYYY")}`;
    await bot.api.sendMessage(chatId, header, { parse_mode: "Markdown" });

    for (const article of dailyArticles) {
      const message = `📰 *${article.title}*\n${article.link}`;
      console.log(`📩 Sent: ${article.title}`);
      await bot.api.sendMessage(chatId, message, { parse_mode: "Markdown" });
    }

    lastSentDate = today;
  } else {
    console.log("⏳ No matching articles found today.");
    await bot.api.sendMessage(chatId, "⏳ No tech news matched your interests today.");
  }
}

// Run once on startup
fetchAndSendDailyNews();

// Then check every hour, but only send once per day
setInterval(fetchAndSendDailyNews, 60 * 60 * 1000); // every hour

bot.start();
console.log("✅ Bot is running...");
