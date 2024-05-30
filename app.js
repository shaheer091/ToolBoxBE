const express = require('express')
const app = express()
const userRoute = require('./routes/user.routes')
require('dotenv').config()
const port = process.env.PORT
app.use(express.json());
const database = require('./utility/database')

app.use('/user', userRoute)

database()

app.listen(port,()=>{
    console.log(`server running on ${port}`);
})