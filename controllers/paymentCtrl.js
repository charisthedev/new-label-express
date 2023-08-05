const Payments = require("../models/paymentModel");
const Users = require("../models/userModel");
const Movies = require("../models/movieModel");
const Season = require("../models/seasonModel");
const Flutterwave = require("flutterwave-node-v3");
const moment = require("moment");
const flw = new Flutterwave(
  process.env.FLUTTERWAVE_PUB_KEY,
  process.env.FLUTTERWAVE_SECRET_KEY
);

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

const paymentCtrl = {
  getOrders: async (req, res) => {
    try {
      const features = new APIfeatures(Payments.find(), req.query)
        .filtering()
        .sorting()
        .paginating();

      const orders = await features.query;

      res.json({
        status: "success",
        result: orders.length,
        orders: orders,
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  createOrderFromWallet: async (req, res) => {
    try {
      const { item_id, paymentType, price, item_span, item_validViews } =
        req.body;
      const id = req.id;
      if (!item_id && !paymentType && !price)
        res.status(400).json({ msg: "Payment was not successfull." });

      const user = await Users.findOne({ _id: id });
      if (!user)
        res.status(400).json({ msg: "Please login to verify yourself" });

      if (user.wallet < price)
        return res.status(400).json({ msg: "Insufficient Wallet ballance" });

      const deductBalance = user.wallet - price;

      await Users.findOneAndUpdate({ _id: id }, { wallet: deductBalance });
      const date = moment().add(-moment().utcOffset(), "minutes").toDate();
      const expirationDate = moment(date).add(item_span, "days").toDate();
      const newOrder = new Payments({
        user_id: id,
        item_id,
        paymentType,
        price,
        expirationDate,
        validViews: item_validViews,
      });

      await newOrder.save();

      res.status(200).json({
        msg: "Order created successfully ",
        success: true,
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  createOrderFromCard: async (req, res) => {
    try {
      const {
        item_id,
        payment_id,
        paymentType,
        price,
        item_span,
        item_validViews,
        tx_ref,
      } = req.body;
      const id = req.id;
      if (!item_id && !payment_id && !paymentType && !price)
        res.status(404).json({ msg: "Payment was not succssfully." });
      const date = moment().add(-moment().utcOffset(), "minutes").toDate();
      const expirationDate = moment(date).add(item_span, "days").toDate();
      const response = await flw.Transaction.verify({ id: `${payment_id}` });
      if (
        response.data.status === "successful" &&
        tx_ref === response.data.tx_ref
      ) {
        const newOrder = new Payments({
          user_id: id,
          item_id,
          payment_id,
          paymentType,
          price,
          expirationDate,
          validViews: item_validViews,
        });

        await newOrder.save();
      }
      res.json({
        msg: "card payment successfully.",
        verified: response.status,
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  verifyItemPurchase: async (req, res) => {
    try {
      const { item_id, season } = req.body;
      const id = req.id;
      if (!item_id) return res.status(404).json({ msg: "wrong credentials" });
      const date = moment().add(-moment().utcOffset(), "minutes").toDate();
      if (season) {
        const verify = await Payments.findOne({
          user_id: id,
          item_id: season,
        });
        if (verify) {
          if (
            moment(verify.expirationDate).isSameOrBefore(moment(date)) ||
            verify.validViews < 1
          ) {
            return res.status(403).json({ msg: "item Expired", status: false });
          }
          return res.status(200).json({
            msg: "Item verified with user purschase",
            verify: verify.item_id,
            status: true,
          });
        }
      }

      const verify = await Payments.findOne({ user_id: id, item_id });
      if (!verify)
        return res.status(403).json({
          msg: "No payment has been made for this item",
          status: false,
        });
      if (
        moment(verify.expirationDate).isSameOrBefore(moment(date)) ||
        verify.validViews < 1
      )
        return res.status(400).json({ msg: "item Expired", status: false });

      return res.status(200).json({
        msg: "Item verified with user purschase",
        verify: verify.item_id,
        status: true,
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  topUpWallet: async (req, res) => {
    try {
      const { payment_id, paymentType, price, tx_ref } = req.body;
      const id = req.id;
      if (!payment_id || !price)
        return res.status(400).json({ msg: "payload not properly passed" });

      const user = await Users.findOne({ _id: id });
      if (!user) return res.status(404).json({ msg: "invalid user" });
      const response = await flw.Transaction.verify({ id: `${payment_id}` });
      if (
        response.data.status === "successful" &&
        tx_ref === response.data.tx_ref
      ) {
        const addToWallet = user.wallet + price;
        await Users.findOneAndUpdate({ _id: id }, { wallet: addToWallet });
      }
      const newTopup = new Payments({
        user_id: id,
        payment_id,
        paymentType,
        price,
      });

      await newTopup.save();

      res.json({
        msg: "Your wallet has been funded",
        user,
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  getUserOrders: async (req, res) => {
    try {
      const { item_id } = req.body;
      const id = req.id;
      const orders = await Payments.find({ user_id: id, item_id }).populate(
        "item_id"
      );
      const movies = await Movies.find({ item_id }).select("-video");
      const season = await Season.find({ item_id }).select("-episodes");

      const combined = movies.concat(series);

      res.json({
        userOrders: combined,
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = paymentCtrl;
