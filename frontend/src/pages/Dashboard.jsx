import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Dashboard() {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // SERVICE MANAGEMENT MODAL
  // =====================================================

  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState("");

  // =====================================================
  // LOAD WORK ORDERS
  // =====================================================

  useEffect(() => {
    const loadWorkOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You are not logged in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:8080/api/work-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setWorkOrders(
          Array.isArray(response.data)
            ? response.data
            : []
        );

        setError("");
      } catch (err) {
        console.error("Error loading work orders:", err);

        if (err.response?.status === 401) {
          setError(
            "Your session has expired. Please login again."
          );
        } else {
          setError("Unable to load work orders.");
        }
      } finally {
        setLoading(false);
      }
    };

    // Avoid the React set-state-in-effect warning
    const timer = setTimeout(() => {
      loadWorkOrders();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // =====================================================
  // STATISTICS
  // =====================================================

  const total = workOrders.length;

  const newOrders = workOrders.filter(
    (order) => order.status === "NEW"
  ).length;

  const assigned = workOrders.filter(
    (order) => order.status === "ASSIGNED"
  ).length;

  const completed = workOrders.filter(
    (order) => order.status === "COMPLETED"
  ).length;

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // =====================================================
  // BADGE CLASS
  // =====================================================

  const getPriorityClass = (priority) => {
    if (priority === "HIGH") {
      return "badge-high";
    }

    if (priority === "LOW") {
      return "badge-low";
    }

    return "badge-medium";
  };

  const getStatusClass = (status) => {
    if (status === "NEW") {
      return "badge-new";
    }

    if (status === "ASSIGNED") {
      return "badge-assigned";
    }

    if (status === "COMPLETED") {
      return "badge-completed";
    }

    return "";
  };

  // =====================================================
  // SERVICE MANAGEMENT FEATURE
  // =====================================================

  const handleFeatureClick = (feature) => {
    setSelectedFeature(feature);
    setShowFeatureModal(true);
  };

  const closeFeatureModal = () => {
    setShowFeatureModal(false);
    setSelectedFeature("");
  };

  // =====================================================
  // SERVICE FEATURE CONTENT
  // =====================================================

  const getFeatureContent = () => {
    if (selectedFeature === "SLA Tracking") {
      return (
        <>
          <p className="feature-intro">
            Monitor service level agreements and track
            response and resolution targets for work orders.
          </p>

          <div className="feature-grid">

            <div className="feature-info-card">
              <span>Response Target</span>
              <strong>4 Hours</strong>
            </div>

            <div className="feature-info-card">
              <span>Resolution Target</span>
              <strong>24 Hours</strong>
            </div>

            <div className="feature-info-card">
              <span>SLA Status</span>
              <strong className="feature-status">
                ● Monitoring
              </strong>
            </div>

            <div className="feature-info-card">
              <span>Work Orders</span>
              <strong>{total}</strong>
            </div>

          </div>
        </>
      );
    }

    if (selectedFeature === "Parts") {
      return (
        <>
          <p className="feature-intro">
            Manage parts and materials required for
            service work orders and maintenance activities.
          </p>

          <div className="feature-grid">

            <div className="feature-info-card">
              <span>Parts Management</span>
              <strong>Available</strong>
            </div>

            <div className="feature-info-card">
              <span>Material Tracking</span>
              <strong>Enabled</strong>
            </div>

            <div className="feature-info-card">
              <span>Work Order Usage</span>
              <strong>Tracked</strong>
            </div>

            <div className="feature-info-card">
              <span>Inventory</span>
              <strong>Management</strong>
            </div>

          </div>
        </>
      );
    }

    if (selectedFeature === "Time Logging") {
      return (
        <>
          <p className="feature-intro">
            Track technician service time and monitor the
            duration spent on individual work orders.
          </p>

          <div className="feature-grid">

            <div className="feature-info-card">
              <span>Technician Time</span>
              <strong>Tracked</strong>
            </div>

            <div className="feature-info-card">
              <span>Service Duration</span>
              <strong>Available</strong>
            </div>

            <div className="feature-info-card">
              <span>Work Order Time</span>
              <strong>Logged</strong>
            </div>

            <div className="feature-info-card">
              <span>Time Reports</span>
              <strong>Available</strong>
            </div>

          </div>
        </>
      );
    }

    return null;
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <div className="app">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="navbar">

        {/* LOGO */}

        <div className="logo-section">

          <div className="logo-box">
            K
          </div>

          <div className="logo-text">
            <h2>KEYSTONE</h2>
            <span>Service Management</span>
          </div>

        </div>

        {/* NAVIGATION */}

        <div className="nav-links">

          <Link to="/dashboard">
            Dashboard
          </Link>

          <Link to="/work-orders">
            Work Orders
          </Link>

          <Link to="/customers">
            Customers
          </Link>

          <Link to="/sites">
            Sites
          </Link>

          <Link to="/technicians">
            Technicians
          </Link>

          <button
            type="button"
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="main-content">

        {/* PAGE HEADER */}

        <div className="page-header">

          <h1>
            Dashboard
          </h1>

          <p>
            Overview of your service management operations.
          </p>

        </div>

        {/* ERROR */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* =====================================================
            STATISTICS
        ===================================================== */}

        <div className="stats-grid">

          {/* TOTAL */}

          <div className="stat-card">

            <div className="stat-title">
              Total Work Orders
            </div>

            <div className="stat-number">
              {loading ? "--" : total}
            </div>

            <div className="stat-description">
              All work orders
            </div>

          </div>

          {/* NEW */}

          <div className="stat-card">

            <div className="stat-title">
              New
            </div>

            <div className="stat-number">
              {loading ? "--" : newOrders}
            </div>

            <div className="stat-description">
              Awaiting assignment
            </div>

          </div>

          {/* ASSIGNED */}

          <div className="stat-card">

            <div className="stat-title">
              Assigned
            </div>

            <div className="stat-number">
              {loading ? "--" : assigned}
            </div>

            <div className="stat-description">
              Currently assigned
            </div>

          </div>

          {/* COMPLETED */}

          <div className="stat-card">

            <div className="stat-title">
              Completed
            </div>

            <div className="stat-number">
              {loading ? "--" : completed}
            </div>

            <div className="stat-description">
              Successfully completed
            </div>

          </div>

        </div>

        {/* =====================================================
            ADDITIONAL SERVICE MANAGEMENT FEATURES
        ===================================================== */}

        <section className="section-card">

          <div className="section-header">

            <div>

              <h2>
                Service Management
              </h2>

              <p>
                Additional tools for service operations.
              </p>

            </div>

          </div>

          <div className="stats-grid">

            {/* =================================================
                SLA TRACKING
            ================================================= */}

            <div className="stat-card">

              <div className="stat-title">
                SLA Tracking
              </div>

              <div className="stat-number">
                ✓
              </div>

              <div className="stat-description">
                Monitor service level agreements
              </div>

              <button
                type="button"
                className="primary-btn"
                onClick={() =>
                  handleFeatureClick("SLA Tracking")
                }
              >
                View SLA
              </button>

            </div>

            {/* =================================================
                PARTS
            ================================================= */}

            <div className="stat-card">

              <div className="stat-title">
                Parts
              </div>

              <div className="stat-number">
                ⚙
              </div>

              <div className="stat-description">
                Manage parts and materials
              </div>

              <button
                type="button"
                className="primary-btn"
                onClick={() =>
                  handleFeatureClick("Parts")
                }
              >
                View Parts
              </button>

            </div>

            {/* =================================================
                TIME LOGGING
            ================================================= */}

            <div className="stat-card">

              <div className="stat-title">
                Time Logging
              </div>

              <div className="stat-number">
                ⏱
              </div>

              <div className="stat-description">
                Track technician service time
              </div>

              <button
                type="button"
                className="primary-btn"
                onClick={() =>
                  handleFeatureClick("Time Logging")
                }
              >
                View Time Logs
              </button>

            </div>

          </div>

        </section>

        {/* =====================================================
            WORK ORDERS
        ===================================================== */}

        <section className="section-card">

          <div className="section-header">

            <div>

              <h2>
                Work Orders
              </h2>

              <p>
                Manage and monitor service work orders.
              </p>

            </div>

            <Link
              to="/work-orders"
              className="primary-btn"
            >
              View All
            </Link>

          </div>

          {/* LOADING */}

          {loading ? (

            <div className="loading">
              Loading work orders...
            </div>

          ) : workOrders.length === 0 ? (

            <div className="loading">
              No work orders found.
            </div>

          ) : (

            <div className="table-container">

              <table className="work-orders-table">

                <thead>

                  <tr>

                    <th>
                      WO Code
                    </th>

                    <th>
                      Title
                    </th>

                    <th>
                      Customer
                    </th>

                    <th>
                      Site
                    </th>

                    <th>
                      Assigned To
                    </th>

                    <th>
                      Priority
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Scheduled Date
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {workOrders.map((order) => (

                    <tr key={order.id}>

                      {/* WO CODE */}

                      <td className="work-order-code">

                        <Link
                          to={`/work-orders/${order.id}`}
                        >
                          {order.workOrderCode}
                        </Link>

                      </td>

                      {/* TITLE */}

                      <td>
                        {order.title || "—"}
                      </td>

                      {/* CUSTOMER */}

                      <td className="customer-name">
                        {order.customer?.name || "—"}
                      </td>

                      {/* SITE */}

                      <td>
                        {order.site?.name || "—"}
                      </td>

                      {/* ASSIGNED */}

                      <td>
                        {order.assignedTo?.name ||
                          "Unassigned"}
                      </td>

                      {/* PRIORITY */}

                      <td>

                        <span
                          className={`badge ${getPriorityClass(
                            order.priority
                          )}`}
                        >
                          {order.priority || "MEDIUM"}
                        </span>

                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={`badge ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {order.status || "NEW"}
                        </span>

                      </td>

                      {/* DATE */}

                      <td>
                        {order.scheduledDate || "—"}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>

      {/* =====================================================
          SERVICE MANAGEMENT FEATURE MODAL
      ===================================================== */}

      {showFeatureModal && (

        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              closeFeatureModal();
            }
          }}
        >

          <div className="modal-container">

            {/* MODAL HEADER */}

            <div className="modal-header">

              <div>

                <h2>
                  {selectedFeature}
                </h2>

                <p>
                  Service management feature
                </p>

              </div>

              <button
                type="button"
                className="modal-close-btn"
                onClick={closeFeatureModal}
              >
                ×
              </button>

            </div>

            {/* FEATURE CONTENT */}

            <div className="feature-modal-content">
              {getFeatureContent()}
            </div>

            {/* MODAL FOOTER */}

            <div className="modal-actions">

              <button
                type="button"
                className="primary-btn"
                onClick={closeFeatureModal}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Dashboard;