const Rate = require("../models/rateModel");
const Activities = require("../models/activityModel");

const rateCtrl = {
  createRate: async (req, res) => {
    try {
      const { currency, value } = req.body;
      if (!currency)
        return res.status(400).json({ msg: "please include currency code" });
      const rate = await Rate.findOne({ currency });
      if (rate) return res.status(400).json({ msg: "currency rate already exists" });

      const newRate = new Rate({
        currency,
        rate:value
      });

      await newRate.save();
      res.status(200).json({ msg: "rate created successfully" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  updateRate: async (req, res) => {
    try {
      const { value } = req.body;

      const rate = await Rate.findByIdAndUpdate(
        { _id: req.params.id },
        {
          rate:value,
        }
      );

      if (!rate) return res.status(400).json({ msg: "data not found" });

      const newActivities = new Activities({
        description: `Successfully updated ${rate.currency} rate`,
        userId: req.id,
      });

      await newActivities.save();

      res.json({ msg: `Updated ${rate.currency} rate` });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  getRates: async (req, res) => {
    try {
      const rates = await Rate.find();

      res.json(rates);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  getRate: async (req, res) => {
    try {
      const rate = await Rate.findById(req.params.id);

      res.json(rate);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  deleteRate: async (req, res) => {
    try {
      const rate = await Rate.findByIdAndDelete({
        _id: req.params.id,
      });
      const newActivities = new Activities({
        description: `Successfully deleted ${rate.currency} currency`,
        userId: req.id,
      });

      await newActivities.save();

      res.json(rate);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = rateCtrl;
