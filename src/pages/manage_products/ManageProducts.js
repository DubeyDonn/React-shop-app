import NavBar from "../../core/components/navBar/Navbar";
import React, { useState, useEffect } from "react";

import { NavLink } from "react-router-dom";
import axios from "axios";
import "./ManageProduct.css";
import { useNavigate } from "react-router-dom";

const Manageproducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://my-shop-app-react-default-rtdb.firebaseio.com/products.json"
      );
      const productsData = response.data ? Object.entries(response.data) : [];
      console.log(productsData);
      const productsList = productsData.map(([productId, productData]) => ({
        id: productId,
        ...productData,
      }));
      setProducts(productsList);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setDeletingProduct(productId);
      await axios.delete(
        `https://my-shop-app-react-default-rtdb.firebaseio.com/products/${productId}.json`
      );
      fetchProducts();
      setDeletingProduct("");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditProduct = (productId) => {
    const productToEdit = products.find((product) => product.id === productId);
    if (productToEdit) {
      navigate(`/add-product`, {
        state: { product: productToEdit },
      });
    }
  };

  if (error) {
    return (
      <div className="error-message">Failed to fetch products: {error}</div>
    );
  }

  return (
    <>
      <NavBar></NavBar>
      <div className="manage-product-container">
        <h1 className="cart-title">Manage Products</h1>
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <>
            <NavLink to="/add-product" className="add-product-button">
              Add Product
            </NavLink>
            <div className="product-list">
              {products.map((product) => (
                <div key={product.id} className="product-item">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="product-image"
                  />
                  <div className="manage-product-details">
                    <h3>{product.title}</h3>
                    <p>{product.description}</p>
                    <p>Price: Rs. {product.price}</p>
                    <div className="product-actions">
                      {deletingProduct === product.id ? (
                        <div className="deleting-spinner"></div>
                      ) : (
                        <>
                          <button
                            className="edit-product-button"
                            onClick={() => handleEditProduct(product.id)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-product-button"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Manageproducts;
