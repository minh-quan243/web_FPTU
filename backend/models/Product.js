const mongoose = require('mongoose');


// =========================
// REVIEW SCHEMA
// =========================
const reviewSchema =
  new mongoose.Schema({

    user: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: 'User',

      required: true
    },

    name: {

      type: String,

      required: true
    },

    rating: {

      type: Number,

      required: true,

      min: 1,

      max: 5
    },

    comment: {

      type: String,

      required: true
    }

  }, {

    timestamps: true
  });


// =========================
// PRODUCT SCHEMA
// =========================
const productSchema =
  new mongoose.Schema({

    // PRODUCT NAME
    name: {

      type: String,

      required: true,

      trim: true
    },

    // DESCRIPTION
    description: {

      type: String,

      default: ''
    },

    // PRICE
    price: {

      type: Number,

      required: true,

      min: 0
    },

    // PRODUCT IMAGE
    image: {

      type: String,

      default: ''
    },

    // STOCK
    stock: {

      type: Number,

      default: 0,

      min: 0
    },

    // CATEGORY
    category: {

      type: String,

      default: ''
    },

    // BRAND
    brand: {

      type: String,

      default: ''
    },

    // AVERAGE RATING
    rating: {

      type: Number,

      default: 0
    },

    // TOTAL REVIEWS
    numReviews: {

      type: Number,

      default: 0
    },

    // SOLD COUNT
    sold: {

      type: Number,

      default: 0
    },

    // REVIEWS
    reviews: [

      reviewSchema
    ]

  }, {

    timestamps: true
  });

module.exports =
  mongoose.model(

    'Product',

    productSchema
  );