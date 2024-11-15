// components/Navbar.js
import { useRouter } from 'next/router';
import NavbarLanding from './NavbarLanding';
import NavbarDashboard from './NavbarDashboard';
import Link from 'next/link';

const Navbar = ({username}) => {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <nav className="navbar navbar-expand-lg bg-light fixed-top shadow">
      <div className="container-fluid" style={{ width: '90%' }}>
        <Link href="#" className="navbar-brand text-black fs-4 fw-bold">
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
        {currentPath === '/' ? (
          <NavbarLanding />
        ) : currentPath === '/dashboard' ? (
          <NavbarDashboard 
            username={username} />
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
