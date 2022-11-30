const Banner = require("../models/bannerModel");

const bannerCtrl = {
  getBanner: async (req, res) => {
    try {
        const { type } = req.params
      const banner = await Banner.find({ type }).populate({
        path: 'movies',
        select: '-video'
      }).populate({
        path: "seasons",
        select: "-episodes",
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
      const { type, movies, seasons } = req.body;

      const banner = await Banner.findOne({ type });
      if (banner)
        res
          .status(500)
          .send({ message: "type already exists, update instead." });

      const newBanner = new Banner({
        type,
        movies,
        seasons,
      });

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
      const { bannerData } = req.body;
      await Category.findOneAndUpdate({ _id: req.params.id }, { bannerData });

      res.json({ msg: `Updated a banner}` });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteBanner: async (req, res) => {
    try {
      await Banner.findByIdAndDelete(req.params.id);
      res.json({ msg: "Deleted a Banner" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = bannerCtrl;
