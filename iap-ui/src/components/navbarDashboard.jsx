// components/NavbarDashboard.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { API_URL } from '../../api_url';
import Image from 'next/image';

const NavbarDashboard = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const sessionToken = sessionStorage.getItem('sessionToken');

    // Fetch username from API using the session token
    const fetchUsername = async () => {
        try {
          const response = await fetch(`${API_URL}/users/username`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${sessionToken}`,
            },
          });
      
          if (response.ok) {
            const username = await response.text(); // Directly parse the plain text response
            setUsername(username);
          } else {
            console.error('Failed to fetch username');
            router.push('/login'); // Redirect to login if not authorized
          }
        } catch (error) {
          console.error('Error fetching username:', error);
          router.push('/login'); // Redirect on error
        }
      };      

    if (sessionToken) {
      fetchUsername();
    } else {
      router.push('/login');
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('sessionToken');
    router.push('/');
  };

  return (
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav ms-auto">
        <li className="nav-item d-flex align-items-center mx-0 mx-lg-1">
          <Image src="/default.jpg" alt="User" width={40} height={40} className="rounded-circle me-2" />
          <span className="nav-link py-3 text-black fs-5 fw-bold">{username}</span>
        </li>
        <li className="nav-item mx-0 mx-lg-1">
          <button
            onClick={handleLogout}
            className="nav-link py-3 px-0 px-lg-3 rounded-pill tt-bgcolor text-white fs-5 fw-bold"
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
