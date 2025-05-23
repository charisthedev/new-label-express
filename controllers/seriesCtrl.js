const Series = require("../models/seriesModel");
const Activities = require("../models/activityModel");
const Payment = require("../models/paymentModel");
const AuthUtil = require("../utils/authUtils");

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

const seriesCtrl = {
  getAllSeries: async (req, res) => {
    try {
      const features = new APIfeatures(
        Series.find({ course: false }).populate([
          {
            path: "seasons",
            populate: [
              {
                path: "episodes",
                populate: {
                  path: "trailer",
                },
              },
              { path: "trailer" },
            ],
          },
        ]),
        req.query
      )
        .filtering()
        .sorting()
        .paginating();

      const series = await features.query;

      res.json({
        status: "success",
        message: "successfully fetched list of series",
        result: series.length,
        data: series,
        currency: req.currency,
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  createSeries: async (req, res) => {
    try {
      const {
        title,
        description,
        casts,
        genre,
        image,
        banner,
        donation,
        donate,
        emails,
      } = req.body;

      if (!req.body)
        return res.status(400).json({ msg: "All payload are required" });

      const newSeries = new Series({
        title: title.toLowerCase(),
        description,
        casts,
        genre,
        image,
        banner,
        donation,
        donate,
        emails,
      });

      const newActivities = new Activities({
        description: `Successfully created a new series with title ${title}`,
        userId: req.id,
      });

      await newActivities.save();

      await newSeries.save();

      res.json({
        status: "success",
        message: `Successfully create ${title} series`,
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  getSingleSeries: async (req, res) => {
    try {
      const series = await Series.findById(req.params.id)
        .populate([
          {
            path: "seasons",
            populate: [
              {
                path: "episodes",
                populate: {
                  path: "trailer",
                },
              },
              { path: "trailer" },
            ],
          },
          {
            path: "category",
          },
          { path: "genre" },
        ])
        .lean();

      if (!series)
        return res.status(400).json({ msg: "Series does not exist" });
      const userId = await AuthUtil(req);
      const verifyPayment = userId
        ? await Payment.findOne({
            user: userId,
            item: series._id,
            item_type: series.type,
            paymentType: { $ne: "donation" },
          })
        : false;
      res.json({
        status: "success",
        message: `Successfully fetched ${series.title} series`,
        data: {
          ...series,
          seasons: series.seasons.map((e) => ({
            ...e,
            episodes: e.episodes.map((e) => ({ ...e, currency: req.currency })),
            currency: req.currency,
          })),
          currency: req.currency,
          purchased: Boolean(verifyPayment),
        },
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  deleteASeries: async (req, res) => {
    try {
      const seriesTitle = await Series.findById(req.params.id);
      await Series.findByIdAndDelete({ _id: req.params.id });

      const newActivities = new Activities({
        description: `Successfully deleted ${seriesTitle.title} series`,
        userId: req.id,
      });

      await newActivities.save();

      res.json({
        msg: `Successfully deleted ${seriesTitle.title} series`,
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  updateASeries: async (req, res) => {
    try {
      if (!req.body)
        return res.status(400).json({ msg: "All payload are required" });
      const { _id, ...payload } = req.body;
      const updatedSeries = await Series.findByIdAndUpdate(req.params.id, {
        ...payload,
      });

      const newActivities = new Activities({
        description: `Successfully updated ${updatedSeries.title} series`,
        userId: req.id,
      });

      await newActivities.save();

      res.json({
        status: "success",
        message: `Successfully updated series`,
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = seriesCtrl;
