const Movies = require("../models/movieModel");
const Discount = require("../models/dicountModel");
const Activities = require("../models/activityModel");

// Filter, sorting and paginating

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

const movieCtrl = {
  getMovies: async (req, res) => {
    try {
      const features = new APIfeatures(
        Movies.find().select("-video").populate("category"),
        req.query
      )
        .filtering()
        .sorting()
        .paginating();

      const movies = await features.query;

      res.json({
        status: "success",
        result: movies.length,
        movies: movies,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getMovie: async (req, res) => {
    try {
      const movie = await Movies.findById({ _id: req.params.id })
        .populate("category discount")
        .select("-video");
      if (!movie) return res.status(400).json({ msg: "Movie does not exist." });

      res.json(movie);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getVideoUrl: async (req, res) => {
    try {
      const movie = await Movies.findById({ _id: req.params.id }).populate(
        "category"
      );
      if (!movie) return res.status(400).json({ msg: "Movie does not exist." });

      res.json(movie);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createMovie: async (req, res) => {
    try {
      const {
        title,
        price,
        description,
        year,
        image,
        trailer,
        duration,
        donation,
        donate,
        free,
        discount,
        banner,
        casts,
        genre,
        video,
        category,
      } = req.body;
      if (!image && !banner && !video)
        return res.status(400).json({ msg: "Asset upload not complete" });

      const newMovie = new Movies({
        title: title.toLowerCase(),
        price,
        discount,
        year,
        description,
        discount,
        trailer,
        duration,
        donation,
        donate,
        free,
        image,
        banner,
        video,
        casts,
        genre,
        category,
      });

      const newActivities = new Activities({
        description: `Successfully created movie ${title}`,
      });

      await newActivities.save();

      await newMovie.save();
      res.json({ msg: "Created a movie" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteMovie: async (req, res) => {
    try {
      await Movies.findByIdAndDelete({ _id: req.params.id });

      const newActivities = new Activities({
        description: `Successfully deleted movie with id ${req.params.id}`,
      });

      await newActivities.save();

      res.json({ msg: "Deleted a Movie" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateMovie: async (req, res) => {
    try {
      const movie = await Movies.findById({ _id: req.params.id });
      await Movies.findByIdAndUpdate(
        { _id: req.params.id },
        {
          ...req.body,
        }
      );

      const newActivities = new Activities({
        description: `Successfully updated movie ${movie.title}`,
      });

      await newActivities.save();

      res.json({ msg: `Updated a movie ${movie.title}` });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = movieCtrl;
