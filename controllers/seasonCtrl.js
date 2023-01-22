const Seasons = require("../models/seasonModel");
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

const seasonCtrl = {
  getSeasons: async (req, res) => {
    try {
      const features = new APIfeatures(
        Seasons.find()
          .populate({
            path: "episodes",
            select: "-video",
          })
          .sort({ _id: 1 }),
        req.query
      )
        .filtering()
        .sorting()
        .paginating();

      const seasons = await features.query;

      res.json({
        status: "success",
        result: seasons.length,
        seasons: seasons,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createSeason: async (req, res) => {
    try {
      const {
        title,
        price,
        description,
        image,
        trailer,
        donation,
        free,
        banner,
        number,
        episodes,
      } = req.body;
      if (!image && !banner)
        return res.status(400).json({ msg: "Asset upload not complete" });

      const newSeason = new Seasons({
        title: title.toLowerCase(),
        price,
        description,
        image,
        trailer,
        donation,
        free,
        banner,
        number,
        episodes,
      });

      const newActivities = new Activities({
        description: `Successfully created season ${title}`,
      });

      await newActivities.save();

      await newSeason.save();
      res.json({ msg: "Created a season" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getSeason: async (req, res) => {
    try {
      const season = await Seasons.findById({ _id: req.params.id }).populate({
        path: "episodes",
        select: "-video",
      });
      if (!season)
        return res.status(400).json({ msg: "Seasons does not exist." });

      res.json(season);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteSeason: async (req, res) => {
    try {
      await Seasons.findByIdAndDelete({ _id: req.params.id });

      const newActivities = new Activities({
        description: `Successfully deleted season with id ${req.params.id}`,
      });

      await newActivities.save();

      res.json({ msg: "Deleted a Season" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateSeason: async (req, res) => {
    try {
      const {
        season_id,
        title,
        price,
        description,
        image,
        trailer,
        donation,
        free,
        banner,
        number,
        episodes,
      } = req.body;

      await Seasons.findOneAndUpdate(
        { _id: req.params.id },
        {
          season_id,
          title: title.toLowerCase(),
          price,
          description,
          image,
          banner,
          number,
          trailer,
          donation,
          free,
          episodes,
        }
      );

      const newActivities = new Activities({
        description: `Successfully updated season with id ${req.params.id}`,
      });

      await newActivities.save();

      res.json({ msg: "Updated a Season" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = seasonCtrl;
