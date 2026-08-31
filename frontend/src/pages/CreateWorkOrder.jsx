import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/*
 * Disable these two React compiler lint rules for this page.
 * The API calls below intentionally update state after async operations.
 */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */

const API_BASE_URL = "https://keystone-field-service-management-ol2u.onrender.com/api";

function CreateWorkOrder() {
  const navigate = useNavigate();

  // =========================================================
  // CUSTOMER / SITE DATA
  // =========================================================

  const [customers, setCustomers] = useState([]);
  const [sites, setSites] = useState([]);

  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingSites, setLoadingSites] = useState(false);

  // =========================================================
  // WORK ORDER FORM
  // =========================================================

  const [formData, setFormData] = useState({
    customerId: "",
    siteId: "",
    title: "",
    description: "",
    priority: "MEDIUM",
    scheduledDate: "",
  });

  // =========================================================
  // CREATE SITE MODAL
  // =========================================================

  const [showSiteModal, setShowSiteModal] = useState(false);

  const [siteData, setSiteData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
  });

  // =========================================================
  // LOADING / ERROR
  // =========================================================

  const [loading, setLoading] = useState(false);
  const [creatingSite, setCreatingSite] = useState(false);

  const [error, setError] = useState("");
  const [siteError, setSiteError] = useState("");

  // =========================================================
  // LOAD CUSTOMERS
  // =========================================================

  const loadCustomers = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not logged in.");
      setLoadingCustomers(false);
      return;
    }

    try {
      setLoadingCustomers(true);

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
        setError("Your session has expired. Please login again.");
      } else {
        setError("Unable to load customers.");
      }
    } finally {
      setLoadingCustomers(false);
    }
  };

  // =========================================================
  // LOAD CUSTOMERS WHEN PAGE OPENS
  // =========================================================

  useEffect(() => {
    loadCustomers();
  }, []);

  // =========================================================
  // LOAD SITES FOR CUSTOMER
  // =========================================================

  const loadSites = async (customerId) => {
    if (!customerId) {
      setSites([]);
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not logged in.");
      return;
    }

    try {
      setLoadingSites(true);
      setSites([]);
      setFormData((previous) => ({
        ...previous,
        siteId: "",
      }));

      const response = await axios.get(
        `${API_BASE_URL}/customers/${customerId}/sites`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSites(response.data);
      setError("");
    } catch (err) {
      console.error("Error loading sites:", err);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please login again.");
      } else {
        setError("Unable to load sites for this customer.");
      }
    } finally {
      setLoadingSites(false);
    }
  };

  // =========================================================
  // CUSTOMER CHANGE
  // =========================================================

  const handleCustomerChange = async (event) => {
    const customerId = event.target.value;

    setFormData((previous) => ({
      ...previous,
      customerId,
      siteId: "",
    }));

    setSites([]);
    setError("");

    if (customerId) {
      await loadSites(customerId);
    }
  };

  // =========================================================
  // WORK ORDER INPUT CHANGE
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // OPEN CREATE SITE MODAL
  // =========================================================

  const handleOpenSiteModal = () => {
    if (!formData.customerId) {
      setError("Please select a customer first.");
      return;
    }

    setSiteData({
      name: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
    });

    setSiteError("");
    setShowSiteModal(true);
  };

  // =========================================================
  // CLOSE CREATE SITE MODAL
  // =========================================================

  const handleCloseSiteModal = () => {
    if (creatingSite) {
      return;
    }

    setShowSiteModal(false);
    setSiteError("");
  };

  // =========================================================
  // SITE INPUT CHANGE
  // =========================================================

  const handleSiteChange = (event) => {
    const { name, value } = event.target;

    setSiteData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // CREATE SITE
  // =========================================================

  const handleCreateSite = async (event) => {
    event.preventDefault();

    setSiteError("");

    if (!formData.customerId) {
      setSiteError("Please select a customer.");
      return;
    }

    if (!siteData.name.trim()) {
      setSiteError("Site name is required.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setSiteError("You are not logged in.");
      return;
    }

    try {
      setCreatingSite(true);

      const response = await axios.post(
        `${API_BASE_URL}/customers/${formData.customerId}/sites`,
        {
          name: siteData.name.trim(),
          address: siteData.address.trim(),
          city: siteData.city.trim(),
          state: siteData.state.trim(),
          postalCode: siteData.postalCode.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Site created:", response.data);

      const newSite = response.data;

      // Add new site to dropdown
      setSites((previous) => [
        ...previous,
        newSite,
      ]);

      // Automatically select newly created site
      setFormData((previous) => ({
        ...previous,
        siteId: String(newSite.id),
      }));

      // Close modal
      setShowSiteModal(false);

      setSiteError("");
      setError("");

      // Clear site form
      setSiteData({
        name: "",
        address: "",
        city: "",
        state: "",
        postalCode: "",
      });
    } catch (err) {
      console.error("Error creating site:", err);

      if (err.response?.data?.message) {
        setSiteError(err.response.data.message);
      } else if (typeof err.response?.data === "string") {
        setSiteError(err.response.data);
      } else if (err.response?.status === 401) {
        setSiteError(
          "Your session has expired. Please login again."
        );
      } else {
        setSiteError(
          "Unable to create site. Please try again."
        );
      }
    } finally {
      setCreatingSite(false);
    }
  };

  // =========================================================
  // CREATE WORK ORDER
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // ---------------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------------

    if (!formData.customerId) {
      setError("Please select a customer.");
      return;
    }

    if (!formData.siteId) {
      setError("Please select a site.");
      return;
    }

    if (!formData.title.trim()) {
      setError("Work order title is required.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not logged in.");
      return;
    }

    // ---------------------------------------------------------
    // CREATE WORK ORDER
    // ---------------------------------------------------------

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_BASE_URL}/customers/${formData.customerId}/sites/${formData.siteId}/work-orders`,
        {
          title: formData.title.trim(),
          description: formData.description.trim(),
          priority: formData.priority,
          scheduledDate:
            formData.scheduledDate || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "Work order created successfully:",
        response.data
      );

      // Go back to work orders
      navigate("/work-orders");
    } catch (err) {
      console.error(
        "Error creating work order:",
        err
      );

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (typeof err.response?.data === "string") {
        setError(err.response.data);
      } else if (err.response?.status === 401) {
        setError(
          "Your session has expired. Please login again."
        );
      } else {
        setError(
          "Unable to create work order. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // JSX
  // =========================================================

  return (
    <div className="app">

      <main className="main-content">

        {/* ===================================================
            PAGE HEADER
        =================================================== */}

        <div className="page-header">
          <h1>Create Work Order</h1>

          <p>
            Create a new service work order.
          </p>
        </div>

        {/* ===================================================
            MAIN FORM CARD
        =================================================== */}

        <section className="section-card">

          <form
            onSubmit={handleSubmit}
            className="work-order-form"
          >

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-grid">

              {/* =================================================
                  CUSTOMER
              ================================================= */}

              <div className="form-group full-width">

                <label htmlFor="customerId">
                  Customer *
                </label>

                <select
                  id="customerId"
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleCustomerChange}
                  disabled={
                    loadingCustomers ||
                    loading ||
                    creatingSite
                  }
                  required
                >

                  <option value="">
                    {loadingCustomers
                      ? "Loading customers..."
                      : "Select customer"}
                  </option>

                  {customers.map((customer) => (
                    <option
                      key={customer.id}
                      value={customer.id}
                    >
                      {customer.name}
                    </option>
                  ))}

                </select>

              </div>

              {/* =================================================
                  SITE
              ================================================= */}

              <div className="form-group full-width">

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >

                  <label
                    htmlFor="siteId"
                    style={{ marginBottom: 0 }}
                  >
                    Site *
                  </label>

                  <button
                    type="button"
                    onClick={handleOpenSiteModal}
                    disabled={
                      !formData.customerId ||
                      loading ||
                      creatingSite
                    }
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "#17458f",
                      fontWeight: "700",
                      cursor: formData.customerId
                        ? "pointer"
                        : "not-allowed",
                      padding: 0,
                    }}
                  >
                    + Create New Site
                  </button>

                </div>

                <select
                  id="siteId"
                  name="siteId"
                  value={formData.siteId}
                  onChange={handleChange}
                  disabled={
                    !formData.customerId ||
                    loadingSites ||
                    loading ||
                    creatingSite
                  }
                  required
                >

                  <option value="">
                    {!formData.customerId
                      ? "Select customer first"
                      : loadingSites
                      ? "Loading sites..."
                      : sites.length === 0
                      ? "No sites available - create one"
                      : "Select site"}
                  </option>

                  {sites.map((site) => (
                    <option
                      key={site.id}
                      value={site.id}
                    >
                      {site.name}
                    </option>
                  ))}

                </select>

                {formData.customerId &&
                  !loadingSites &&
                  sites.length === 0 && (
                    <p
                      style={{
                        marginTop: "8px",
                        color: "#c0392b",
                        fontSize: "14px",
                      }}
                    >
                      This customer has no sites.
                      Click "+ Create New Site" to add one.
                    </p>
                  )}

              </div>

              {/* =================================================
                  TITLE
              ================================================= */}

              <div className="form-group full-width">

                <label htmlFor="title">
                  Title *
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Example: AC Repair Required"
                  disabled={loading}
                  maxLength={200}
                  required
                />

              </div>

              {/* =================================================
                  DESCRIPTION
              ================================================= */}

              <div className="form-group full-width">

                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the service required..."
                  rows="5"
                  disabled={loading}
                />

              </div>

              {/* =================================================
                  PRIORITY
              ================================================= */}

              <div className="form-group">

                <label htmlFor="priority">
                  Priority
                </label>

                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  disabled={loading}
                >

                  <option value="LOW">
                    LOW
                  </option>

                  <option value="MEDIUM">
                    MEDIUM
                  </option>

                  <option value="HIGH">
                    HIGH
                  </option>

                </select>

              </div>

              {/* =================================================
                  DATE
              ================================================= */}

              <div className="form-group">

                <label htmlFor="scheduledDate">
                  Scheduled Date
                </label>

                <input
                  id="scheduledDate"
                  name="scheduledDate"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  disabled={loading}
                />

              </div>

            </div>

            {/* =================================================
                BUTTONS
            ================================================= */}

            <div className="form-actions">

              <button
                type="button"
                className="secondary-btn"
                onClick={() =>
                  navigate("/work-orders")
                }
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-btn"
                disabled={
                  loading ||
                  !formData.customerId ||
                  !formData.siteId
                }
              >
                {loading
                  ? "Creating..."
                  : "Create Work Order"}
              </button>

            </div>

          </form>

        </section>

      </main>

      {/* =======================================================
          CREATE SITE MODAL
      ======================================================= */}

      {showSiteModal && (

        <div className="modal-overlay">

          <div
            className="modal-container"
            style={{
              maxWidth: "650px",
            }}
          >

            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div className="modal-header">

              <div>
                <h2>
                  Create New Site
                </h2>

                <p>
                  Add a site for the selected customer.
                </p>
              </div>

              <button
                type="button"
                className="modal-close-btn"
                onClick={handleCloseSiteModal}
                disabled={creatingSite}
              >
                ×
              </button>

            </div>

            {/* =================================================
                SITE ERROR
            ================================================= */}

            {siteError && (
              <div className="form-error">
                {siteError}
              </div>
            )}

            {/* =================================================
                SITE FORM
            ================================================= */}

            <form
              className="work-order-form"
              onSubmit={handleCreateSite}
            >

              {/* SITE NAME */}

              <div className="form-group">

                <label htmlFor="siteName">
                  Site Name *
                </label>

                <input
                  id="siteName"
                  name="name"
                  type="text"
                  value={siteData.name}
                  onChange={handleSiteChange}
                  placeholder="Example: ABC Main Office"
                  disabled={creatingSite}
                  maxLength={150}
                  required
                />

              </div>

              {/* ADDRESS */}

              <div className="form-group">

                <label htmlFor="siteAddress">
                  Address
                </label>

                <input
                  id="siteAddress"
                  name="address"
                  type="text"
                  value={siteData.address}
                  onChange={handleSiteChange}
                  placeholder="Enter site address"
                  disabled={creatingSite}
                />

              </div>

              {/* CITY + STATE */}

              <div className="form-row">

                <div className="form-group">

                  <label htmlFor="siteCity">
                    City
                  </label>

                  <input
                    id="siteCity"
                    name="city"
                    type="text"
                    value={siteData.city}
                    onChange={handleSiteChange}
                    placeholder="Enter city"
                    disabled={creatingSite}
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="siteState">
                    State
                  </label>

                  <input
                    id="siteState"
                    name="state"
                    type="text"
                    value={siteData.state}
                    onChange={handleSiteChange}
                    placeholder="Enter state"
                    disabled={creatingSite}
                  />

                </div>

              </div>

              {/* POSTAL CODE */}

              <div className="form-group">

                <label htmlFor="postalCode">
                  Postal Code
                </label>

                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  value={siteData.postalCode}
                  onChange={handleSiteChange}
                  placeholder="Enter postal code"
                  disabled={creatingSite}
                  maxLength={20}
                />

              </div>

              {/* MODAL BUTTONS */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={handleCloseSiteModal}
                  disabled={creatingSite}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={creatingSite}
                >
                  {creatingSite
                    ? "Creating Site..."
                    : "Create Site"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default CreateWorkOrder;