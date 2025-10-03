const express = require('express');
require('dotenv').config()
const cors = require("cors")
const DB_PATH=process.env.MONGO_URL;
const session = require('express-session');
const MongoDBStore =require('connect-mongodb-session')(session);
const { default: mongoose } = require('mongoose');
const authRouter = require('./routes/authRouter');

const alumniRouter = require('./routes/alumniRouter');
const cookieParser = require('cookie-parser');
const adminRouter = require('./routes/adminRouter');

const app=express();

app.use(express.json()); // <-- Important
app.use(cookieParser())
app.use(express.urlencoded({ extended: true })); 

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://alumni-platform-18zc.onrender.com"
    ],
    credentials: true,
  })
);


// MongoDB session store
const store = new MongoDBStore({
  uri:process.env.MONGO_URL,
  collection: "sessions",
});

// Session middleware
app.use(
  session({
    secret: process.env.JWT_SECRET, // store in .env
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 *30, // 1 hour
      httpOnly: true, // cannot be accessed by JS
      secure: false, // set true if using HTTPS
      sameSite:"lax"
    },
  })
);

app.use("/api/auth",authRouter)
app.use("/api/alumni",alumniRouter)
app.use("/api/admin",adminRouter)



const PORT=process.env.PORT || 3000;
mongoose.connect(DB_PATH).then(()=>{
    console.log('Connected to Mongo');
    app.listen(PORT,()=>{
    console.log(`Server running at http://localhost:${PORT}`);
});
}).catch(err=>{
    console.log("Error while connecting",err)
})