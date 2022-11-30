const Section = require("../models/sectionModel");

const sectionCtrl = {
  getSections: async (req, res) => {
    try {
      const sections = await Section.find()
        .populate({
          path: "movies",
          select: "-video -category",
        })
        .populate({
          path: "seasons",
          select: "-episodes",
        });

      res.json({ sections });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occured while fetching sections." });
    }
  },
  createSection: async (req, res) => {
    try {
      const { name, movies, seasons, view } = req.body;
      if (!name && !view && !movies && !seasons)
        res.status(404).json({ message: "Please provide all payload." });

      const section = await Section.findOne({ name });
      if (section)
        res.status(404).json({ message: "Section name already exist." });

      const newSection = new Section({
        name,
        movies,
        seasons,
        view,
      });
      await newSection.save();
      res.json({ message: "Section created successfully." });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occured while creating sections." });
    }
  },
  updateSection: async (req, res) => {
    try {
      const { name, movies, seasons, view } = req.body;
      await Section.findOneAndUpdate(
        { _id: req.params.id },
        { name, movies, seasons, view }
      );

      res.json({ message: "Updated a section." });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occured while creating sections." });
    }
  },
  deleteSection: async (req, res) => {
    try {
      const sections = await Section.findOne({ _id: req.params.id });

      await Section.findByIdAndDelete(req.params.id);
      res.json({ msg: "Deleted a Section" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = sectionCtrl;
