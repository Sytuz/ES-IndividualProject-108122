import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-light fixed-top shadow">
      <div className="container-fluid" style={{width: '90%'}}>
        <Link href="/" className="navbar-brand text-black fs-3 fw-bold">
          TaskTracker
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item mx-0 mx-lg-1">
              <Link href="/register" className="nav-link py-3 px-0 px-lg-3 rounded-pill border text-black fs-5 fw-bold">
                Register
              </Link>
            </li>
            <li className="nav-item mx-0 mx-lg-1">
              <Link href="/login" className="nav-link py-3 px-0 px-lg-3 rounded-pill tt-bgcolor text-white fs-5 fw-bold">
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;