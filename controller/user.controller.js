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

const getWeather = async (req, res) => {
  const { location } = req.query;
  console.log(location);
  const apiKey = process.env.WEATHER_API_KEY;
  if (!location) {
    return res.json({ message: "Location is required in query" });
  } else {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
    try {
      const response = await axios.get(url);
      console.log(response.data);
      return res.json(response.data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  }
};

const getNews = async (req, res) => {
  try {
    const { q, from, to, language = "en", sortBy = "popularity" } = req.query;
    const apiKey = process.env.NEWS_API_KEY;

    if (q) {
      url = `https://newsapi.org/v2/everything?q=${q}&apiKey=${apiKey}`;
    } else {
      url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=${apiKey}`;
    }
    if (from) url += `&from=${from}`;
    if (to) url += `&to=${to}`;
    if (language) url += `&language=${language}`;
    if (sortBy) url += `&sortBy=${sortBy}`;

    console.log(url);
    const response = await axios.get(url);

    if (response.data.articles.length === 0) {
      return res.status(404).json({ message: "No articles found" });
    }

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching news data:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching news data", error: error.message });
  }
};

module.exports = {
  searchBook,
  translate,
  scheduleReminder,
  getSheduledTasks,
  getWeather,
  getNews,
};
