require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const fs = require('fs')

const app = express();

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: "Too many requests, please try again later",
// });

// app.use(limiter);
app.use(express.json());
app.use(cookieParser());
app.use(cors());

const http = require("http").createServer(app);

let chunks = [];
let chunkCount = 0;

app.post("/api/asset-upload", (req, res) => {
  const chunk = Buffer.from(req.body.chunk, "base64");
  chunks.push(chunk);
  chunkCount++;

  console.log(`Received chunk ${chunkCount}`);

  if (chunkCount === req.body.chunkCount) {
    console.log("Received all chunks, reassembling file...");
    const completeFile = Buffer.concat(chunks);
    fs.writeFile("video.mp4", completeFile, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error while reassembling file");
      } else {
        res.status(200).send("File reassembled");
      }
    });
    chunks = [];
    chunkCount = 0;
  } else {
    res.status(200).send("Chunk received");
  }
});

app.use("/user", require("./routes/userRouter"));
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
app.use("/api", require("./routes/video-uploadRouter"))
app.use("/api", require("./routes/video-streamRouter"))
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
const server = http.listen(port, () => {
  console.log("Server is running on port", port);
});

module.exports = server;
