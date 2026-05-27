const express = require('express');

const router = express.Router();

const Product = require('../models/Product');

const auth = require('../middleware/auth');

const adminOnly =
  require('../middleware/admin');

const upload =
  require('../middleware/upload');


// =========================
// GET ALL PRODUCTS
// =========================
router.get('/products', async (req, res) => {

  try {

    // =========================
    // SEARCH KEYWORD
    // =========================
    const keyword =
      req.query.keyword
        ? {
            name: {
              $regex:
                req.query.keyword,

              $options: 'i'
            }
          }
        : {};

    // =========================
    // CATEGORY FILTER
    // =========================
    const category =
      req.query.category
        ? {
            category:
              req.query.category
          }
        : {};

    // =========================
    // COMBINE FILTERS
    // =========================
    const filters = {

      ...keyword,

      ...category
    };

    // =========================
    // PAGINATION
    // =========================
    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 8;

    const skip =
      (page - 1) * limit;

    // =========================
    // SORTING
    // =========================
    const sort =
      req.query.sort || '-createdAt';

    // =========================
    // TOTAL PRODUCTS
    // =========================
    const total =
      await Product.countDocuments(
        filters
      );

    // =========================
    // FIND PRODUCTS
    // =========================
    const products =
      await Product.find(filters)

        .sort(sort)

        .skip(skip)

        .limit(limit);

    // =========================
    // RESPONSE
    // =========================
    res.json({

      products,

      page,

      pages: Math.ceil(
        total / limit
      ),

      total
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      message: 'Server error'
    });
  }
});


// =========================
// GET SINGLE PRODUCT
// =========================
router.get('/products/:id', async (req, res) => {

  try {

    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {

      return res.status(404).json({
        message: 'Product not found'
      });
    }

    res.json(product);

  } catch (err) {

    res.status(500).json({
      message: 'Server error'
    });
  }
});


// =========================
// CREATE PRODUCT (ADMIN)
// =========================
router.post(
  '/products',

  auth,
  adminOnly,

  upload.single('image'),

  async (req, res) => {

    try {

      const product =
        new Product({

          name:
            req.body.name,

          description:
            req.body.description,

          price:
            req.body.price,

          stock:
            req.body.stock || 0,

          category:
            req.body.category,

          brand:
            req.body.brand,

          rating:
            req.body.rating || 0,

          sold:
            req.body.sold || 0,

          image: req.file
            ? `http://localhost:5000/uploads/${req.file.filename}`
            : ''
        });

      await product.save();

      res.json(product);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: 'Server error'
      });
    }
  }
);


// =========================
// UPDATE PRODUCT (ADMIN)
// =========================
router.put(
  '/products/:id',

  auth,
  adminOnly,

  upload.single('image'),

  async (req, res) => {

    try {

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {

        return res.status(404).json({
          message: 'Product not found'
        });
      }

      // UPDATE FIELDS
      product.name =
        req.body.name ||
        product.name;

      product.description =
        req.body.description ||
        product.description;

      product.price =
        req.body.price ||
        product.price;

      product.stock =
        req.body.stock ||
        product.stock;

      product.category =
        req.body.category ||
        product.category;

      product.brand =
        req.body.brand ||
        product.brand;

      product.rating =
        req.body.rating ||
        product.rating;

      product.sold =
        req.body.sold ||
        product.sold;

      // UPDATE IMAGE
      if (req.file) {

        product.image =
          `http://localhost:5000/uploads/${req.file.filename}`;
      }

      const updatedProduct =
        await product.save();

      res.json(updatedProduct);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: 'Server error'
      });
    }
  }
);


// =========================
// DELETE PRODUCT (ADMIN)
// =========================
router.delete(
  '/products/:id',

  auth,
  adminOnly,

  async (req, res) => {

    try {

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {

        return res.status(404).json({
          message: 'Product not found'
        });
      }

      await product.deleteOne();

      res.json({
        message: 'Product deleted'
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: 'Server error'
      });
    }
  }
);

// =========================
// CREATE PRODUCT REVIEW
// =========================
router.post(

  '/products/:id/reviews',

  auth,

  async (req, res) => {

    try {

      const {

        rating,

        comment

      } = req.body;

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {

        return res.status(404).json({

          message:
            'Product not found'
        });
      }

      // CHECK EXISTING REVIEW
      const alreadyReviewed =
        product.reviews.find(

          (review) =>

            review.user.toString() ===
            req.user.id
        );

      if (alreadyReviewed) {

        return res.status(400).json({

          message:
            'Product already reviewed'
        });
      }

      // CREATE REVIEW
      const review = {

        user:
          req.user.id,

        name:
          req.user.name,

        rating:
          Number(rating),

        comment
      };

      // PUSH REVIEW
      product.reviews.push(
        review
      );

      // UPDATE REVIEW COUNT
      product.numReviews =
        product.reviews.length;

      // UPDATE AVERAGE RATING
      product.rating =

        product.reviews.reduce(

          (acc, item) =>

            item.rating + acc,

          0

        ) /

        product.reviews.length;

      await product.save();

      res.status(201).json({

        message:
          'Review added'
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        message:
          'Server error'
      });
    }
  }
);

module.exports = router;