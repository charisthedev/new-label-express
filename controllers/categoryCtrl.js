const Category = require("../models/categoryModel");
const Movies = require("../models/movieModel");
const Activities = require("../models/activityModel");

const categoryCtrl = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      res.status(200).json(categories);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getCategory: async (req, res) => {
    try {
      const category = await Category.findById({ _id: req.params.id });
      if (!category) return res.status(404).json({ msg: "Category not found" });

      res.json({
        status: "success",
        data: category,
      });
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
        userId:req.id
      });

      await newActivities.save();

      await newCategory.save();

      res.json({ msg: `Created category ${name}` });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const category = await Category.findById({ _id: req.params.id });
      await Category.findByIdAndDelete({ _id: req.params.id });

      const newActivities = new Activities({
        description: `Successfully deleted category ${category.name}`,
        userId:req.id
      });

      await newActivities.save();

      res.json({ msg: `Deleted Category ${category.name}` });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateCategory: async (req, res) => {
    try {
      const { name } = req.body;
      await Category.findOneAndUpdate({ _id: req.params.id }, { name });

      const newActivities = new Activities({
        description: `Successfully updated category ${name}`,
        userId:req.id
      });

      await newActivities.save();

      res.json({ msg: `Updated category ${name}` });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = categoryCtrl;
