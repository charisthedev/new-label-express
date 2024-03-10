const ContinueWatching = require("../models/continueWatchingModel");

const ContinueWatchingCtrl = {
  getLastWatchedContents: async (req, res) => {
    try {
      const id = req.id;
      const lastContent = await ContinueWatching.find({ userId: id })
        .sort({ timestamp: -1 })
        .populate({
          path: "item",
          select: "-video -category",
        })
        .limit(10);
      if (!lastContent)
        return res
          .status(201)
          .json({ msg: "No last watched content for this user" });

      res.status(200).json({
        data: lastContent,
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  createLastWatchedContents: async (req, res) => {
    try {
      const { item_type, item } = req.body;
      const id = req.id;

      const checkLastWatchedContent = await ContinueWatching.findOne({
        item,
        userId: id,
      });
      if (checkLastWatchedContent) {
        await ContinueWatching.findByIdAndUpdate(
          { _id: checkLastWatchedContent._id },
          { timestamp: new Date() }
        );
        return res.status(200).json({ msg: "last watched updated" });
      } else {
        await ContinueWatching.create({
          userId: id,
          item_type,
          item,
          timestamp: new Date(),
        });
        return res.status(200).json({ msg: "updated last watched" });
      }
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = ContinueWatchingCtrl;
