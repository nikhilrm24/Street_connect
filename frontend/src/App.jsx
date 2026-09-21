import { BrowserRouter, Routes, Route } from "react-router-dom";


import ProtectedRoute from "./components/ProtectedRoute";


import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Vendors from "./pages/Vendors";
import VendorDetails from "./pages/VendorDetails";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CustomerOrders from "./pages/CustomerOrders";
import CustomerNotifications from "./pages/CustomerNotifications";
import AdminDashboard from "./pages/AdminDashboard";


import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorProducts from "./pages/vendor/VendorProduct";
import AddProduct from "./pages/vendor/AddProduct";
import EditProduct from "./pages/vendor/EditProduct";
import VendorProfile from "./pages/vendor/VendorProfile";
import EditVendorProfile from "./pages/vendor/EditVendorProfile";
import VendorLocation from "./pages/vendor/VendorLocations";
import VendorOrders from "./pages/vendor/VendorOrders";
import VendorNotifications from "./pages/vendor/VendorNotifications";
function App() {
  return (
    <BrowserRouter>
      <Routes>

     

        <Route
          path="/home"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/vendors"
          element={<Vendors />}
        />

        <Route
          path="/vendors/:id"
          element={<VendorDetails />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerNotifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />


       

        <Route
          path="/vendor/dashboard"
          element={
            <ProtectedRoute allowedRoles={["vendor"]}>
              <VendorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/products"
          element={
            <ProtectedRoute allowedRoles={["vendor"]}>
              <VendorProducts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/products/add"
          element={
            <ProtectedRoute allowedRoles={["vendor"]}>
              <AddProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/products/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["vendor"]}>
              <EditProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/profile"
          element={
            <ProtectedRoute allowedRoles={["vendor"]}>
              <VendorProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/profile/edit"
          element={
            <ProtectedRoute allowedRoles={["vendor"]}>
              <EditVendorProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/location"
          element={
            <ProtectedRoute allowedRoles={["vendor"]}>
              <VendorLocation />
            </ProtectedRoute>
          }
        />
       <Route
  path="/vendor/orders"
  element={
    <ProtectedRoute allowedRoles={["vendor"]}>
      <VendorOrders />
    </ProtectedRoute>
  }
/>
       <Route
  path="/vendor/notifications"
  element={
    <ProtectedRoute allowedRoles={["vendor"]}>
      <VendorNotifications />
    </ProtectedRoute>
  }
 />
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;