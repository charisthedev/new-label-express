const Movies = require("../models/movieModel");
const Payment = require("../models/paymentModel");
const Activities = require("../models/activityModel");
const AuthUtil = require("../utils/authUtils");

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
        currency: req.currency,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getMovie: async (req, res) => {
    try {
      const movie = await Movies.findById(req.params.id)
        .populate("category discount genre trailer")
        .lean();
      if (!movie) return res.status(400).json({ msg: "Movie does not exist." });
      const userId = await AuthUtil(req);
      const verifyPayment = userId
        ? await Payment.findOne({
            user: userId,
            item: movie._id,
            item_type: movie.type,
            paymentType: { $ne: "donation" },
          })
        : false;
      return res.status(200).json({
        ...movie,
        trailer: movie?.trailer?.link,
        currency: req.currency,
        purchased: Boolean(verifyPayment),
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getVideoUrl: async (req, res) => {
    try {
      const movie = await Movies.findById(req.params.id).populate(
        "category genre"
      );
      if (!movie) return res.status(400).json({ msg: "Movie does not exist." });
      const verify = await Payment.find({
        user_id: req.id,
        item_id: req.params.id,
      });
      if (!verify)
        return res
          .status(403)
          .json({ msg: "No Payment has been made for this Item" });
      const today = new Date();
      if (verify.validViews < 1 || today > new Date(verify.expirationDate))
        return res.status(403).json({ msg: "Access Expired" });

      return res.status(200).json(movie);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createMovie: async (req, res) => {
    try {
      const {
        title,
        price,
        discount,
        year,
        description,
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
        expirationSpan,
        validViews,
        emails,
      } = req.body;
      if (!image || !video)
        return res.status(400).json({ msg: "Asset upload not complete" });

      const newMovie = new Movies({
        title: title.toLowerCase(),
        price,
        discount,
        year,
        description,
        trailer: trailer || undefined,
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
        expirationSpan,
        validViews,
        emails,
      });

      const newActivities = new Activities({
        description: `Successfully created movie ${title}`,
        userId: req.id,
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
        userId: req.id,
      });

      await newActivities.save();

      res.json({ msg: "Deleted a Movie" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateMovie: async (req, res) => {
    try {
      const movie = await Movies.findById(req.params.id);
      const { _id, ...payload } = req.body;
      await Movies.findByIdAndUpdate(
        { _id: req.params.id },
        {
          ...payload,
        }
      );

      const newActivities = new Activities({
        description: `Successfully updated movie ${movie.title}`,
        userId: req.id,
      });

      await newActivities.save();

      res.json({ msg: `Updated a movie ${movie.title}` });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = movieCtrl;
