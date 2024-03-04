const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
  {
    permission: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Permissions", permissionSchema);
