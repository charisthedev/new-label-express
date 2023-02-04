require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const multer = require('multer')
const fs = require("fs");
const path = require("path");

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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './assets/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + file.originalname);
  }
});

const upload = multer({
storage: storage
}).single('video');

app.post('/api/video-upload', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).send({
        success: false,
        message: 'Failed to upload video file'
      });
    } else {
      return res.status(200).send({
        success: true,
        message: 'Video file uploaded successfully',
        file:  req.file.fieldname + '-' + req.file.originalname
      });
    }
  });
});

app.get("/api/video/:file_name", (req, res) => {
  const path = `./assets/${req.params.file_name}`;
  const stat = fs.statSync(path)
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1]
        ? parseInt(parts[1], 10)
        : fileSize - 1;
    const chunksize = (end-start) + 1;
    const file = fs.createReadStream(path, {start, end})
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, head);
    file.pipe(res)
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    }
    res.writeHead(206, head);
    fs.createReadStream(path).pipe(res)
  }
})

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

const port = process.env.PORT || 5000;
const server = http.listen(port, () => {
  console.log("Server is running on port", port);
});

module.exports = server;
