const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(

  {

    user: {
      type:
        mongoose.Schema.Types.ObjectId,

      ref: 'User',

      required: true,
    },

    orderItems: [

      {

        product: {
          type:
            mongoose.Schema.Types.ObjectId,

          ref: 'Product',

          required: true,
        },

        name: {
          type: String,
          required: true,
        },

        image: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        qty: {
          type: Number,
          required: true,
        },

      },

    ],

    shippingInfo: {

      fullName: {
        type: String,
        required: true,
      },

      address: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

    },

    paymentMethod: {
      type: String,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: Date,

    paymentResult: {
      id: String,
      status: String,
      email_address: String,
    },

    isDelivered: {
      type: Boolean,
      default: false,
    },

    deliveredAt: Date,

  },

  {

    timestamps: true,

  }

);

module.exports =
  mongoose.model(
    'Order',
    orderSchema
  );