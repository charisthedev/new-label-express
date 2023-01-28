require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later",
});

// app.use(limiter);
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

const http = require("http").createServer(app);

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

app.use("/user", limiter, require("./routes/userRouter"));
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
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const port = process.env.PORT || 5000;
const server = http.listen(port, () => {
  console.log("Server is running on port", port);
});

module.exports = server;
