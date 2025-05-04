
const nodemailer = require("nodemailer");
const axios = require("axios");

module.exports = async function (context, req) {
  const telegramToken = process.env.TELEGRAM_TOKEN;
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_PASS;

  const body = req.body;
  const chatId = body.message?.chat.id;
  const userMessage = body.message?.text;

  context.log("Received message from Telegram:", userMessage);

  let responseText = "Hi, I'm Sassy AI!";
  if (/hello|hi/i.test(userMessage)) {
    responseText = "Hey there! What can I do for you today?";
  } else if (/email/i.test(userMessage)) {
    responseText = "Sending you a sweet email now!";
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    await transporter.sendMail({
      from: `Sassy AI <${gmailUser}>`,
      to: gmailUser,
      subject: "Sassy AI Telegram Trigger",
      text: `User said: ${userMessage}`,
    });
  }

  await axios.post(
    `https://api.telegram.org/bot${telegramToken}/sendMessage`,
    {
      chat_id: chatId,
      text: responseText,
    }
  );

  context.res = {
    status: 200,
    body: "OK",
  };
};
