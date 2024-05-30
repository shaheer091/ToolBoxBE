const axios = require("axios");
const cron = require("node-cron");
const mailer = require("../utility/email.controller");
const timeToCron = require("../utility/timeToCron");

const searchBook = async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).send({ error: 'Query parameter "q" is required' });
  }
  try {
    const response = await axios.get(
      "https://www.googleapis.com/books/v1/volumes",
      {
        params: {
          q: query,
          key: process.env.GOOGLE_API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data from Google Books API:", error);
    res
      .status(500)
      .send({ error: "Failed to fetch data from Google Books API" });
  }
};

const translate = async (req, res) => {
  const { text, sourceLang, targetLang } = req.query;
  try {
    const response = await axios.get(
      `https://api.mymemory.translated.net/get`,
      {
        params: {
          q: text,
          langpair: `${sourceLang}|${targetLang}`,
        },
      }
    );
    console.log(response.data.responseData.translatedText);

    if (
      response.status === 200 &&
      response.data &&
      response.data.responseData &&
      response.data.responseData.translatedText
    ) {
      res.json(response.data.responseData.translatedText);
    } else {
      throw new Error("Failed to translate text");
    }
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
};

const scheduleReminder = async (req, res) => {
  const { email, task, time } = req.body;
  console.log(task);
  if (!email || !task || !time) {
    return res.json({ message: "provide the necessary fields" });
  } else {
    const cronTime = timeToCron(time);
    console.log(cronTime);
    await cron.schedule(cronTime, () => {
      if (typeof task === "string") {
        mailer.scheduleReminder(email, time, task);
      } else {
        console.error("Task must be a string");
      }
    });
    return res.json({
      message: "the task has been scheduled you will be mailed at the time",
    });
  }
};

module.exports = { searchBook, translate, scheduleReminder };
