import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/Dashboard";
import Spares from "./pages/Spares";
import StockIn from "./pages/StockIn";
import StockOut from "./pages/StockOut";
import StockAdjustments from "./pages/StockAdjustments";
import Categories from "./pages/Categories";
import Suppliers from "./pages/Suppliers";
import Reports from "./pages/Reports";
import StoreKeepers from "./pages/StoreKeepers";
import ChangePassword from "./pages/ChangePassword";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";
import LandingPage from "./components/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        {/* Either role can be here - it's the page that gets a storekeeper
            unblocked on their very first login. */}
        <Route element={<ProtectedRoute />}>
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>

        {/* Storekeeper-only: inventory pages. An owner landing here gets
            bounced to /storekeepers instead of a page full of 403s. */}
        <Route element={<ProtectedRoute allowedRoles={["storekeeper"]} />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/spares" element={<Spares />} />
            <Route path="/stock-in" element={<StockIn />} />
            <Route path="/stock-out" element={<StockOut />} />
            <Route path="/stock-adjustments" element={<StockAdjustments />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/reports" element={<Reports />} />
          </Route>
        </Route>

        {/* Owner-only: managing storekeeper accounts. */}
        <Route element={<ProtectedRoute allowedRoles={["owner"]} />}>
          <Route element={<Layout />}>
            <Route path="/storekeepers" element={<StoreKeepers />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;