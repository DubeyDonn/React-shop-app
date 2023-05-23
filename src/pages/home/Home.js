import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../../core/components/navBar/Navbar";
import "./Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://my-shop-app-react-default-rtdb.firebaseio.com/products.json"
        );
        const fetchedProducts = [];
        for (const key in response.data) {
          fetchedProducts.push({
            id: key,
            ...response.data[key],
          });
        }

        setProducts(fetchedProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/view-product/${productId}`);
  };

  return (
    <>
      <NavBar />
      <div className="cart-container">
        <h2>Products</h2>
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <ul>
            {products.length === 0 ? (
              <div className="no-products">No products available.</div>
            ) : (
              <ul className="product-list">
                {products.map((product) => (
                  <li
                    key={product.id}
                    className="product-item"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <img
                      className="product-image"
                      src={product.imageUrl}
                      alt={product.title}
                    />
                    <div>
                      <h3>{product.title}</h3>
                      <p>{product.description}</p>
                      <p>Price: Rs. {product.price}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </ul>
        )}
      </div>
    </>
  );
};

export default Home;
