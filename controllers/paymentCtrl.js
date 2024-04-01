const Payments = require("../models/paymentModel");
const Users = require("../models/userModel");
const Movies = require("../models/movieModel");
const Season = require("../models/seasonModel");
const Episodes = require("../models/episodeModel");
const Discount = require("../models/dicountModel");
const Flutterwave = require("flutterwave-node-v3");
const moment = require("moment");
const flw = new Flutterwave(
  process.env.FLUTTERWAVE_PUB_KEY,
  process.env.FLUTTERWAVE_SECRET_KEY
);

const findItem = async (type, item) => {
  if (type === "Movies") {
    return await Movies.findById({ _id: item });
  }
  if (type === "Seasons") {
    return await Season.findById({ _id: item });
  }
  if (type === "Episodes") {
    return await Episodes.findById({ _id: item });
  }
};

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
      const searchTerm = req.query.title || "";
      const user = req.query.paidBy || "";
      const minPrice = req.query.minPrice || 0;
      const maxPrice = req.query.maxPrice || Number.MAX_VALUE;
      const startDate = req.query.startDate
        ? new Date(req.query.startDate)
        : new Date(1970, 0, 1);
      const endDate = req.query.endDate
        ? new Date(req.query.endDate)
        : new Date();
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;
      const orders = await Payments.find({
        price: { $gte: minPrice, $lte: maxPrice },
        createdAt: { $gte: startDate, $lte: endDate },
      })
        .populate([
          {
            path: "item",
            match: {
              $or: [
                { title: { $regex: searchTerm, $options: "i" } },
                { description: { $regex: searchTerm, $options: "i" } },
              ],
            },
          },
          {
            path: "user",
            select: "name id",
            match: { name: { $regex: user, $options: "i" } },
          },
        ])
        .skip(skip)
        .limit(limit);

      // const filteredOrders = orders.filter((order) => {
      //   return (
      //     (order.user && order.user.name.includes(searchTerm)) ||
      //     (order.item &&
      //       (order.item.description.includes(searchTerm) ||
      //         order.item.title.includes(searchTerm)))
      //   );
      // });
      const total = orders.length;

      res.json({
        status: "success",
        orders,
        currentPage: page,
        total,
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  createOrderFromWallet: async (req, res) => {
    try {
      const { item, item_type, paymentType, price } = req.body;
      const id = req.id;
      if (!item) res.status(400).json({ msg: "Payment was not successfull." });
      const content = await findItem(item_type, item);
      const user = await Users.findOne({ _id: id });
      if (!user)
        res.status(400).json({ msg: "Please login to verify yourself" });

      if (user.wallet < (price || content?.price))
        return res.status(400).json({ msg: "Insufficient Wallet ballance" });

      const deductBalance =
        price && paymentType === "donation"
          ? user.wallet - price
          : user.wallet - content?.price;

      await Users.findOneAndUpdate(
        { _id: id },
        { wallet: Number(deductBalance) }
      );
      const date = moment().add(-moment().utcOffset(), "minutes").toDate();
      const expirationDate = moment(date)
        .add(content?.expirationSpan, "days")
        .toDate();
      const newOrder = new Payments({
        user: id,
        item,
        paymentType,
        price: content?.price,
        expirationDate,
        validViews: content?.validViews,
        item_type,
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
        item,
        item_type,
        payment_id,
        paymentType,
        price,
        item_span,
        item_validViews,
        tx_ref,
      } = req.body;
      const id = req.id;
      if (!item && !payment_id && !paymentType && !price)
        res.status(404).json({ msg: "Payment was not succssfully." });
      const date = moment().add(-moment().utcOffset(), "minutes").toDate();
      const expirationDate = moment(date).add(item_span, "days").toDate();
      const response = await flw.Transaction.verify({ id: `${payment_id}` });
      if (
        response.data.status === "successful" &&
        tx_ref === response.data.tx_ref
      ) {
        const newOrder = new Payments({
          user: id,
          item,
          payment_id,
          paymentType,
          price,
          expirationDate,
          validViews: item_validViews,
          item_type,
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
      const { item, item_type, season } = req.body;
      const id = req.id;
      if (!item || !item_type)
        return res.status(400).json({ msg: "Bad request" });
      const date = moment().add(-moment().utcOffset(), "minutes").toDate();
      // const verify = await Payments.findOne({ user: id, item, item_type });
      const verify = season
        ? await Payments.findOne({
            user: id,
            $or: [{ item: item }, { item: season }],
            $or: [{ item_type }, { item_type: "Seasons" }],
            paymentType: { $ne: "donation" },
          })
        : await Payments.findOne({
            user: id,
            item,
            item_type,
            paymentType: { $ne: "donation" },
          });
      if (!verify?.item)
        return res.status(403).json({
          msg: "No payment has been made for this item",
          status: false,
        });
      if (
        verify?.item &&
        (verify.expirationDate <= new Date() || verify.validViews < 1)
      ) {
        return res.status(400).json({ msg: "item Expired", status: false });
      } else if (verify?.item) {
        res.status(200).json({
          msg: "Item verified with user purschase",
          verify: verify.item,
          status: true,
        });
      }
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
        msg: "Your wallet have been funded",
        user,
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  getUserOrders: async (req, res) => {
    try {
      // const { item } = req.body;
      const id = req.id;
      const orders = await Payments.find({
        user_id: id,
        paymentType: { $ne: "donation" },
      }).populate({ path: "item", select: "-video -episodes" });
      // const movies = await Movies.find({ item_id }).select("-video");
      // const season = await Season.find({ item_id }).select("-episodes");

      res.json({
        msg: "success",
        data: orders,
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  verifyDiscount: async (req, res) => {
    try {
      const { code } = req.body;
      if (!code)
        return res.status(400).json({ msg: "please provide coupon details" });
      const discount = await Discount.findOne({ name: code });
      // console.log(previousDocument, previousDocument.usage);
      await Discount.findOneAndUpdate(
        { name: code },
        { ...discount, usage: discount.usage + 1 }
      );
      if (discount)
        res.status(200).json({
          msg: "successfully verified discount",
          percentage: discount.percentage,
        });
      else {
        res.status(400).json({ msg: "invalid coupon code" });
      }
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = paymentCtrl;
