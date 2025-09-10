const express = require('express');
require('dotenv').config()
const cors = require("cors")
const DB_PATH=process.env.MONGO_URL;
const { default: mongoose } = require('mongoose');
const authRouter = require('./routes/authRouter');
const bodyParser = require("body-parser")

const app=express();

app.use(express.json()); // <-- Important
app.use(express.urlencoded({ extended: true })); 


app.use("/api/user",authRouter)

const PORT=process.env.PORT || 3000;
mongoose.connect(DB_PATH).then(()=>{
    console.log('Connected to Mongo');
    app.listen(PORT,()=>{
    console.log(`Server running at http://localhost:${PORT}`);
});
}).catch(err=>{
    console.log("Error while connecting",err)
})