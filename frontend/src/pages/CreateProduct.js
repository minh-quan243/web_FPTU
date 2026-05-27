import './CreateProduct.css';

import { useEffect, useState } from 'react';

import axios from '../utils/axiosInstance';

function CreateProduct() {

  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({

    name: '',

    price: '',

    description: '',

    category: '',

    brand: '',

    stock: '',

    rating: '',

    sold: ''

  });

  const [image, setImage] = useState(null);

  const [editingId, setEditingId] =
    useState(null);

  const [message, setMessage] =
    useState('');

  // LOAD PRODUCTS
  useEffect(() => {

    fetchProducts();

  }, []);

  const fetchProducts = async () => {

    try {

      const res =
        await axios.get('/products');

      setProducts(res.data);

    } catch (err) {

      console.log(err);

    }
  };

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    });
  };

  // CREATE / UPDATE
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const data = new FormData();

      Object.keys(formData).forEach((key) => {

        data.append(key, formData[key]);

      });

      if (image) {

        data.append('image', image);

      }

      // UPDATE
      if (editingId) {

        await axios.put(

          `/products/${editingId}`,

          data
        );

        setMessage(
          '✅ Product updated'
        );

      } else {

        // CREATE
        await axios.post(

          '/products',

          data
        );

        setMessage(
          '✅ Product added'
        );
      }

      // RESET
      setFormData({

        name: '',

        price: '',

        description: '',

        category: '',

        brand: '',

        stock: '',

        rating: '',

        sold: ''

      });

      setImage(null);

      setEditingId(null);

      fetchProducts();

    } catch (err) {

      console.log(err);

      setMessage(
        '❌ Something went wrong'
      );
    }
  };

  // DELETE
  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        'Delete product?'
      );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `/products/${id}`
      );

      setMessage(
        '✅ Product deleted'
      );

      fetchProducts();

    } catch (err) {

      console.log(err);

      setMessage(
        '❌ Delete failed'
      );
    }
  };

  // EDIT
  const handleEdit = (product) => {

    setEditingId(product._id);

    setFormData({

      name: product.name || '',

      price: product.price || '',

      description:
        product.description || '',

      category:
        product.category || '',

      brand:
        product.brand || '',

      stock:
        product.stock || '',

      rating:
        product.rating || '',

      sold:
        product.sold || ''

    });

    setImage(null);

    window.scrollTo({

      top: 0,

      behavior: 'smooth'

    });
  };

  return (

    <div className="create-product-page">

      <h1>

        {editingId
          ? 'Edit Product'
          : 'Create Product'}

      </h1>

      {message && (

        <p className="message">

          {message}

        </p>

      )}

      {/* FORM */}

      <form
        className="product-form"
        onSubmit={handleSubmit}
      >

        <input
          type="text"
          name="name"
          placeholder="Product name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
        />

        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={formData.brand}
          onChange={handleChange}
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
        />

        <input
          type="number"
          name="rating"
          placeholder="Rating"
          value={formData.rating}
          onChange={handleChange}
        />

        <input
          type="number"
          name="sold"
          placeholder="Sold"
          value={formData.sold}
          onChange={handleChange}
        />

        {/* IMAGE */}

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setImage(
              e.target.files[0]
            )
          }
        />

        <button type="submit">

          {editingId
            ? 'Update Product'
            : 'Add Product'}

        </button>

      </form>

      {/* PRODUCTS */}

      <div className="product-grid">

        {products.map((product) => (

          <div
            key={product._id}
            className="product-card"
          >

            <img
              src={
                product.image ||
                'https://via.placeholder.com/300'
              }
              alt={product.name}
            />

            <h3>{product.name}</h3>

            <p>{product.description}</p>

            <span>
              ${product.price}
            </span>

            <div className="product-actions">

              <button
                className="edit-btn"
                onClick={() =>
                  handleEdit(product)
                }
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() =>
                  handleDelete(
                    product._id
                  )
                }
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default CreateProduct;