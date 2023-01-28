const Banner = require("../models/bannerModel");
const Activities = require("../models/activityModel");

const bannerCtrl = {
  getBanners: async (req, res) => {
    try {
      const banners = await Banner.find();

      res.json({
        status: "success",
        data: banners,
      });
    } catch (error) {
      res.status(500).json({ msg: err.message });
    }
  },
  getBanner: async (req, res) => {
    try {
      const { type } = req.params;
      const banners = await Banner.find({ type })
        .populate({
          path: "movies",
          select: "-video",
        })
        .populate({
          path: "series",
          select: "-seasons",
        });

      // Use reduce to combine the elements of the array into a single object
      const banner = banners.reduce((obj, item) => {
        obj[item.type] = item;
        return obj;
      }, {});

      res.json({ banner });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while fetching the banner." });
    }
  },
  createBanner: async (req, res) => {
    try {
      const { type, movies, series } = req.body;
      if (!type && !movies && !series)
        return res.status(404).json({ msg: "Please provide all payload" });

      const banner = await Banner.findOne({ type });
      if (banner)
        res
          .status(404)
          .send({ message: "type already exists, update instead." });

      const newBanner = new Banner({
        type,
        movies,
        series,
      });

      const newActivity = new Activities({
        description: `Successfully created ${type} banner`,
      });

      await newActivity.save();

      await newBanner.save();

      res.json({
        msg: "Created a banner",
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: "An error occurred while Creating the banner." });
    }
  },
  updateBanner: async (req, res) => {
    try {
      await Banner.findOneAndUpdate({ _id: req.params.id }, { ...req.body });

      const newActivity = new Activities({
        description: `Successfully Updated banner with id ${req.params.id}`,
      });

      await newActivity.save();

      res.json({ msg: `Updated a banner}` });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteBanner: async (req, res) => {
    try {
      await Banner.findByIdAndDelete(req.params.id);

      const newActivity = new Activities({
        description: `Successfully Deleted banner with id ${req.params.id}`,
      });

      await newActivity.save();

      res.json({ msg: "Deleted a Banner" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = bannerCtrl;
