import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Bookings from "./pages/Bookings";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import ProductDetail from "./pages/ProductDetail";
import SearchGrounds from "./pages/SearchGrounds";
import GroundDetail from "./pages/GroundDetail";
import Events from "./pages/Events";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SportsProfessionals from "./pages/SportsProfessionals";
import ProfessionalProfile from "./pages/ProfessionalProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminGrounds from "./pages/admin/AdminGrounds";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminInventory from "./pages/admin/AdminInventory";
import InventoryAllocate from "./pages/admin/InventoryAllocate";
import AddGround from "./pages/admin/AddGround";
import AddEditGround from "./pages/admin/AddEditGround";
import GroundOwners from "./pages/admin/GroundOwners";
import NotFound from "./pages/NotFound";
import SportsProfessionalsAdmin from "./pages/admin/SportsProfessionals";
import EcommerceManager from "./pages/admin/EcommerceManager";
import APIDoc from "./pages/APIDoc";
import PendingCartPopup from "./components/cart/PendingCartPopup";
import "./App.css";

function App() {
  return (
    <Router>
      <PendingCartPopup />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/search" element={<SearchGrounds />} />
        <Route path="/ground/:id" element={<GroundDetail />} />
        <Route path="/events" element={<Events />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sports-professionals" element={<SportsProfessionals />} />
        <Route path="/professional/:id" element={<ProfessionalProfile />} />
        <Route path="/api-documentation" element={<APIDoc />} />

        {/* Admin routes */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/grounds" element={<AdminGrounds />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="/admin/inventory" element={<AdminInventory />} />
        <Route
          path="/admin/inventory/allocate/:id"
          element={<InventoryAllocate />}
        />
        <Route path="/admin/add-ground" element={<AddGround />} />
        <Route path="/admin/edit-ground/:id" element={<AddEditGround />} />
        <Route path="/admin/ground-owners" element={<GroundOwners />} />
        <Route
          path="/admin/sports-professionals"
          element={<SportsProfessionalsAdmin />}
        />
        <Route path="/admin/ecommerce" element={<EcommerceManager />} />
        <Route
          path="/jokova_socialmedia_og.jpg"
          element={"/jokova_socialmedia_og.jpg"}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
