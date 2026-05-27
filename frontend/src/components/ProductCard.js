import React from 'react';
import './ProductCard.css';

function ProductCard({ product, addToCart }) {
  const placeholderImage =
    'https://via.placeholder.com/300x300?text=No+Image';

  return (
    <div className="product-card">
      <img
        src={product.image || placeholderImage}
        alt={product.name}
        className="product-image"
        onError={(e) => {
          e.target.src = placeholderImage;
        }}
      />

      <div className="product-info">
        <h3>{product.name}</h3>

        <p className="product-description">
          {product.description}
        </p>

        <p className="product-category">
          Category: {product.category}
        </p>

        <p className="product-brand">
          Brand: {product.brand}
        </p>

        <p className="product-stock">
          Stock: {product.stock}
        </p>

        <h2 className="product-price">
          ${product.price}
        </h2>
        <p className="product-rating">
          ⭐ {product.rating || 0}/5
        </p>

        <p className="product-sold">
          Sold: {product.sold || 0}
        </p>
        <button
          className="add-cart-btn"
          onClick={() => addToCart(product)}
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;