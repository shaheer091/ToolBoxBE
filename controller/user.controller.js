const axios = require("axios");
const cron = require("node-cron");
const mailer = require("../utility/email.controller");
const timeToCron = require("../utility/timeToCron");
const taskSchema = require("../models/task");

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
  const { sourceLang, targetLang } = req.query;
  const { text } = req.body;
  if (!text || !sourceLang || !targetLang) {
    return res.json({
      message: "text, sourceLang and targetLang are required",
    });
  } else {
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
      if (response.status === 200) {
        res.json(response.data.responseData.translatedText);
      } else {
        throw new Error("Failed to translate text");
      }
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  }
};

const scheduleReminder = async (req, res) => {
  const { email, task, time } = req.body;
  if (!email || !task || !time) {
    return res.json({ message: "provide the necessary fields" });
  } else {
    const cronTime = timeToCron(time);
    await cron.schedule(cronTime, () => {
      mailer.scheduleReminder(email, time, task);
    });
    await new taskSchema({
      email,
      task,
      time,
    }).save();
    return res.json({
      message: `the task has been scheduled you will be mailed at ${time}`,
    });
  }
};

const getSheduledTasks = async (req, res) => {
  const tasks = await taskSchema.find();
  if (!tasks) {
    return res.json({ message: "No scheduled tasks" });
  } else {
    return res.json({ message: "Scheduled tasks found", tasks });
  }
};

module.exports = { searchBook, translate, scheduleReminder, getSheduledTasks };
