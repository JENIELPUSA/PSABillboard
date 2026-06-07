const mongoose = require("mongoose");

const QMScornerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    googleLink: [
      {
        type: String,
        required: [true, "Google Link is required"],
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("QmsCorner", QMScornerSchema);