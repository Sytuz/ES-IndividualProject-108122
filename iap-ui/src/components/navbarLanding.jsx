import Link from 'next/link';

const NavbarLanding = () => {

  const handleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/cognito";
  };

  return (
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav ms-auto">
        <li className="nav-item mx-0 mx-lg-1">
          <Link href="/register" className="register-button nav-link py-2 px-0 px-lg-3 rounded-pill border text-black fs-6 fw-bold">
            Register
          </Link>
        </li>
        <li className="nav-item mx-0 mx-lg-1">
          <button onClick={handleLogin} className="login-button nav-link py-2 px-0 px-lg-3 rounded-pill tt-bgcolor text-white fs-6 fw-bold">
            Login
          </button>
        </li>
      </ul>
    </div>
  );
};

export default NavbarLanding;
