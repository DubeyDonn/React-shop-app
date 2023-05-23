import "./App.css";
import ViewProduct from "./pages/home/view_product/ViewProduct";
import Orders from "./pages/orders/Orders";
import Manageproducts from "./pages/manage_products/ManageProducts";

import Home from "./pages/home/Home";
import AddProduct from "./pages/manage_products/add_edit_product/AddEditProduct";
import Cart from "./pages/cart/Cart";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      {/* <Navbar />
      <ProductsList /> */}
      {/* <ViewProduct /> */}

      {/* <Orders /> */}
      {/* <Manageproducts /> */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/manage-products" element={<Manageproducts />} />
        <Route path="/view-product/:id" element={<ViewProduct />} />
        <Route path="/add-product" element={<AddProduct />} />
      </Routes>
    </>
  );
}

export default App;
