const Payments = require("../models/paymentModel");
const Seasons = require("../models/seasonModel");
const Genres = require("../models/genreModel");
const Discounts = require("../models/dicountModel");
const Episodes = require("../models/episodeModel");
const Movies = require("../models/movieModel");
const Activities = require("../models/activityModel");
const Category = require("../models/categoryModel");

const adminCtrl = {
  getDashboardCount: async (req, res) => {
    try {
      const filter = {};

      const categoriesCount = await Category.countDocuments(filter);
      const movieCount = await Movies.countDocuments(filter);
      const seasonsCount = await Seasons.countDocuments(filter);
      const episodeCount = await Episodes.countDocuments(filter);
      const ordersCount = await Payments.countDocuments(filter);
      const genreCount = await Genres.countDocuments(filter);
      const discountCount = await Discounts.countDocuments(filter);

      const productCount = movieCount + seasonsCount + episodeCount;

      res.json({
        data: {
          productCount: productCount,
          ordersCount: ordersCount,
          categoriesCount: categoriesCount,
          genreCount: genreCount,
          couponCount: discountCount,
        },
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  getTotalOrdersByDay: async (req, res) => {
    try {
      const endTime = new Date();
      const startTime = new Date(endTime.getTime() - 24 * 60 * 60 * 1000);

      const groupStage = {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      };

      const sortStage = {
        $sort: { _id: 1 },
      };

      const results = await Payments.aggregate([groupStage, sortStage]);

      const finalResults = [];

      let previousCount = 0;
      for await (const result of results) {
        previousCount = result.count;
        result.loss = result.count < previousCount;
        finalResults.push(result);
      }

      res.json({
        data: results,
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  getRecentActivities: async (req, res) => {
    try {
      const activities = await Activities.find().sort({ _id: -1 }).limit(5);

      res.json({
        data: activities,
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = adminCtrl;
