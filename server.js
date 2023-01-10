require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();
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
app.use("/api", require("./routes/continueWatchingRouter"));
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const port = process.env.PORT || 1998;
http.listen(port, () => {
  console.log("Server is running on port", port);
});
