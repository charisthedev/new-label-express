const Activities = require("../models/activityModel");
const Course = require("../models/courseModel");
const Lesson = require("../models/lessonModel");

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    const queryObj = { ...this.queryString }; //queryString = req.query

    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => "$" + match
    );

    //    gte = greater than or equal
    //    lte = lesser than or equal
    //    lt = lesser than
    //    gt = greater than
    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const lessonCtrl = {
  getLessons: async (req, res) => {
    try {
      const features = new APIfeatures(
        Lesson.find().select("-video"),
        req.query
      )
        .filtering()
        .sorting()
        .paginating();

      const episodes = await features.query;

      res.json({
        status: "success",
        result: episodes.length,
        episodes: episodes,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getCourseLessons: async (req, res) => {
    try {
      const lessons = await Lesson.find({
        course: req.params.id,
      }).select("-video");
      if (!lessons)
        return res.status(400).json({ msg: "lesson does not exist." });

      res.json({ msg: "success", lessons });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createLesson: async (req, res) => {
    try {
      const {
        title,
        description,
        duration,
        publication_date,
        video,
        image,
        banner,
        course
      } = req.body;
      if (!image || !video || !banner)
        return res.status(400).json({ msg: "Asset upload not complete" });
      const newCourse = new Lesson({
        title: title.toLowerCase(),
        description,
        duration,
        publication_date,
        video,
        image,
        banner,
        course
      });

      const newActivities = new Activities({
        description: `Successfully created Lesson ${title}`,
        userId: req.id,
      });

      await newActivities.save();

      await newCourse
        .save()
        .then((newLesson) => {
          Course.findByIdAndUpdate(
            { _id: course },
            { $push: { lessons: newLesson._id } },
            { new: true }
          )
            .then(() => {
              return res
                .status(200)
                .json({ msg: "successfully created a lesson" });
            })
            .catch((err) => {
              return res.status(400).json({ msg: err.message });
            });
        })
        .catch((err) => {
          return res.status(400).json({ msg: err.message });
        });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getLesson: async (req, res) => {
    try {
      const episodeData = await Lesson.findById(req.params.id);

      return res.json({
        msg: "Queried",
        episodeData,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteLesson: async (req, res) => {
    try {
      const episode = await Lesson.findById({ _id: req.params.id });
      await Lesson.findByIdAndDelete(req.params.id);

      const newActivities = new Activities({
        description: `Successfully deleted lesson ${episode.title}`,
        userId: req.id,
      });

      await newActivities.save();

      return res.status(200).json({ msg: "Deleted a Lesson" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateLesson: async (req, res) => {
    try {
      if (!req.body)
        return res.status(400).json({ msg: "Please include a payload" });

      const episode = await Lesson.findById({ _id: req.params.id });

      await Lesson.findByIdAndUpdate(
        { _id: req.params.id },
        {
          ...req.body,
        }
      );

      const newActivities = new Activities({
        description: `Successfully updated lesson ${episode.title}`,
        userId: req.id,
      });

      await newActivities.save();

      return res.status(200).json({ msg: `Updated ${episode.title} Lesson` });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = lessonCtrl;
