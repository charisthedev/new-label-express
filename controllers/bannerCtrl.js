const Banner = require("../models/bannerModel");
const Activities = require("../models/activityModel");

const bannerCtrl = {
  getBanners: async (req, res) => {
    try {
      const banners = await Banner.find().populate(["movies", "series"]);

      res.json({
        status: "success",
        data: banners,
      });
    } catch (error) {
      res.status(500).json({ msg: err.message });
    }
  },
  getBannerAdmin: async (req, res) => {
    try {
      const banners = await Banner.find().populate(["movies", "series"]);

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
      const banners = await Banner.findOne({ type })
        .populate({
          path: "movies",
          select: "-video",
        })
        .populate({
          path: "series",
          select: "-video",
        });

      // Use reduce to combine the elements of the array into a single object

      res.json({ banner: banners });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while fetching the banner." });
    }
  },
  getBannerClient: async (req, res) => {
    try {
      const { type } = req.params;
      const banner = await Banner.find({ type })
        .populate({
          path: "movies",
          select: "-video",
          populate: {
            path: "genre category",
          },
        })
        .populate({
          path: "series",
          select: "-video",
          populate: {
            path: "genre category seasons",
          },
        });

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
      if (!req.body)
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
        userId: req.id,
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
      const { type } = req.params;
      await Banner.findOneAndUpdate(
        { type },
        {
          ...req.body,
        }
      );

      const newActivity = new Activities({
        description: `Successfully Updated ${type} banner`,
        userId: req.id,
      });

      await newActivity.save();

      res.json({ msg: `Updated ${type} banner` });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteBanner: async (req, res) => {
    try {
      await Banner.findOneAndDelete(req.params.type);

      const newActivity = new Activities({
        description: `Successfully Deleted ${req.params.type} banner`,
        userId: req.id,
      });

      await newActivity.save();

      res.json({ msg: `Deleted ${req.params.type} Banner` });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = bannerCtrl;
