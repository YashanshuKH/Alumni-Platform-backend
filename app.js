const express = require('express');
require('dotenv').config()
const cors = require("cors")
const DB_PATH=process.env.MONGO_URL;
const session = require('express-session');
const MongoDBStore =require('connect-mongodb-session')(session);
const { default: mongoose } = require('mongoose');
const authRouter = require('./routes/authRouter');
const bodyParser = require("body-parser")

const app=express();

app.use(express.json()); // <-- Important
app.use(express.urlencoded({ extended: true })); 

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
); 

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