import {
  useEffect,
  useState,
  useCallback
} from 'react';

import {
  useParams
} from 'react-router-dom';

import axios from '../utils/axiosInstance';

import './ProductDetails.css';

function ProductDetails() {

  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');

  // =========================
  // FETCH PRODUCT (FIXED)
  // =========================
  const fetchProduct = useCallback(async () => {

    try {

      const res = await axios.get(
        `/products/${id}`
      );

      setProduct(res.data);

    } catch (err) {

      console.log(err);
    }

  }, [id]);

  useEffect(() => {

    fetchProduct();

  }, [fetchProduct]);

  // =========================
  // ADD TO CART
  // =========================
  const handleAddToCart = () => {

    const cart =
      JSON.parse(localStorage.getItem('cart')) || [];

    const existingItem = cart.find(
      (item) => item._id === product._id
    );

    if (existingItem) {

      existingItem.qty += qty;

    } else {

      cart.push({
        ...product,
        qty
      });
    }

    localStorage.setItem(
      'cart',
      JSON.stringify(cart)
    );

    alert('Added to cart 🛒');
  };

  // =========================
  // SUBMIT REVIEW
  // =========================
  const submitReview = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        `/products/${id}/reviews`,
        {
          rating,
          comment
        }
      );

      setReviewMessage('Review added ✅');
      setComment('');
      setRating(5);

      fetchProduct();

    } catch (err) {

      setReviewMessage(
        err.response?.data?.message ||
        'Review failed'
      );
    }
  };

  if (!product) {

    return (
      <div className="product-details">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (

    <div className="product-details">

      {/* IMAGE */}
      <div className="details-image">
        <img
          src={product.image}
          alt={product.name}
        />
      </div>

      {/* INFO */}
      <div className="details-info">

        <h1>{product.name}</h1>

        <p className="price">
          ${product.price}
        </p>

        <p>{product.description}</p>

        <p>
          <strong>Category:</strong> {product.category}
        </p>

        <p>
          <strong>Brand:</strong> {product.brand}
        </p>

        <p>
          <strong>Stock:</strong> {product.stock}
        </p>

        <p>
          ⭐ {product.rating?.toFixed(1)}/5 ({product.numReviews})
        </p>

        <p>
          📦 Sold: {product.sold}
        </p>

        {/* QUANTITY */}
        <div className="qty-box">

          <label>Qty:</label>

          <input
            type="number"
            min="1"
            max={product.stock}
            value={qty}
            onChange={(e) =>
              setQty(Number(e.target.value))
            }
          />

        </div>

        {/* ADD TO CART */}
        <button
          className="add-cart-btn"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          {product.stock > 0
            ? 'Add To Cart'
            : 'Out Of Stock'}
        </button>

      </div>

      {/* REVIEWS */}
      <div className="reviews-section">

        <h2>Reviews</h2>

        {product.reviews?.length === 0 && (
          <p>No reviews yet</p>
        )}

        {product.reviews?.map((review) => (
          <div
            key={review._id}
            className="review-card"
          >
            <h4>{review.name}</h4>
            <p>⭐ {review.rating}/5</p>
            <p>{review.comment}</p>
          </div>
        ))}

        {/* REVIEW FORM */}
        <form
          className="review-form"
          onSubmit={submitReview}
        >

          <h3>Write a Review</h3>

          {reviewMessage && (
            <p className="review-message">
              {reviewMessage}
            </p>
          )}

          <select
            value={rating}
            onChange={(e) =>
              setRating(Number(e.target.value))
            }
          >
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Average</option>
            <option value="2">2 - Bad</option>
            <option value="1">1 - Terrible</option>
          </select>

          <textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />

          <button type="submit">
            Submit Review
          </button>

        </form>

      </div>

    </div>
  );
}

export default ProductDetails;