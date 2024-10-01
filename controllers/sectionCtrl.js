const Section = require("../models/sectionModel");
const Movies = require("../models/movieModel");
const Seasons = require("../models/seasonModel");
const Series = require("../models/seriesModel");
const Activities = require("../models/activityModel");

const sectionCtrl = {
  getSections: async (req, res) => {
    try {
      const sections = await Section.find()
        .populate({
          path: "movies",
          select: "-video",
          populate: {
            path: "genre",
          },
        })
        .populate({
          path: "series",
          populate: {
            path: "genre",
          },
          populate: {
            path: "seasons",
          },
        }).lean();

      res.json({ sections,currency:req.currency });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occured while fetching sections." });
    }
  },
  getSection: async (req, res) => {
    try {
      const section = await Section.findById({ _id: req.params.id })
        .populate({
          path: "movies",
          select: "-video",
        })
        .populate({
          path: "series",
        });
      if (!section) return res.status(404).json({ msg: "Section not found" });

      res.json({
        status: "success",
        data: section,
        currency:req.currency
      });
    } catch (error) {
      res.status(500).json({ msg: err.message });
    }
  },
  createSection: async (req, res) => {
    try {
      const { name, movies, series, view } = req.body;
      if (!name && !view && !movies && !series)
        res.status(404).json({ message: "Please provide all payload." });

      const section = await Section.findOne({ name });
      if (section)
        res.status(404).json({ message: "Section name already exist." });

      const newSection = new Section({
        name,
        movies,
        series,
        view,
      });

      const newActivities = new Activities({
        description: `Successfully created section ${name}`,
        userId: req.id,
      });

      await newActivities.save();

      await newSection.save();

      res.json({ message: "Section created successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },
  updateSection: async (req, res) => {
    try {
      const { name, movies, series, view } = req.body;
      const section = await Section.findByIdAndUpdate(
        { _id: req.params.id },
        { name, movies, series, view }
      );

      const newActivities = new Activities({
        description: `Successfully updated section with name ${section.name}`,
        userId: req.id,
      });

      await newActivities.save();

      res.json({ message: "Updated a section." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },
  deleteSection: async (req, res) => {
    try {
      const sections = await Section.findOne({ _id: req.params.id });

      const section = await Section.findByIdAndDelete(req.params.id);

      const newActivities = new Activities({
        description: `Successfully deleted section with id ${section.name}`,
        userId: req.id,
      });

      await newActivities.save();
      res.json({ msg: "Deleted a Section" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  searchProduct: async (req, res) => {
    try {
      const movies = await Movies.find({ title: { $regex: req.query.title } })
        .limit(10)
        .select("title image type");
      const series = await Series.find({ title: { $regex: req.query.title } })
        .limit(10)
        .select("title image type");

      const search = movies.concat(series);

      res.json(search);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = sectionCtrl;
