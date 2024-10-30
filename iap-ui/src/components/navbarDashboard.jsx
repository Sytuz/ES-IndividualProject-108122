// components/NavbarDashboard.js
import Image from 'next/image';
import router from 'next/router';

const NavbarDashboard = ({username}) => {
  const handleLogout = () => {
    sessionStorage.removeItem('sessionToken');
    router.push('/');
  };

  return (
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav ms-auto">
        <li className="nav-item d-flex align-items-center mx-0 mx-lg-1">
          <Image src="/default.jpg" alt="User" width={40} height={40} className="rounded-circle me-2" />
          <span className="nav-link py-2 text-black fs-6 fw-bold">{username}</span>
        </li>
        <li className="nav-item mx-0 mx-lg-1">
          <button
            onClick={handleLogout}
            className="nav-link py-2 px-0 px-lg-3 rounded-pill tt-bgcolor text-white fs-6 fw-bold"
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
