import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_BASE_URL = "http://localhost:8080/api";

const emptyForm = {
  name: "",
  contactEmail: "",
  phone: "",
  active: true,
};

function Customers() {
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState(emptyForm);

  // =========================================================
  // LOAD CUSTOMERS
  // =========================================================

  const loadCustomers = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not logged in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/customers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCustomers(response.data);
      setError("");
    } catch (err) {
      console.error("Error loading customers:", err);

      if (err.response?.status === 401) {
        setError(
          "Your session has expired. Please login again."
        );
      } else {
        setError("Unable to load customers.");
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCustomers();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // =========================================================
  // OPEN MODAL
  // =========================================================

  const handleOpenModal = () => {
    setFormData(emptyForm);
    setFormError("");
    setShowModal(true);
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const handleCloseModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    setFormError("");
    setFormData(emptyForm);
  };

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // ACTIVE CHANGE
  // =========================================================

  const handleActiveChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      active: event.target.checked,
    }));
  };

  // =========================================================
  // CREATE CUSTOMER
  // =========================================================

  const handleCreateCustomer = async (event) => {
    event.preventDefault();

    setFormError("");

    if (!formData.name.trim()) {
      setFormError("Please enter a customer name.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setFormError("You are not logged in.");
      return;
    }

    setSaving(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/customers`,
        {
          name: formData.name.trim(),
          contactEmail: formData.contactEmail.trim(),
          phone: formData.phone.trim(),
          active: formData.active,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setCustomers((previous) => [
        ...previous,
        response.data,
      ]);

      setFormData(emptyForm);
      setShowModal(false);
      setFormError("");
      setError("");
    } catch (err) {
      console.error("Error creating customer:", err);

      if (err.response?.data?.message) {
        setFormError(err.response.data.message);
      } else if (err.response?.data) {
        setFormError(
          typeof err.response.data === "string"
            ? err.response.data
            : "Unable to create customer."
        );
      } else {
        setFormError(
          "Unable to create customer. Please try again."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE CUSTOMER
  // =========================================================

  const handleDeleteCustomer = async (customerId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not logged in.");
      return;
    }

    try {
      await axios.delete(
        `${API_BASE_URL}/customers/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCustomers((previous) =>
        previous.filter(
          (customer) => customer.id !== customerId
        )
      );

      setError("");
    } catch (err) {
      console.error("Error deleting customer:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(
          "Unable to delete customer. Make sure the customer has no sites or work orders."
        );
      }
    }
  };

  // =========================================================
  // JSX
  // =========================================================

  return (
    <div className="app">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="navbar">

        <div className="logo-section">

          <div className="logo-box">
            K
          </div>

          <div className="logo-text">
            <h2>KEYSTONE</h2>
            <span>Service Management</span>
          </div>

        </div>

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
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="main-content">

        <div className="page-header">

          <h1>
            Customers
          </h1>

          <p>
            Manage your customers and their service information.
          </p>

        </div>

        {/* ERROR */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* =====================================================
            CUSTOMER CARD
        ===================================================== */}

        <section className="section-card">

          <div className="section-header">

            <div>

              <h2>
                All Customers
              </h2>

              <p>
                {customers.length} customers found
              </p>

            </div>

            <button
              type="button"
              className="primary-btn"
              onClick={handleOpenModal}
            >
              + Create Customer
            </button>

          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading ? (

            <div className="loading">
              Loading customers...
            </div>

          ) : customers.length === 0 ? (

            <div className="loading">
              No customers found.
            </div>

          ) : (

            <div className="table-container">

              <table className="work-orders-table">

                <thead>

                  <tr>

                    <th>
                      ID
                    </th>

                    <th>
                      Customer Name
                    </th>

                    <th>
                      Email
                    </th>

                    <th>
                      Phone
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {customers.map((customer) => (

                    <tr key={customer.id}>

                      <td>
                        {customer.id}
                      </td>

                      <td className="customer-name">
                        {customer.name}
                      </td>

                      <td>
                        {customer.contactEmail || "—"}
                      </td>

                      <td>
                        {customer.phone || "—"}
                      </td>

                      <td>

                        <span
                          className={`badge ${
                            customer.active
                              ? "badge-completed"
                              : "badge-low"
                          }`}
                        >
                          {customer.active
                            ? "ACTIVE"
                            : "INACTIVE"}
                        </span>

                      </td>

                      <td>

                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() =>
                            handleDeleteCustomer(
                              customer.id
                            )
                          }
                        >
                          Open
                        </button>

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
          CREATE CUSTOMER MODAL
      ===================================================== */}

      {showModal && (

        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseModal();
            }
          }}
        >

          <div className="modal-container">

            {/* HEADER */}

            <div className="modal-header">

              <div>

                <h2>
                  Create Customer
                </h2>

                <p>
                  Add a new customer to Keystone.
                </p>

              </div>

              <button
                type="button"
                className="modal-close-btn"
                onClick={handleCloseModal}
                disabled={saving}
              >
                ×
              </button>

            </div>

            {/* FORM ERROR */}

            {formError && (
              <div className="form-error">
                {formError}
              </div>
            )}

            {/* FORM */}

            <form
              className="work-order-form"
              onSubmit={handleCreateCustomer}
            >

              {/* NAME */}

              <div className="form-group">

                <label htmlFor="customer-name">
                  Customer Name
                </label>

                <input
                  id="customer-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter customer name"
                  maxLength={150}
                  disabled={saving}
                  required
                />

              </div>

              {/* EMAIL */}

              <div className="form-group">

                <label htmlFor="customer-email">
                  Email
                </label>

                <input
                  id="customer-email"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="Enter customer email"
                  maxLength={150}
                  disabled={saving}
                />

              </div>

              {/* PHONE */}

              <div className="form-group">

                <label htmlFor="customer-phone">
                  Phone
                </label>

                <input
                  id="customer-phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  maxLength={30}
                  disabled={saving}
                />

              </div>

              {/* ACTIVE */}

              <div className="form-group">

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >

                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={handleActiveChange}
                    disabled={saving}
                  />

                  Active Customer

                </label>

              </div>

              {/* ACTIONS */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={handleCloseModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Creating..."
                    : "Create Customer"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Customers;