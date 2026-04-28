const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    companyIcon: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    legalDocument: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    companyImages: {
      type: [String],
      validate: [
        {
          validator: function (arr) {
            return arr.length >= 2;
          },
          message: "Minimum 2 images required",
        },
        {
          validator: function (arr) {
            return arr.length <= 5;
          },
          message: "Maximum 5 images allowed",
        },
      ],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Company", companySchema);
