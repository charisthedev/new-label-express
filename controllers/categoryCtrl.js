const Category = require("../models/categoryModel");
const Movies = require("../models/movieModel");
const Activities = require("../models/activityModel");

const categoryCtrl = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createCategory: async (req, res) => {
    try {
      // if user have role = 1 ---> admin
      // only admin can create , delete and update category
      const { name } = req.body;
      const category = await Category.findOne({ name });
      if (category)
        return res.status(400).json({ msg: "This category already exists." });

      const newCategory = new Category({ name });

      const newActivities = new Activities({
        description: `Successfully created ${name} category`,
      });

      await newActivities.save();

      await newCategory.save();

      res.json({ msg: "Created a category" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      await Category.findByIdAndDelete({ _id: req.params.id });
      const categoryName = await Category.findOne({ _id: req.params.id });

      const newActivities = new Activities({
        description: `Successfully deleted ${categoryName.name} category`,
      });

      await newActivities.save();

      res.json({ msg: "Deleted a Category" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateCategory: async (req, res) => {
    try {
      const { name } = req.body;
      await Category.findOneAndUpdate({ _id: req.params.id }, { name });

      const newActivities = new Activities({
        description: `Successfully updated ${name} category`,
      });

      await newActivities.save();

      res.json({ msg: "Updated a category" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = categoryCtrl;
