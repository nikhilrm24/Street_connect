import { BrowserRouter, Routes, Route } from "react-router-dom";


import ProtectedRoute from "./components/ProtectedRoute";


import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Vendors from "./pages/Vendors";
import VendorDetails from "./pages/VendorDetails";
import ProductDetails from "./pages/ProductDetails";


import VendorDashboard from "./pages/vendor/VendorDashBoard";
import VendorProducts from "./pages/vendor/VendorProduct";
import AddProduct from "./pages/vendor/AddProduct";
import EditProduct from "./pages/vendor/EditProduct";
import VendorProfile from "./pages/vendor/VendorProfile";
import EditVendorProfile from "./pages/vendor/EditVendorProfile";
import VendorLocation from "./pages/vendor/VendorLocations";
import VendorOrders from "./pages/vendor/VendorOrders";
function App() {
  return (
    <BrowserRouter>
      <Routes>

     

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
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
          path="/vendor/dashboard"
          element={
            <ProtectedRoute>
              <VendorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/products"
          element={
            <ProtectedRoute>
              <VendorProducts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/products/add"
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/products/edit/:id"
          element={
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/profile"
          element={
            <ProtectedRoute>
              <VendorProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/profile/edit"
          element={
            <ProtectedRoute>
              <EditVendorProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/location"
          element={
            <ProtectedRoute>
              <VendorLocation />
            </ProtectedRoute>
          }
        />
       <Route
  path="/vendor/orders"
  element={
    <ProtectedRoute>
      <VendorOrders />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;