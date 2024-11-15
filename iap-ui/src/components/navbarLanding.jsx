const NavbarLanding = () => {

  const handleLogin = () => {
    window.location.href = "https://tasktracker.auth.eu-south-2.amazoncognito.com/login?response_type=code&client_id=66v9ved46iqmn4ffs9saan6kc&redirect_uri=http://localhost:3000/login";
  };

  const handleRegister = () => {
    window.location.href = "https://tasktracker.auth.eu-south-2.amazoncognito.com/signup?response_type=code&client_id=66v9ved46iqmn4ffs9saan6kc&redirect_uri=http://localhost:3000/login";
  };

  return (
    <div className="navbar-nav ms-auto">
      <ul className="navbar-nav ms-auto">
        <li>
          <button onClick={handleRegister} className="register-button nav-link py-2 px-3 rounded-pill border text-black fs-6 fw-bold">
            Register
          </button>
        </li>
        <li className="nav-item mx-1">
          <button onClick={handleLogin} className="login-button nav-link py-2 px-3 rounded-pill tt-bgcolor text-white fs-6 fw-bold">
            Login
          </button>
        </li>
      </ul>
    </div>
  );
};

export default NavbarLanding;
