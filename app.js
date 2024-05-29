const express = require('express')
const app = express()
const userRoute = require('./routes/user.routes')
require('dotenv').config()
const port = process.env.PORT
app.use(express.json());

app.use('/user', userRoute)

app.listen(port,()=>{
    console.log(`server running on ${port}`);
})