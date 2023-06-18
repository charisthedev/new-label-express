require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
const userRouter = require("./routes/userRouter");

const app = express();

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: "Too many requests, please try again later",
// });

// app.use(limiter);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.raw({ type: "application/octet-stream", limit: "100mb" }));
app.use(cors());
app.use("/uploads", express.static("uploads"));

// const http = require("http").createServer(app);

app.use("/api", require("./routes/userRouter"));
app.use("/api", require("./routes/movieRouter"));
app.use("/api", require("./routes/categoryRouter"));
app.use("/api", require("./routes/seasonRouter"));
app.use("/api", require("./routes/episodeRouter"));
app.use("/api", require("./routes/upload"));
app.use("/api", require("./routes/bannerRouter"));
app.use("/api", require("./routes/sectionRouter"));
app.use("/api", require("./routes/paymentRouter"));
app.use("/api", require("./routes/adminRouter"));
app.use("/api", require("./routes/genreRouter"));
app.use("/api", require("./routes/continueWatchingRouter"));
app.use("/api", require("./routes/seriesRouter"));
app.use("/api", require("./routes/discountRouter"));
app.use("/api", require("./routes/video-uploadRouter"));
app.use("/api", require("./routes/video-streamRouter"));
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
