import {
  useEffect,
  useState,
  useMemo,
  useCallback
} from 'react';

import debounce from 'lodash.debounce';

import { Link } from 'react-router-dom';

import ProductCard from '../components/ProductCard';

import './Home.css';

const API_URL =
  process.env.REACT_APP_API_URL ||
  'http://localhost:5000';

function Home() {

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [search, setSearch] =
    useState('');

  // PAGINATION
  const [page, setPage] =
    useState(1);

  const [pages, setPages] =
    useState(1);

  // SORTING
  const [sort, setSort] =
    useState('-createdAt');

  // FETCH PRODUCTS
  const fetchProducts =
    useCallback(

      async (keyword = '') => {

        try {

          setLoading(true);

          setError('');

          const res = await fetch(

            `${API_URL}/products?keyword=${encodeURIComponent(
              keyword
            )}&page=${page}&limit=8&sort=${sort}`
          );

          if (!res.ok) {

            throw new Error(
              'Failed to fetch products'
            );
          }

          const data =
            await res.json();

          setProducts(
            data.products
          );

          setPages(
            data.pages
          );

        } catch (err) {

          setError(

            err.message ||

            'Something went wrong'
          );

        } finally {

          setLoading(false);
        }
      },

      [page, sort]
    );

  // DEBOUNCE SEARCH
  const debouncedFetch =
    useMemo(() => {

      return debounce((value) => {

        fetchProducts(value);

      }, 500);

    }, [fetchProducts]);

  // FETCH EFFECT
  useEffect(() => {

    debouncedFetch(search);

    return () => {

      debouncedFetch.cancel();
    };

  }, [
    search,
    debouncedFetch
  ]);

  // ADD TO CART
  const addToCart = (product) => {

    const cart = JSON.parse(

      localStorage.getItem('cart')

    ) || [];

    const existingProduct =
      cart.find(

        (item) =>
          item._id === product._id
      );

    let updatedCart;

    if (existingProduct) {

      updatedCart = cart.map(

        (item) =>

          item._id === product._id

            ? {

                ...item,

                quantity:
                  item.quantity + 1
              }

            : item
      );

    } else {

      updatedCart = [

        ...cart,

        {

          ...product,

          quantity: 1
        }
      ];
    }

    localStorage.setItem(

      'cart',

      JSON.stringify(updatedCart)
    );

    alert('Added to cart 🛒');
  };

  return (

    <div className="home">

      <h1 className="title">

        🛒 My Shop

      </h1>

      {/* SEARCH */}

      <input
        type="text"
        placeholder="Search products..."
        className="search-input"
        value={search}
        onChange={(e) => {

          setSearch(
            e.target.value
          );

          setPage(1);
        }}
      />

      {/* SORT */}

      <select
        className="sort-select"
        value={sort}
        onChange={(e) => {

          setSort(
            e.target.value
          );

          setPage(1);
        }}
      >

        <option value="-createdAt">

          Newest

        </option>

        <option value="price">

          Price: Low to High

        </option>

        <option value="-price">

          Price: High to Low

        </option>

        <option value="-rating">

          Top Rated

        </option>

      </select>

      {/* LOADING */}

      {loading && (

        <h2 className="status">

          Loading...

        </h2>
      )}

      {/* ERROR */}

      {error && (

        <h2 className="status error">

          {error}

        </h2>
      )}

      {/* EMPTY */}

      {!loading &&
        !error &&
        products.length === 0 && (

          <h2 className="status">

            No products found

          </h2>
      )}

      {/* PRODUCTS */}

      <div className="product-grid">

        {products.map((product) => (

          <div
            key={product._id}
            className="product-wrapper"
          >

            <Link

              to={`/product/${product._id}`}

              className="product-link"
            >

              <ProductCard

                product={product}

                addToCart={addToCart}

              />

            </Link>

          </div>

        ))}

      </div>

      {/* PAGINATION */}

      <div className="pagination">

        <button

          disabled={page === 1}

          onClick={() =>
            setPage(page - 1)
          }
        >

          Prev

        </button>

        {[...Array(pages).keys()].map(

          (x) => (

            <button

              key={x + 1}

              className={
                page === x + 1
                  ? 'active-page'
                  : ''
              }

              onClick={() =>
                setPage(x + 1)
              }
            >

              {x + 1}

            </button>
          )
        )}

        <button

          disabled={page === pages}

          onClick={() =>
            setPage(page + 1)
          }
        >

          Next

        </button>

      </div>

    </div>
  );
}

export default Home;