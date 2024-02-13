const Movies = require("../models/movieModel");
const Series = require("../models/seriesModel");

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

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const browseCtrl = {
  browseItems: async (req, res) => {
    try {
      const searchTerm = req.query.term;
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;
      const moviesSearch = Movies.find({
        $or: [
          { title: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
        ],
      });
      const seriesSearch = Series.find({
        $or: [
          { title: { $regex: req.query.term, $options: "i" } },
          { description: { $regex: req.query.term, $options: "i" } },
        ],
      });
      const [movies, series] = await Promise.all([
        moviesSearch.skip(skip).limit(limit).exec(),
        seriesSearch.skip(skip).limit(limit).exec(),
      ]);
      const combinedResults = shuffleArray([...movies, ...series]);
      res.status(200).json({
        msg: "success",
        data: combinedResults,
        page,
        count: limit,
        total: combinedResults.length,
      });
    } catch (err) {
      res.status(500).json({ message: err.message || "server error occured" });
    }
  },
};

module.exports = browseCtrl;
