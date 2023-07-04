const Genre = require("../models/genreModel");
const Activities = require("../models/activityModel");

const genreCtrl = {
  createGenre: async (req, res) => {
    try {
      const { name } = req.body;
      if (!name && !categories)
        return res
          .status(400)
          .json({ msg: "please include genre name and categories" });

      const newGenre = new Genre({
        name,
      });

      await newGenre.save();
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  updateGenre: async (req, res) => {
    try {
      const { name } = req.body;

      const genre = await Genre.findByIdUpdate(
        { _id: req.params.id },
        {
          name,
        }
      );

      if (!genre) return res.status(400).json({ msg: "data not found" });

      const newActivities = new Activities({
        description: `Successfully updated ${name} genre`,
      });

      await newActivities.save();

      res.json({ msg: `Updated ${name} genre` });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  getGenres: async (req, res) => {
    try {
      const genres = await Genre.find();

      res.json(genres);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  getGenre: async (req, res) => {
    try {
      const genre = await Genre.findById({ _id: req.params.id });

      res.json(genre);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  deleteGenre: async (req, res) => {
    try {
      const genre = await Genre.findByIdAndDelete({
        _id: req.params.id,
      });

      res.json(genre);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = genreCtrl;
