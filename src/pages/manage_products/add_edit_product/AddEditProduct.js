import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./AddEditProduct.css";
import { useEffect } from "react";

const AddProduct = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const [product, setProduct] = useState({
    description: "",
    imageUrl: "",
    price: "",
    title: "",
  });
  const isEdit = location.state && location.state.product;
  useEffect(() => {
    if (isEdit) {
      setProduct(location.state.product);
    }
  }, [isEdit, location.state]);

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddProduct = async () => {
    try {
      await axios.post(
        "https://my-shop-app-react-default-rtdb.firebaseio.com/products.json",
        product
      );
      navigate("/manage-products");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleEditProduct = async () => {
    try {
      await axios.put(
        `https://my-shop-app-react-default-rtdb.firebaseio.com/products/${product.id}.json`,
        {
          description: product.description,
          imageUrl: product.imageUrl,
          price: product.price,
          title: product.title,
        }
      );
      navigate("/manage-products");
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any field is empty
    for (const key in product) {
      if (product[key].trim() === "") {
        alert("All fields must be filled.");
        return;
      }
    }

    // Perform validations
    if (product.description.length < 10) {
      alert("Description should have at least 10 characters.");
      return;
    }

    if (
      !product.imageUrl.startsWith("https://") ||
      !/\.(jpg|jpeg|png|gif)$/i.test(product.imageUrl)
    ) {
      alert(
        'Image URL should start with "https://" and end with a valid image format (jpg, jpeg, png, gif).'
      );
      return;
    }

    const priceNumber = parseInt(product.price);
    if (isNaN(priceNumber) || priceNumber < 0) {
      alert("Price should be a non-negative integer.");
      return;
    }

    if (isEdit) {
      console.log("Edit product:", product);

      handleEditProduct();
    } else {
      console.log("Add product:", product);
      handleAddProduct();
    }
  };

  return (
    <div className="add-product-container">
      <h2>{isEdit ? "Edit Product" : "Add Product"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={product.title}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="imageUrl">Image URL:</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={product.imageUrl}
            onChange={handleChange}
          />
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt="Product Preview"
              className="image-preview"
            />
          )}
        </div>
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="text"
            id="price"
            name="price"
            value={product.price}
            onChange={handleChange}
          />
        </div>
        <div className="button-container">
          <button type="button" onClick={() => navigate("/manage-products")}>
            Back
          </button>
          <button type="submit">{isEdit ? "Update" : "Add"}</button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
