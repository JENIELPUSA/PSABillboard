const mongoose = require("mongoose");

const VideoPosterSchema = new mongoose.Schema(
  {
    // ==========================================
    // CONTENT TYPE
    // ==========================================
    type: {
      type: String,
      enum: ["Poster", "Video"],
      required: true,
    },

    // ==========================================
    // TITLE
    // ==========================================
    title: {
      type: String,
      trim: true,
      default: "",
    },

    // ==========================================
    // MEDIA URL
    // ==========================================
    mediaUrl: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // DATE TO SHOW
    // ==========================================
    showDate: {
      type: Date,
      required: true,
    },

    // ==========================================
    // POSTER SETTINGS
    // ==========================================
    poster: {
      // Ilang seconds ipapakita ang poster
      timeToShow: {
        type: Number,
        default: 5,
        min: 1,
      },
    },

    // ==========================================
    // VIDEO SETTINGS
    // ==========================================
    video: {
      // Oras kung kailan ipapakita ang video
      // Format: HH:mm
      showTime: {
        type: String,
        default: "08:00",
        match: /^([01]\d|2[0-3]):([0-5]\d)$/,
      },

      // Oras kung kailan automatic mag-exit
      // Format: HH:mm
      exitTime: {
        type: String,
        default: "17:00",
        match: /^([01]\d|2[0-3]):([0-5]\d)$/,
      },

      // Ilang seconds bago automatic magsara
      timeToShow: {
        type: Number,
        default: 30,
        min: 1,
      },
    },

    // ==========================================
    // ACTIVE STATUS
    // ==========================================
    isActive: {
      type: Boolean,
      default: true,
    },

    // ==========================================
    // DISPLAY ORDER
    // ==========================================
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "VideoPoster",
  VideoPosterSchema
);

