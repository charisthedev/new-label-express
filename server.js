require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
const requestIp = require("request-ip");

const app = express();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: "Too many requests, please try again later",
// });

// app.use(limiter);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.raw({ type: "application/octet-stream", limit: "100mb" }));
app.use(cors({ origin: '*' }));
app.use("/uploads", express.static("uploads"));
app.set('trust proxy', true);
// app.use(requestIp.mw());

// const http = require("http").createServer(app);

app.use("/api/auth", require("./routes/userRouter"));
app.use("/api/movies", require("./routes/movieRouter"));
app.use("/api/category", require("./routes/categoryRouter"));
app.use("/api/seasons", require("./routes/seasonRouter"));
app.use("/api/episodes", require("./routes/episodeRouter"));
app.use("/api/lessons", require("./routes/lessonRouter"));
// app.use("/api/upload", require("./routes/upload"));
app.use("/api/banner", require("./routes/bannerRouter"));
app.use("/api/section", require("./routes/sectionRouter"));
app.use("/api/orders", require("./routes/paymentRouter"));
app.use("/api/admin", require("./routes/adminRouter"));
app.use("/api/genre", require("./routes/genreRouter"));
app.use("/api/continue-watching", require("./routes/continueWatchingRouter"));
app.use("/api/series", require("./routes/seriesRouter"));
app.use("/api/course", require("./routes/courseRouter"));
app.use("/api/discount", require("./routes/discountRouter"));
app.use("/api/upload", require("./routes/video-uploadRouter"));
app.use("/api/stream", require("./routes/video-streamRouter"));
app.use("/api/browse", require("./routes/browseRouter"));
app.use("/api/channels", require("./routes/channelRouter"));
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
const URI = process.env.MONGODB_URL;
mongoose.connect(
  URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Connected to mongodb");
  }
);
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Server is running on port", port);
});
