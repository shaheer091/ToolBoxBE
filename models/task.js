const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
    email: String,
    task: String,
    time: String,
})

module.exports = mongoose.model('tasks', taskSchema)