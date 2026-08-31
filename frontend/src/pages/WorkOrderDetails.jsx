import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

function WorkOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workOrder, setWorkOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadWorkOrder = async () => {
      await Promise.resolve();

      const token = localStorage.getItem("token");

      if (!token) {
        setError("You are not logged in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${API_BASE_URL}/work-orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setWorkOrder(response.data);
        setError("");
      } catch (err) {
        console.error("Error loading work order:", err);

        if (err.response?.status === 404) {
          setError("Work order not found.");
        } else if (err.response?.status === 401) {
          setError("Your session has expired. Please login again.");
        } else {
          setError("Unable to load work order.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadWorkOrder();
  }, [id]);

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "HIGH":
        return "badge-high";

      case "LOW":
        return "badge-low";

      default:
        return "badge-medium";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "NEW":
        return "badge-new";

      case "ASSIGNED":
        return "badge-assigned";

      case "COMPLETED":
        return "badge-completed";

      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="app">
        <main className="main-content">
          <div className="loading">
            Loading work order...
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <main className="main-content">

          <div className="error-message">
            {error}
          </div>

          <button
            type="button"
            className="secondary-btn"
            onClick={() => navigate("/work-orders")}
          >
            ← Back to Work Orders
          </button>

        </main>
      </div>
    );
  }

  if (!workOrder) {
    return null;
  }

  return (
    <div className="app">

      <main className="main-content">

        {/* =================================================
            TOP
        ================================================= */}

        <div className="details-top">

          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/work-orders")}
          >
            ← Back to Work Orders
          </button>

        </div>

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="page-header">

          <h1>
            Work Order Details
          </h1>

          <p>
            View complete information about this service work order.
          </p>

        </div>

        {/* =================================================
            MAIN DETAILS CARD
        ================================================= */}

        <section className="section-card">

          <div className="details-header">

            <div>

              <span className="details-code">
                {workOrder.workOrderCode}
              </span>

              <h2>
                {workOrder.title}
              </h2>

            </div>

            <div className="details-badges">

              <span
                className={`badge ${getPriorityClass(
                  workOrder.priority
                )}`}
              >
                {workOrder.priority}
              </span>

              <span
                className={`badge ${getStatusClass(
                  workOrder.status
                )}`}
              >
                {workOrder.status}
              </span>

            </div>

          </div>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="details-section">

            <h3>
              Description
            </h3>

            <p className="description-text">
              {workOrder.description ||
                "No description provided."}
            </p>

          </div>

          {/* =================================================
              INFORMATION GRID
          ================================================= */}

          <div className="details-grid">

            {/* CUSTOMER */}

            <div className="detail-item">

              <span className="detail-label">
                Customer
              </span>

              <strong>
                {workOrder.customer?.name || "—"}
              </strong>

            </div>

            {/* SITE */}

            <div className="detail-item">

              <span className="detail-label">
                Site
              </span>

              <strong>
                {workOrder.site?.name || "—"}
              </strong>

            </div>

            {/* ASSIGNED */}

            <div className="detail-item">

              <span className="detail-label">
                Assigned Technician
              </span>

              <strong>
                {workOrder.assignedTo?.name ||
                  "Unassigned"}
              </strong>

            </div>

            {/* CREATED BY */}

            <div className="detail-item">

              <span className="detail-label">
                Created By
              </span>

              <strong>
                {workOrder.createdBy?.name ||
                  "—"}
              </strong>

            </div>

            {/* PRIORITY */}

            <div className="detail-item">

              <span className="detail-label">
                Priority
              </span>

              <span>
                <span
                  className={`badge ${getPriorityClass(
                    workOrder.priority
                  )}`}
                >
                  {workOrder.priority}
                </span>
              </span>

            </div>

            {/* STATUS */}

            <div className="detail-item">

              <span className="detail-label">
                Status
              </span>

              <span>
                <span
                  className={`badge ${getStatusClass(
                    workOrder.status
                  )}`}
                >
                  {workOrder.status}
                </span>
              </span>

            </div>

            {/* SCHEDULED DATE */}

            <div className="detail-item">

              <span className="detail-label">
                Scheduled Date
              </span>

              <strong>
                {workOrder.scheduledDate || "—"}
              </strong>

            </div>

            {/* WORK ORDER ID */}

            <div className="detail-item">

              <span className="detail-label">
                Work Order ID
              </span>

              <strong>
                #{workOrder.id}
              </strong>

            </div>

          </div>

          {/* =================================================
              DATES
          ================================================= */}

          <div className="details-section dates-section">

            <h3>
              Record Information
            </h3>

            <div className="dates-grid">

              <div>

                <span className="detail-label">
                  Created At
                </span>

                <strong>
                  {workOrder.createdAt
                    ? new Date(
                        workOrder.createdAt
                      ).toLocaleString()
                    : "—"}
                </strong>

              </div>

              <div>

                <span className="detail-label">
                  Last Updated
                </span>

                <strong>
                  {workOrder.updatedAt
                    ? new Date(
                        workOrder.updatedAt
                      ).toLocaleString()
                    : "—"}
                </strong>

              </div>

            </div>

          </div>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="details-actions">

            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("/work-orders")}
            >
              ← Back
            </button>

            <button
              type="button"
              className="primary-btn"
              onClick={() => {
                alert(
                  "Edit functionality will be added next."
                );
              }}
            >
              Edit Work Order
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default WorkOrderDetails;