const Episodes = require("../models/episodeModel");
const Activities = require("../models/activityModel");
const Seasons = require("../models/seasonModel");

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

const episodeCtrl = {
  getEpisodes: async (req, res) => {
    try {
      const features = new APIfeatures(
        Episodes.find().select("-video"),
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
        currency: req.currency,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getSeasonEpisodes: async (req, res) => {
    try {
      const episodes = await Episodes.find({
        season_id: req.params.id,
      }).select("-video");
      if (!episodes)
        return res.status(400).json({ msg: "episode does not exist." });

      res.json({ msg: "success", episodes, currency: req.currency });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createEpisode: async (req, res) => {
    try {
      const {
        title,
        description,
        duration,
        publication_date,
        video,
        image,
        banner,
        trailer,
        expirationSpan,
        validViews,
        series,
        season,
        price,
        free,
      } = req.body;
      if (!image || !video || !banner || !trailer)
        return res.status(400).json({ msg: "Asset upload not complete" });

      // const episode = await Episodes.findOne({ episode_id });
      // if (episode)
      //   return res.status(400).json({ msg: "This episode already exists." });
      const newEpisode = new Episodes({
        title: title.toLowerCase(),
        description,
        duration,
        publication_date,
        video,
        image,
        banner,
        trailer,
        expirationSpan,
        validViews,
        series,
        season,
        free,
        price,
      });

      const newActivities = new Activities({
        description: `Successfully created ${title}`,
        userId: req.id,
      });

      await newActivities.save();

      await newEpisode
        .save()
        .then((newEpisode) => {
          Seasons.findByIdAndUpdate(
            { _id: season },
            { $push: { episodes: newEpisode._id } },
            { new: true }
          )
            .then(() => {
              return res
                .status(200)
                .json({ msg: "successfully created an episode" });
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
  getEpisode: async (req, res) => {
    try {
      const episodeData = await Episodes.findById(req.params.id).populate(
        "trailer"
      );

      return res.json({
        msg: "Queried",
        episodeData: { ...episodeData, currency: req.currency },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteEpisode: async (req, res) => {
    try {
      const episode = await Episodes.findById(req.params.id);
      await Episodes.findByIdAndDelete(req.params.id);

      const newActivities = new Activities({
        description: `Successfully deleted episode ${episode.title}`,
        userId: req.id,
      });

      await newActivities.save();

      return res.status(200).json({ msg: "Deleted an Epsiode" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateEpisode: async (req, res) => {
    try {
      if (!req.body)
        return res.status(400).json({ msg: "Please include a payload" });

      const episode = await Episodes.findById(req.params.id);

      await Episodes.findByIdAndUpdate(
        { _id: req.params.id },
        {
          ...req.body,
        }
      );

      const newActivities = new Activities({
        description: `Successfully updated ${episode.title}`,
        userId: req.id,
      });

      await newActivities.save();

      return res.status(200).json({ msg: `Updated ${episode.title} Episode` });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = episodeCtrl;
