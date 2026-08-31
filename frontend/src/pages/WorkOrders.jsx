import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/*
 * The API calls below update React state after asynchronous
 * operations. These rules can incorrectly flag that pattern.
 */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */

const API_BASE_URL = "http://localhost:8080/api";

function WorkOrders() {
  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD WORK ORDERS
  // =========================================================

  const loadWorkOrders = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not logged in.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        `${API_BASE_URL}/work-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Work orders loaded:",
        response.data
      );

      setWorkOrders(
        Array.isArray(response.data)
          ? response.data
          : []
      );

      setError("");
    } catch (err) {
      console.error(
        "Error loading work orders:",
        err
      );

      if (err.response?.status === 401) {
        setError(
          "Your session has expired. Please login again."
        );
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(
          "Unable to load work orders."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD WHEN PAGE OPENS
  // =========================================================

  useEffect(() => {
    loadWorkOrders();
  }, []);

  // =========================================================
  // PRIORITY BADGE
  // =========================================================

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "HIGH":
        return "badge-high";

      case "LOW":
        return "badge-low";

      case "MEDIUM":
      default:
        return "badge-medium";
    }
  };

  // =========================================================
  // STATUS BADGE
  // =========================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "NEW":
        return "badge-new";

      case "ASSIGNED":
        return "badge-assigned";

      case "COMPLETED":
        return "badge-completed";

      case "IN_PROGRESS":
        return "badge-in-progress";

      case "CANCELLED":
        return "badge-cancelled";

      default:
        return "";
    }
  };

  // =========================================================
  // OPEN WORK ORDER DETAILS
  // =========================================================

  const handleOpenWorkOrder = (id) => {
    navigate(`/work-orders/${id}`);
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="app">

      <main className="main-content">

        {/* ===================================================
            PAGE HEADER
        =================================================== */}

        <div className="page-header">

          <h1>
            Work Orders
          </h1>

          <p>
            Manage and monitor all service work orders.
          </p>

        </div>

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* ===================================================
            WORK ORDERS CARD
        =================================================== */}

        <section className="section-card">

          {/* =================================================
              SECTION HEADER
          ================================================= */}

          <div className="section-header">

            <div>

              <h2>
                All Work Orders
              </h2>

              <p>
                {loading
                  ? "Loading work orders..."
                  : `${workOrders.length} work orders found`}
              </p>

            </div>

            {/* =================================================
                CREATE WORK ORDER BUTTON
            ================================================= */}

            <button
              type="button"
              className="primary-btn"
              onClick={() =>
                navigate("/work-orders/create")
              }
            >
              + Create Work Order
            </button>

          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading ? (

            <div className="loading">
              Loading work orders...
            </div>

          ) : workOrders.length === 0 ? (

            /* =================================================
               NO WORK ORDERS
            ================================================= */

            <div className="loading">

              <p>
                No work orders found.
              </p>

              <button
                type="button"
                className="primary-btn"
                onClick={() =>
                  navigate("/work-orders/create")
                }
              >
                + Create Your First Work Order
              </button>

            </div>

          ) : (

            /* =================================================
               TABLE
            ================================================= */

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

                    <tr
                      key={order.id}
                      onClick={() =>
                        handleOpenWorkOrder(order.id)
                      }
                      style={{
                        cursor: "pointer",
                      }}
                    >

                      {/* =====================================
                          WO CODE
                      ====================================== */}

                      <td className="work-order-code">

                        {order.workOrderCode ||
                          order.woCode ||
                          `WO-${order.id}`}

                      </td>

                      {/* =====================================
                          TITLE
                      ====================================== */}

                      <td>
                        {order.title || "—"}
                      </td>

                      {/* =====================================
                          CUSTOMER
                      ====================================== */}

                      <td className="customer-name">

                        {order.customer?.name ||
                          order.customerName ||
                          "—"}

                      </td>

                      {/* =====================================
                          SITE
                      ====================================== */}

                      <td>

                        {order.site?.name ||
                          order.siteName ||
                          "—"}

                      </td>

                      {/* =====================================
                          ASSIGNED TO
                      ====================================== */}

                      <td>

                        {order.assignedTo?.name ||
                          order.assignedToName ||
                          "Unassigned"}

                      </td>

                      {/* =====================================
                          PRIORITY
                      ====================================== */}

                      <td>

                        <span
                          className={`badge ${getPriorityClass(
                            order.priority
                          )}`}
                        >
                          {order.priority ||
                            "MEDIUM"}
                        </span>

                      </td>

                      {/* =====================================
                          STATUS
                      ====================================== */}

                      <td>

                        <span
                          className={`badge ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {order.status ||
                            "NEW"}
                        </span>

                      </td>

                      {/* =====================================
                          DATE
                      ====================================== */}

                      <td>

                        {order.scheduledDate ||
                          "—"}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default WorkOrders;