import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Cart.css";
import NavBar from "../../core/components/navBar/Navbar";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(
          " https://my-shop-app-react-default-rtdb.firebaseio.com/cart.json"
        );
        if (response.data) {
          setCartItems(response.data);
          console.log(response.data);
        }
        setLoading(false);
      } catch (error) {
        setError("Error fetching cart items");
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const removeProduct = async (productId) => {
    try {
      const updatedCart = cartItems.filter(
        (item) => item.productId !== productId
      );
      await axios.put(
        " https://my-shop-app-react-default-rtdb.firebaseio.com/cart.json",
        updatedCart
      );
      setCartItems(updatedCart);
    } catch (error) {
      setError("Error removing product from cart");
    }
  };

  const addProduct = async (productId) => {
    const productToUpdate = cartItems.find(
      (item) => item.productId === productId
    );

    if (productToUpdate) {
      const updatedProduct = {
        ...productToUpdate,
        quantity: productToUpdate.quantity + 1,
        totalPrice: productToUpdate.price * (productToUpdate.quantity + 1),
      };

      const updatedCart = cartItems.map((item) =>
        item.productId === productId ? updatedProduct : item
      );

      try {
        await axios.put(
          " https://my-shop-app-react-default-rtdb.firebaseio.com/cart.json",
          updatedCart
        );
        setCartItems(updatedCart);
      } catch (error) {
        setError("Error updating product quantity");
      }
    }
  };

  const handleOrderNow = async () => {
    try {
      // Create an empty order list
      const orderList = [];

      // Iterate over each cart item
      for (const item of cartItems) {
        const { productId, title, price, quantity } = item;

        // Calculate the total price for each cart item
        const totalPrice = price * quantity;

        // Add the cart item details to the order list
        const orderItem = {
          productId,
          title,
          price,
          quantity,
          totalPrice,
        };
        orderList.push(orderItem);
      }

      // Send the order list to the backend (e.g., Firebase)
      await axios.post(
        "https://my-shop-app-react-default-rtdb.firebaseio.com/orders.json",
        orderList
      );

      // Clear the cart by removing the cart items from the database
      await axios.delete(
        "https://my-shop-app-react-default-rtdb.firebaseio.com/cart.json"
      );

      // Clear the cart locally by setting it to an empty array
      setCartItems([]);
    } catch (error) {
      setError("Error placing order");
    }
  };

  return (
    <>
      <NavBar />
      <div className="cart-container">
        <h1 className="cart-title">Cart</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : cartItems.length === 0 ? (
          <p className="empty-cart-message">Your cart is empty.</p>
        ) : (
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.productId} className="cart-item">
                <h3>{item.title}</h3>
                <p>Price: Rs. {item.price}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Total Price: Rs. {item.totalPrice}</p>
                <div className="cart-item-buttons">
                  <button
                    className="remove-button"
                    onClick={() => removeProduct(item.productId)}
                  >
                    Remove
                  </button>
                  <button
                    className="add-button"
                    onClick={() => addProduct(item.productId)}
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
            <button className="order-now-button" onClick={handleOrderNow}>
              Order Now
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
