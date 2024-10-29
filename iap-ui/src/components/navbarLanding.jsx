import Link from 'next/link';

const NavbarLanding = () => {
  return (
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav ms-auto">
        <li className="nav-item mx-0 mx-lg-1">
          <Link href="/register" className="register-button nav-link py-3 px-0 px-lg-3 rounded-pill border text-black fs-5 fw-bold">
            Register
          </Link>
        </li>
        <li className="nav-item mx-0 mx-lg-1">
          <Link href="/login" className="login-button nav-link py-3 px-0 px-lg-3 rounded-pill tt-bgcolor text-white fs-5 fw-bold">
            Login
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default NavbarLanding;
