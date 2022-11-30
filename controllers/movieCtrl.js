const Movies = require("../models/movieModel");

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
        Movies.find().select('-video').populate("category"),
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
            const movie = await Movies.findById(req.params.id).populate("category").select('-video')
            if(!movie) return res.status(400).json({msg: "Movie does not exist."})

            res.json(movie)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
  },
  getVideoUrl: async (req, res) => {
        try {
            const movie = await Movies.findById(req.params.id).populate("category").select('video -category -_id')
            if(!movie) return res.status(400).json({msg: "Movie does not exist."})

            res.json(movie)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
  }, 
  createMovie: async (req, res) => {
    try {
      const {
        movie_id,
        title,
        price,
        description,
        image,
        banner,
        video,
        category,
      } = req.body;
      if (!image && !banner && !video)
        return res.status(400).json({ msg: "Asset upload not complete" });

      const movie = await Movies.findOne({ movie_id });
      if (movie)
        return res.status(400).json({ msg: "This movie already exists." });

      const newMovie = new Movies({
        movie_id,
        title: title.toLowerCase(),
        price,
        description,
        image,
        banner,
        video,
        category,
      });

      await newMovie.save();
      res.json({ msg: "Created a movie" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteMovie: async (req, res) => {
    try {
      await Movies.findByIdAndDelete(req.params.id);
      res.json({ msg: "Deleted a Movie" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateMovie: async (req, res) => {
    try {

      await Movies.findOneAndUpdate(
        { _id: req.params.id },
        {
          ...req.body
        }
      );

      res.json({ msg: "Updated a Product" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = movieCtrl;
