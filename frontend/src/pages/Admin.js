import './Admin.css';
import { useEffect, useState } from 'react';

function Admin() {

  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  // IMAGE FILE
  const [image, setImage] = useState(null);

  const [description, setDescription] = useState("");

  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");

  const [rating, setRating] = useState("");
  const [sold, setSold] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [message, setMessage] = useState("");

  // =========================
  // LOAD PRODUCTS
  // =========================
  useEffect(() => {

    fetchProducts();

  }, []);

  const fetchProducts = () => {

    fetch('http://localhost:5000/products')

      .then(res => res.json())

      .then(data => setProducts(data))

      .catch(err => console.log(err));
  };

  // =========================
  // ADD / UPDATE PRODUCT
  // =========================
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const token =
        localStorage.getItem('token');

      // FORM DATA
      const formData = new FormData();

      formData.append('name', name);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('brand', brand);
      formData.append('stock', stock);
      formData.append('rating', rating);
      formData.append('sold', sold);

      // IMAGE FILE
      if (image) {

        formData.append('image', image);
      }

      // =========================
      // UPDATE
      // =========================
      if (editingId) {

        const res = await fetch(

          `http://localhost:5000/products/${editingId}`,

          {
            method: 'PUT',

            headers: {
              Authorization:
                `Bearer ${token}`
            },

            body: formData
          }
        );

        if (!res.ok) {

          throw new Error(
            'Update failed'
          );
        }

        setMessage(
          '✅ Product updated'
        );

        setEditingId(null);

      } else {

        // =========================
        // CREATE
        // =========================
        const res = await fetch(

          'http://localhost:5000/products',

          {
            method: 'POST',

            headers: {
              Authorization:
                `Bearer ${token}`
            },

            body: formData
          }
        );

        if (!res.ok) {

          throw new Error(
            'Add product failed'
          );
        }

        setMessage(
          '✅ Product added'
        );
      }

      // =========================
      // RESET FORM
      // =========================
      setName("");
      setPrice("");
      setImage(null);
      setDescription("");
      setCategory("");
      setBrand("");
      setStock("");
      setRating("");
      setSold("");

      fetchProducts();

    } catch (err) {

      setMessage(
        '❌ ' + err.message
      );
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================
  const handleDelete = async (id) => {

    if (!window.confirm(
      'Delete product?'
    )) return;

    try {

      const token =
        localStorage.getItem('token');

      const res = await fetch(

        `http://localhost:5000/products/${id}`,

        {
          method: 'DELETE',

          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      if (!res.ok) {

        throw new Error(
          'Delete failed'
        );
      }

      setMessage(
        '✅ Product deleted'
      );

      fetchProducts();

    } catch (err) {

      setMessage(
        '❌ ' + err.message
      );
    }
  };

  // =========================
  // EDIT PRODUCT
  // =========================
  const handleEdit = (product) => {

    setEditingId(product._id);

    setName(product.name || "");
    setPrice(product.price || "");

    // RESET FILE INPUT
    setImage(null);

    setDescription(
      product.description || ""
    );

    setCategory(
      product.category || ""
    );

    setBrand(
      product.brand || ""
    );

    setStock(
      product.stock ?? 0
    );

    setRating(
      product.rating ?? 0
    );

    setSold(
      product.sold ?? 0
    );
  };

  return (

    <div className="admin-page">

      <h1 className="admin-title">
        ⚡ Admin Dashboard
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
          placeholder="Product name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
          required
        />

        {/* FILE INPUT */}
        <input
          type="file"

          accept="image/*"

          onChange={(e) =>
            setImage(e.target.files[0])
          }
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }
        />

        <input
          type="text"
          placeholder="Brand"
          value={brand}
          onChange={(e) =>
            setBrand(
              e.target.value
            )
          }
        />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) =>
            setStock(
              e.target.value
            )
          }
        />

        <input
          type="number"
          placeholder="Rating (0-5)"
          value={rating}
          onChange={(e) =>
            setRating(
              e.target.value
            )
          }
        />

        <input
          type="number"
          placeholder="Sold"
          value={sold}
          onChange={(e) =>
            setSold(
              e.target.value
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
      <div className="admin-grid">

        {products.map(product => (

          <div
            className="admin-card"
            key={product._id}
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

            <p>
              Category:
              {product.category}
            </p>

            <p>
              Brand:
              {product.brand}
            </p>

            <p>
              Stock:
              {product.stock}
            </p>

            <p>
              ⭐ {product.rating ?? 0}/5
            </p>

            <p>
              📦 Sold:
              {product.sold ?? 0}
            </p>

            <span>
              ${product.price}
            </span>

            <div className="admin-actions">

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
                  handleDelete(product._id)
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

export default Admin;