function Navbar() {
  return (
    <header className="navbar">

      <div>
        <h2>Dashboard</h2>
        <p>Service Management System</p>
      </div>

      <div className="navbar-user">

        <div className="user-avatar">
          B
        </div>

        <div className="user-info">
          <strong>Bikram Sarma</strong>
          <span>Manager</span>
        </div>

      </div>

    </header>
  );
}

export default Navbar;