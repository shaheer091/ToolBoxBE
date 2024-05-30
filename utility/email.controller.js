const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const scheduleReminder = async function (email, time, task) {
  const mailOption = {
    from: process.env.EMAIL,
    to: email,
    subject: "Task Reminder",
    text: `Reminder: ${task}`,
    html: `
          <h3>Task Reminder</h3>
          <p>You have a scheduled task reminder:</p>
          <ul>
            <li><strong>Task:</strong> ${task}</li>
            <li><strong>Time:</strong> ${time}</li>
          </ul>
          <p>Don't forget to complete your task on time!</p>
        `,
  };

  try {
    await transporter.sendMail(mailOption);
    console.log('mail send to user');
  } catch (err) {
    console.log(err);
  }
};

module.exports = { scheduleReminder };
