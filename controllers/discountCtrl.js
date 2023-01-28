const Discount = require("../models/dicountModel");
const Activities = require("../models/activityModel");
const crypto = require("crypto");

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

const discountCtrl = {
  getAllDiscounts: async (req, res) => {
    try {
      const features = new APIfeatures(Discount.find(), req.query)
        .filtering()
        .sorting()
        .paginating();

      const discounts = await features.query;

      res.json({
        message: "Successfully fetched discounts",
        data: discounts,
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  createDiscount: async (req, res) => {
    try {
      const { name, percentage, active } = req.body;

      const generateCode = (discountPercent, expiryDate) => {
        let code = crypto.randomBytes(4).toString("hex").toUpperCase();
        code += Math.round(discountPercent * 100);
        code += expiryDate.toISOString().slice(0, 10).replace(/-/g, "");
        return code;
      };

      let expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      const newDiscount = new Discount({
        name,
        percentage,
        active,
        code: generateCode(percentage, expiryDate),
      });

      const newActivities = new Activities({
        description: `Successfully created a new discount ${name}`,
      });

      await newActivities.save();

      await newDiscount.save();

      res.json({
        msg: `Successfully created new discount ${name}`,
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  getSingleDiscount: async (req, res) => {
    try {
      const discount = await Discount.findById({ _id: req.params.id });
      if (!discount)
        return res.status(400).json({ msg: "discount does not exist" });

      res.json({
        status: "success",
        data: discount,
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  updateDiscount: async (req, res) => {
    try {
      const { name, percentage, active } = req.body;

      const getDiscount = await Discount.findById({ _id: req.params.id });
      if (!getDiscount)
        return res.status(400).json({ msg: "discount does not exist" });

      const generateCode = (discountPercent, expiryDate) => {
        let code = crypto.randomBytes(4).toString("hex").toUpperCase()
        code += Math.round(discountPercent * 100);
        code += expiryDate.toISOString().slice(0, 10).replace(/-/g, "");
        return code;
      };

      let expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      await Discount.findByIdAndUpdate(
        { _id: req.params.id },
        {
          name,
          percentage,
          active,
          code: generateCode(percentage, expiryDate),
        }
      );

      const newActivities = new Activities({
        description: `Successfully Update discount ${getDiscount.name}`,
      });

      await newActivities.save();

      res.json({ msg: `Successfully updated discount ${getDiscount.name}` });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  deleteDiscount: async (req, res) => {
    try {
      const getDiscount = await Discount.findById({ _id: req.params.id });
      if (!getDiscount)
        return res.status(400).json({ msg: "discount does not exist" });

      await Discount.findByIdAndDelete({ _id: req.params.id });

      const newActivities = new Activities({
        description: `Successfully deleted discount ${getDiscount.name}`,
      });

      await newActivities.save();

      res.json({
        msg: `Successfully deleted discount ${getDiscount.name}`,
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = discountCtrl;
