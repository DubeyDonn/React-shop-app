import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";

import NavBar from "../../../core/components/navBar/Navbar";

import "./ViewProduct.css";

const ViewProduct = () => {
  const { id } = useParams();
  const productId = id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [productQuantityInCart, setProductQuantityInCart] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://my-shop-app-react-default-rtdb.firebaseio.com/products/${productId}.json`
        );

        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };
    const fetchCart = async () => {
      try {
        const response = await axios.get(
          `https://my-shop-app-react-default-rtdb.firebaseio.com/cart.json`
        );
        setCart(response.data);
        response.data.map((item) => {
          if (item.productId === productId) {
            setProductQuantityInCart(item.quantity);
          }
        });
      } catch (error) {
        console.error("Error fetching cart.", error);
      }
    };

    fetchProduct();
    fetchCart();
  }, []);

  const handleAddToCart = () => {
    const existingCartItem = cart.find((item) => item.productId === productId);

    if (existingCartItem) {
      console.log("executed1");
      existingCartItem.quantity += 1;
      existingCartItem.totalPrice =
        existingCartItem.price * existingCartItem.quantity;
      console.log("cart_in", cart);
    } else {
      console.log("executed2");
      const newCartItem = {
        productId: productId,
        title: product.title,
        price: product.price,
        quantity: 1,
        totalPrice: product.price,
      };
      cart.push(newCartItem);
    }

    axios
      .put(
        "https://my-shop-app-react-default-rtdb.firebaseio.com/cart.json",
        cart
      )
      .then((res) => {
        res.data.map((item) => {
          if (item.productId === productId) {
            setProductQuantityInCart(item.quantity);
          }
        });
        console.log("Product added to cart successfully");
      })
      .catch((error) => {
        console.error("Error adding product to cart:", error);
      });
  };

  const { title, price, description, imageUrl } = product || {};

  return (
    <>
      <NavBar />
      <div className="view-product-container">
        {loading ? (
          <div>Loading...</div>
        ) : !product ? (
          <div>Product not found.</div>
        ) : (
          <ul>
            <div className="product-details">
              <img src={imageUrl} alt={title} className="product-image" />
              <div className="product-info">
                <h2 className="product-title">{title}</h2>
                <p className="product-description">{description}</p>
                <p className="product-price">Price: Rs.{price}</p>
                <button
                  className="add-to-cart-button"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
                <p className="product-quantity">
                  Quantity in Cart: {productQuantityInCart}
                </p>
              </div>
            </div>
          </ul>
        )}
      </div>
    </>
  );
};

export default ViewProduct;
