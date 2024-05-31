const userSchema = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("../utility/jwt.controller");

const register = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }
  try {
    const existingUser = await userSchema.findOne({
      $or: [{ username, email }],
    });
    if (existingUser) {
      if (existingUser.username) {
        return res.status(400).json({ error: "Username already exists" });
      } else if (existingUser.email) {
        return res
          .status(400)
          .json({ error: "User already exists. Please login" });
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userSchema({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    const payload = { username, email, id: newUser._id };
    const token = jwt.createToken(payload);
    return res.json({ message: "user created successfull", token });
  } catch (err) {
    console.log(err);
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const existingUser = await userSchema.findOne({ username });
    if (!existingUser) {
      return res.status(400).json({ error: "User does not exist" });
    } else {
      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (!isMatch) {
        return res.json({ message: "Password doesn't match" });
      } else {
        const payload = { username, email: existingUser.email, id: existingUser._id };
        const token = jwt.createToken(payload);
        return res.json({ message: "user logged in successfull", token });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  register,
  login,
};
