// components/NavbarDashboard.js
import Image from 'next/image';

const NavbarDashboard = ({ username }) => {
  const handleLogout = () => {
    window.location.href = "https://tasktracker.auth.eu-south-2.amazoncognito.com/logout?client_id=66v9ved46iqmn4ffs9saan6kc&logout_uri=http://localhost:3000";
  };

  return (
    <div className="navbar-nav ms-auto">
      <ul className="navbar-nav ms-auto d-flex flex-row align-items-center">
        <li className="nav-item d-flex align-items-center mx-0 mx-lg-1">
          <Image src="/default.jpg" alt="User" width={40} height={40} className="rounded-circle" />
          <span className="nav-link pe-2 text-black fs-6 fw-bold">{username}</span>
        </li>
        <li className="nav-item mx-0 mx-lg-1">
          <button
            onClick={handleLogout}
            className="nav-link py-2 px-3 rounded-pill tt-bgcolor text-white fs-6 fw-bold"
            style={{ background: 'none', border: 'none' }}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default NavbarDashboard;
