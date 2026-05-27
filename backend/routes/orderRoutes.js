const express = require('express');

const router = express.Router();

const Order =
  require('../models/Order');

const Product =
  require('../models/Product');

const auth =
  require('../middleware/auth');

const adminOnly =
  require('../middleware/admin');


// CREATE ORDER
router.post(
  '/',
  auth,
  async (req, res) => {

    try {

      const {

        orderItems,

        shippingInfo,

        paymentMethod,

        totalPrice,

      } = req.body;

      // VALIDATE
      if (
        !orderItems ||
        orderItems.length === 0
      ) {

        return res.status(400).json({
          message: 'No order items',
        });

      }

      // CHECK STOCK
      for (const item of orderItems) {

        const product =
          await Product.findById(
            item.product
          );

        if (!product) {

          return res.status(404).json({
            message:
              `Product not found`,
          });

        }

        if (product.stock < item.qty) {

          return res.status(400).json({
            message:
              `Not enough stock for ${product.name}`,
          });

        }

      }

      // CREATE ORDER
      const order = new Order({

        user: req.user.id,

        orderItems,

        shippingInfo,

        paymentMethod,

        totalPrice,

      });

      const createdOrder =
        await order.save();

      // UPDATE STOCK + SOLD
      for (const item of orderItems) {

        const product =
          await Product.findById(
            item.product
          );

        product.stock -= item.qty;

        product.sold += item.qty;

        await product.save();

      }

      res.status(201).json(
        createdOrder
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: error.message,
      });

    }

  }
);


// GET MY ORDERS
router.get(
  '/my',
  auth,
  async (req, res) => {

    try {

      const orders =
        await Order.find({

          user: req.user.id,

        }).sort({

          createdAt: -1,

        });

      res.json(orders);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }

  }
);


// ADMIN GET ALL ORDERS
router.get(
  '/',
  auth,
  adminOnly,
  async (req, res) => {

    try {

      const orders =
        await Order.find({})

          .populate(
            'user',
            'name email'
          )

          .sort({
            createdAt: -1,
          });

      res.json(orders);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }

  }
);


// MARK AS DELIVERED
router.put(
  '/:id/deliver',
  auth,
  adminOnly,
  async (req, res) => {

    try {

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {

        return res.status(404).json({
          message:
            'Order not found',
        });

      }

      order.isDelivered = true;

      order.deliveredAt =
        Date.now();

      const updatedOrder =
        await order.save();

      res.json(updatedOrder);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }

  }
);

module.exports = router;