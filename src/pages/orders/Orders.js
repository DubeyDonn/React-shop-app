import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Orders.css";
import NavBar from "../../core/components/navBar/Navbar";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "https://my-shop-app-react-default-rtdb.firebaseio.com/orders.json"
        );

        if (response.data) {
          const ordersData = Object.entries(response.data).map(
            ([orderId, order]) => ({
              id: orderId,
              cart: order,
            })
          );
          setOrders(ordersData);
        }

        setLoading(false);
      } catch (error) {
        setError("Error fetching orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <NavBar />
      <div className="cart-container">
        <h1 className="cart-title">Orders</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : orders.length === 0 ? (
          <p className="empty-cart-message">No orders found.</p>
        ) : (
          <ul className="order-list">
            {orders.map((order) => (
              <li key={order.id} className="cart-item">
                <h3>Order ID: {order.id}</h3>
                <ul>
                  {Object.values(order.cart).map((cartItem) => (
                    <li key={cartItem.productId}>
                      <h4>{cartItem.title}</h4>
                      <p>Price: Rs. {cartItem.price}</p>
                      <p>Quantity: {cartItem.quantity}</p>
                      <p>Total Price: Rs. {cartItem.totalPrice}</p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Orders;
