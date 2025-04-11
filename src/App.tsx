
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SearchGrounds from "./pages/SearchGrounds";
import GroundDetail from "./pages/GroundDetail";
import Bookings from "./pages/Bookings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";

// Admin routes
import AdminDashboard from "./pages/admin/AdminDashboard";
import GroundOwners from "./pages/admin/GroundOwners";
import AdminGrounds from "./pages/admin/AdminGrounds";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminInventory from "./pages/admin/AdminInventory";
import InventoryAllocate from "./pages/admin/InventoryAllocate";
import EcommerceManager from "./pages/admin/EcommerceManager";

const App = () => {
  // Create a client inside the component
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchGrounds />} />
            <Route path="/grounds/:id" element={<GroundDetail />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/ground-owners" element={<GroundOwners />} />
            <Route path="/admin/grounds" element={<AdminGrounds />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/inventory" element={<AdminInventory />} />
            <Route path="/admin/inventory/allocate" element={<InventoryAllocate />} />
            <Route path="/admin/ecommerce" element={<EcommerceManager />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
