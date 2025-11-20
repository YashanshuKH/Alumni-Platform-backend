const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const cookieParser = require("cookie-parser");

// Routers
const authRouter = require("./routes/authRouter");
const alumniRouter = require("./routes/alumniRouter");
const adminRouter = require("./routes/adminRouter");

const app = express();

// ---------- Middleware ----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ CORS (Must be before session)
const allowedOrigins = [
  "http://localhost:5173",
  "https://alumni-platform-backend-9r9d.onrender.com"
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests like Postman with no origin
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


// ✅ MongoDB Session Store
const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "sessions",
});

store.on("error", (error) => console.log("❌ Session Store Error:", error));

// ✅ Session Config
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      httpOnly: true,
      secure: false, // If deploying to production + https → set true
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      path:"/"
    },
  })
);
// ---------- Routes ----------
app.use("/api/auth", authRouter);
app.use("/api/alumni", alumniRouter);
app.use("/api/admin", adminRouter);

// Health Check
app.get("/", (_req, res) => res.send("✅ Server is Running"));

// ---------- Start Server ----------
const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.log("❌ MongoDB Error:", err));
