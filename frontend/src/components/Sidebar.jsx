import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "▦" },
    { name: "Work Orders", path: "/work-orders", icon: "▤" },
    { name: "Customers", path: "/customers", icon: "♙" },
    { name: "Sites", path: "/sites", icon: "⌂" },
    { name: "Technicians", path: "/technicians", icon: "♟" },
  ];

  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <h2>KEYSTONE</h2>
        <span>Service Management</span>
      </div>

      <nav className="sidebar-nav">

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}

      </nav>

      <div className="sidebar-bottom">

        <button className="logout-btn" onClick={handleLogout}>
          <span className="nav-icon">↪</span>
          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;