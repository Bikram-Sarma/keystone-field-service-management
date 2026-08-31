import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import WorkOrders from "./pages/WorkOrders";
import CreateWorkOrder from "./pages/CreateWorkOrder";
import WorkOrderDetails from "./pages/WorkOrderDetails";
import Sites from "./pages/Sites";
import Customers from "./pages/Customers";
import Technicians from "./pages/Technicians";

import "./App.css";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Login */}
        <Route
          path="/"
          element={<Login />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* Work Orders */}
        <Route
          path="/work-orders"
          element={<WorkOrders />}
        />

        {/* Work Order Details */}
        <Route
          path="/work-orders/:id"
          element={<WorkOrderDetails />}
        />

        {/* Create Work Order */}
        <Route
          path="/work-orders/create"
          element={<CreateWorkOrder />}
        />

        {/* Customers */}
        <Route
          path="/customers"
          element={<Customers />}
        />

        {/* Sites */}
        <Route
          path="/sites"
          element={<Sites />}
        />

        {/* Technicians */}
        <Route
          path="/technicians"
          element={<Technicians />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;