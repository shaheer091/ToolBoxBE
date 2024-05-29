const axios = require("axios");

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
  const { text, sourceLang, targetLang } = req.body;
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

module.exports = { searchBook, translate };
