import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://keystone-field-service-management-ol2u.onrender.com/api";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  specialization: "",
  active: true,
};

function Technicians() {
  const [technicians, setTechnicians] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState(emptyForm);

  // =====================================================
  // LOAD TECHNICIANS
  // =====================================================

  useEffect(() => {
    const loadTechnicians = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You are not logged in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${API_BASE_URL}/technicians`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTechnicians(response.data);
        setError("");
      } catch (err) {
        console.error("Error loading technicians:", err);

        if (err.response?.status === 401) {
          setError(
            "Your session has expired. Please login again."
          );
        } else {
          setError("Unable to load technicians.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadTechnicians();
  }, []);

  // =====================================================
  // OPEN MODAL
  // =====================================================

  const handleOpenModal = () => {
    setFormData(emptyForm);
    setFormError("");
    setShowModal(true);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const handleCloseModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    setFormError("");
    setFormData(emptyForm);
  };

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // CREATE TECHNICIAN
  // =====================================================

  const handleCreateTechnician = async (event) => {
    event.preventDefault();

    setFormError("");

    if (!formData.name.trim()) {
      setFormError("Please enter technician name.");
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
        `${API_BASE_URL}/technicians`,
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          specialization:
            formData.specialization.trim(),
          active: formData.active,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setTechnicians((previous) => [
        ...previous,
        response.data,
      ]);

      setFormData(emptyForm);
      setShowModal(false);
      setError("");
    } catch (err) {
      console.error(
        "Error creating technician:",
        err
      );

      if (err.response?.data?.message) {
        setFormError(err.response.data.message);
      } else {
        setFormError(
          "Unable to create technician."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <div className="app">

      <main className="main-content">

        <div className="page-header">
          <h1>Technicians</h1>

          <p>
            Manage service technicians and their
            specializations.
          </p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <section className="section-card">

          <div className="section-header">

            <div>
              <h2>All Technicians</h2>

              <p>
                {technicians.length} technicians found
              </p>
            </div>

            <button
              type="button"
              className="primary-btn"
              onClick={handleOpenModal}
            >
              + Create Technician
            </button>

          </div>

          {loading ? (
            <div className="loading">
              Loading technicians...
            </div>
          ) : technicians.length === 0 ? (
            <div className="loading">
              No technicians found.
            </div>
          ) : (

            <div className="table-container">

              <table className="work-orders-table">

                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Specialization</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {technicians.map((technician) => (

                    <tr key={technician.id}>

                      <td className="customer-name">
                        {technician.name}
                      </td>

                      <td>
                        {technician.email || "—"}
                      </td>

                      <td>
                        {technician.phone || "—"}
                      </td>

                      <td>
                        {technician.specialization || "—"}
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            technician.active
                              ? "badge-completed"
                              : "badge-high"
                          }`}
                        >
                          {technician.active
                            ? "ACTIVE"
                            : "INACTIVE"}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="primary-btn"
                          onClick={() =>
                            console.log(
                              "Open technician:",
                              technician.id
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
          CREATE TECHNICIAN MODAL
      ===================================================== */}

      {showModal && (

        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              handleCloseModal();
            }
          }}
        >

          <div className="modal-container">

            <div className="modal-header">

              <div>
                <h2>Create Technician</h2>

                <p>
                  Add a new service technician.
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

            {formError && (
              <div className="form-error">
                {formError}
              </div>
            )}

            <form
              className="work-order-form"
              onSubmit={handleCreateTechnician}
            >

              <div className="form-group">

                <label htmlFor="technician-name">
                  Name
                </label>

                <input
                  id="technician-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter technician name"
                  maxLength={150}
                  disabled={saving}
                  required
                />

              </div>

              <div className="form-group">

                <label htmlFor="technician-email">
                  Email
                </label>

                <input
                  id="technician-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                  maxLength={150}
                  disabled={saving}
                />

              </div>

              <div className="form-group">

                <label htmlFor="technician-phone">
                  Phone
                </label>

                <input
                  id="technician-phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  maxLength={30}
                  disabled={saving}
                />

              </div>

              <div className="form-group">

                <label htmlFor="technician-specialization">
                  Specialization
                </label>

                <input
                  id="technician-specialization"
                  name="specialization"
                  type="text"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  placeholder="Example: AC Repair"
                  maxLength={100}
                  disabled={saving}
                />

              </div>

              <div className="form-group">

                <label htmlFor="technician-active">
                  Status
                </label>

                <select
                  id="technician-active"
                  name="active"
                  value={String(formData.active)}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      active:
                        event.target.value === "true",
                    }))
                  }
                  disabled={saving}
                >
                  <option value="true">
                    Active
                  </option>

                  <option value="false">
                    Inactive
                  </option>
                </select>

              </div>

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
                    : "Create Technician"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Technicians;