const Series = require("../models/seriesModel");
const Course = require("../models/courseModel");
const Lesson = require("../models/lessonModel");
const Episodes = require("../models/episodeModel");
const WatchHistory = require("../models/continueWatchingModel");
const Activities = require("../models/activityModel");

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

const courseCtrl = {
  getAllCourse: async (req, res) => {
    try {
    //   const features = new APIfeatures(
    //     Series.find().populate("seasons"),
    //     req.query
    //   )
    //     .filtering()
    //     .sorting()
    //     .paginating();
      const limit = req.query.limit??0;
      const searchTerm = req.query.term??"";
      const course = await Course.find({$or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ]}).limit(limit);

      res.json({
        status: "success",
        message: "successfully fetched list of course",
        result: course.length,
        data: course,
        currency:req.currency
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  createCourse: async (req, res) => {
    try {
      const { title, description, casts, genre, image, banner, donation, certificate,emails, price } =
        req.body;

      if (!req.body)
        return res.status(400).json({ msg: "All payload are required" });

      const newCourse = new Course({
        title: title.toLowerCase(),
        description,
        casts,
        genre,
        image,
        banner,
        donation,
        course:true,
        certificate,
        emails,
        price
      });

      const newActivities = new Activities({
        description: `Successfully created a new course with title ${title}`,
        userId: req.id,
      });

      await newActivities.save();

      await newCourse.save();

      res.json({
        status: "success",
        message: `Successfully create ${title} course`,
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
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
        trailer,
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
  getSingleCourse: async (req, res) => {
    try {
      const course = await Course.findOne({ id: req.params.id })
        .populate([
          {
            path: "lessons",
          },
          {
            path: "category",
          },
        ])
        .populate("genre");

      if (!course)
        return res.status(400).json({ msg: "Course does not exist" });

      res.json({
        status: "success",
        message: `Successfully fetched ${course.title} course`,
        data: {...course[0],currency:req.currency},
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  deleteCourse: async (req, res) => {
    try {
      const courseTitle = await Course.findOne({ id: req.params.id });
      await Course.findByIdAndDelete({ _id: req.params.id });

      const newActivities = new Activities({
        description: `Successfully deleted ${courseTitle.title} course`,
        userId: req.id,
      });

      await newActivities.save();

      res.json({
        msg: `Successfully deleted ${courseTitle.title} course`,
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  updateCourse: async (req, res) => {
    try {
      if (!req.body)
        return res.status(400).json({ msg: "All payload are required" });

      const courseTitle = await Course.findOne({ id: req.params.id });

      await Course.findByIdAndUpdate(
        { _id: req.params.id },
        {
          ...req.body,
        }
      );

      const newActivities = new Activities({
        description: `Successfully updated ${courseTitle.title} course`,
        userId: req.id,
      });

      await newActivities.save();

      res.json({
        status: "success",
        message: `Successfully updated ${courseTitle.title} course`,
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  requestCertificate: async (req, res) => {
    try {
      if (!req.params.id)
        return res.status(400).json({ msg: "Course Id is required" });

      const allLessons = await Lesson.find({ series: req.params.id }).select("_id");
    const allLessonIds = allLessons.map((episode) => episode._id?.toHexString());

    const allUserWatchHistory = await WatchHistory.find({ userId: req.id }).select("item");
    const allUserWatchHistoryIds = allUserWatchHistory.map((history) => history.item?.toHexString());

    if (allLessonIds.every((id) => allUserWatchHistoryIds.includes(id))) {
      res.status(200).json({
        status: "eligible",
      });
    } else {
      res.status(400).json({
        status: "Not Eligible",
        msg: "Please complete all modules to download your certificate",
      });
    }
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

};

module.exports = courseCtrl;
