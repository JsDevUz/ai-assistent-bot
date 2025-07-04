require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const stringSimilarity = require("string-similarity");
const fs = require("fs");

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const data = JSON.parse(fs.readFileSync("./data.json", "utf-8"));

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const userQuestion = msg.text;

  const matched = findBestMatch(userQuestion);

  if (!matched) {
    return bot.sendMessage(
      chatId,
      "Kechirasiz, bu haqda ma'lumotga ega emasman."
    );
  }

  bot.sendMessage(chatId, matched.javob);
});

function findBestMatch(userQuestion) {
  const allQuestions = data.map((item) => item.savol);
  const { bestMatch } = stringSimilarity.findBestMatch(
    userQuestion,
    allQuestions
  );
  console.log("🔍 Savol:", userQuestion);
  console.log("🧠 Eng o‘xshash:", bestMatch.target);
  console.log("📈 O‘xshashlik balli:", bestMatch.rating.toFixed(2));
  // Siz thresholdni xohlaganingizcha sozlashingiz mumkin (0.6 dan boshlab)
  if (bestMatch.rating >= 0.4) {
    const index = allQuestions.indexOf(bestMatch.target);
    return data[index];
  }

  return null;
}
