import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const emptyForm = {
  customerId: "",
  name: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
};

function Sites() {
  const [customers, setCustomers] = useState([]);
  const [sites, setSites] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
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
      return;
    }

    setLoadingCustomers(true);

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
    } catch (err) {
      console.error("Error loading customers:", err);
      setError("Unable to load customers.");
    } finally {
      setLoadingCustomers(false);
    }
  };

  // =========================================================
  // LOAD ALL SITES
  // =========================================================

  const loadSites = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not logged in.");
      setLoading(false);
      return;
    }

    try {
      const customerResponse = await axios.get(
        `${API_BASE_URL}/customers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const customerList = customerResponse.data;

      setCustomers(customerList);

      const siteRequests = customerList.map((customer) =>
        axios.get(
          `${API_BASE_URL}/customers/${customer.id}/sites`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      );

      const responses = await Promise.all(siteRequests);

      const allSites = [];

      responses.forEach((response) => {
        if (Array.isArray(response.data)) {
          allSites.push(...response.data);
        }
      });

      setSites(allSites);
      setError("");
    } catch (err) {
      console.error("Error loading sites:", err);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please login again.");
      } else {
        setError("Unable to load sites.");
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
      loadSites();
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

    if (customers.length === 0) {
      loadCustomers();
    }
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
  // FORM CHANGE
  // =========================================================

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // CREATE SITE
  // =========================================================

  const handleCreateSite = async (event) => {
    event.preventDefault();

    setFormError("");

    if (!formData.customerId) {
      setFormError("Please select a customer.");
      return;
    }

    if (!formData.name.trim()) {
      setFormError("Please enter a site name.");
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
        `${API_BASE_URL}/customers/${formData.customerId}/sites`,
        {
          name: formData.name.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          postalCode: formData.postalCode.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const selectedCustomer = customers.find(
        (customer) =>
          String(customer.id) === String(formData.customerId)
      );

      const newSite = {
        ...response.data,
        customer: response.data.customer || selectedCustomer,
      };

      setSites((previous) => [...previous, newSite]);

      setFormData(emptyForm);
      setShowModal(false);
      setFormError("");
      setError("");
    } catch (err) {
      console.error("Error creating site:", err);

      if (err.response?.data?.message) {
        setFormError(err.response.data.message);
      } else if (err.response?.data) {
        setFormError(
          typeof err.response.data === "string"
            ? err.response.data
            : "Unable to create site."
        );
      } else if (err.response?.status === 401) {
        setFormError(
          "Your session has expired. Please login again."
        );
      } else {
        setFormError(
          "Unable to create site. Please try again."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE SITE
  // =========================================================

  const handleDeleteSite = async (siteId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this site?"
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
        `${API_BASE_URL}/sites/${siteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSites((previous) =>
        previous.filter((site) => site.id !== siteId)
      );

      setError("");
    } catch (err) {
  console.error("Error deleting site:", err);

  if (err.response?.data?.message) {
    setError(err.response.data.message);
  } else if (err.response?.status === 401) {
    setError("Your session has expired. Please login again.");
  } else if (err.response?.status === 403) {
    setError("You do not have permission to delete this site.");
  } else if (err.response?.status === 404) {
    setError("Site not found.");
  } else {
    setError(
      `Unable to delete site. Server returned ${err.response?.status || "an error"}.`
    );
  }
}
  };

  // =========================================================
  // GET CUSTOMER NAME
  // =========================================================

  const getCustomerName = (site) => {
    if (site.customer?.name) {
      return site.customer.name;
    }

    const customer = customers.find(
      (item) =>
        String(item.id) === String(site.customer?.id)
    );

    return customer?.name || "—";
  };

  // =========================================================
  // JSX
  // =========================================================

  return (
    <div className="app">
      <main className="main-content">

        {/* PAGE HEADER */}

        <div className="page-header">
          <h1>Sites</h1>

          <p>
            Manage customer service locations and sites.
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* SITES CARD */}

        <section className="section-card">

          <div className="section-header">

            <div>
              <h2>All Sites</h2>

              <p>
                {sites.length} sites found
              </p>
            </div>

            <button
              type="button"
              className="primary-btn"
              onClick={handleOpenModal}
            >
              + Create Site
            </button>

          </div>

          {/* LOADING */}

          {loading ? (
            <div className="loading">
              Loading sites...
            </div>
          ) : sites.length === 0 ? (
            <div className="loading">
              No sites found.
            </div>
          ) : (

            <div className="table-container">

              <table className="work-orders-table">

                <thead>
                  <tr>
                    <th>Site Name</th>
                    <th>Customer</th>
                    <th>Address</th>
                    <th>City</th>
                    <th>State</th>
                    <th>Postal Code</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {sites.map((site) => (

                    <tr key={site.id}>

                      <td className="work-order-code">
                        {site.name}
                      </td>

                      <td className="customer-name">
                        {getCustomerName(site)}
                      </td>

                      <td>
                        {site.address || "—"}
                      </td>

                      <td>
                        {site.city || "—"}
                      </td>

                      <td>
                        {site.state || "—"}
                      </td>

                      <td>
                        {site.postalCode || "—"}
                      </td>

                      <td>
                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() =>
                            handleDeleteSite(site.id)
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
          CREATE SITE MODAL
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
                <h2>Create Site</h2>

                <p>
                  Add a new service location for a customer.
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
              onSubmit={handleCreateSite}
            >

              {/* CUSTOMER */}

              <div className="form-group">

                <label htmlFor="site-customer">
                  Customer
                </label>

                <select
                  id="site-customer"
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleInputChange}
                  disabled={
                    loadingCustomers || saving
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

              {/* SITE NAME */}

              <div className="form-group">

                <label htmlFor="site-name">
                  Site Name
                </label>

                <input
                  id="site-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter site name"
                  maxLength={150}
                  disabled={saving}
                  required
                />

              </div>

              {/* ADDRESS */}

              <div className="form-group">

                <label htmlFor="site-address">
                  Address
                </label>

                <input
                  id="site-address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter site address"
                  maxLength={255}
                  disabled={saving}
                />

              </div>

              {/* CITY + STATE */}

              <div className="form-row">

                <div className="form-group">

                  <label htmlFor="site-city">
                    City
                  </label>

                  <input
                    id="site-city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    maxLength={100}
                    disabled={saving}
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="site-state">
                    State
                  </label>

                  <input
                    id="site-state"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Enter state"
                    maxLength={100}
                    disabled={saving}
                  />

                </div>

              </div>

              {/* POSTAL CODE */}

              <div className="form-group">

                <label htmlFor="site-postalCode">
                  Postal Code
                </label>

                <input
                  id="site-postalCode"
                  name="postalCode"
                  type="text"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="Enter postal code"
                  maxLength={20}
                  disabled={saving}
                />

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

export default Sites;