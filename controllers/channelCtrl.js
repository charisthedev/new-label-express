const Category = require("../models/categoryModel");
const Movies = require("../models/movieModel");
const Series = require("../models/seriesModel");
function combineArrays(arr1, arr2) {
  const combinedArray = arr1.concat(arr2);
  const shuffledArray = combinedArray.sort(() => Math.random() - 0.5);
  return shuffledArray;
}
const channelCtrl = {
  getChannels: async (req, res) => {
    try {
      const category = await Category.find();
      const channels = [];
      for (let index = 0; index < category.length; index++) {
        const e = category[index];
        const movies = await Movies.find({ category: e._id }).limit(10);
        const series = await Series.find({ category: e._id }).limit(10);
        const items = combineArrays(movies, series);
        channels.push({ title: e.name, id: e._id, items });
      }
      res.status(200).json({ msg: "successfully fetched channels", channels });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getSingleChannel: async (req, res) => {
    try {
      const queryChannel = req.params.id;
      const channel = await Category.find({ name: queryChannel });
      if (!channel) {
        res.status(400).json({ msg: "channel doesn't exist" });
      }
      const movies = await Movies.find({ category: channel[0]._id });
      const series = await Series.find({ category: channel[0]._id });
      res.status(200).json({
        msg: "sucessfully fetched channel",
        channels: [
          {
            items: combineArrays(movies, series),
            title: channel[0].name,
            id: channel[0]._id,
          },
        ],
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = channelCtrl;
