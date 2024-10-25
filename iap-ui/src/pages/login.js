import Link from 'next/link';
import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { API_URL } from '../../api_url';

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    document.getElementById('login-error').classList.add('visually-hidden');
    try {
      fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "email": email,
          "password": password,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.statusText || 'HTTP error, status = ' + response.status);
          }
          return response.json();
        })
        .then((data) => {
            sessionStorage.setItem('sessionToken', data.token);
          router.push('/dashboard');
        })
        .catch((error) => {
          console.error(error);
          const loginError = document.getElementById('login-error');
          loginError.classList.remove('visually-hidden');
        });


    } catch (error) {
      console.error(error);
      const loginError = document.getElementById('login-error');
      loginError.classList.remove('visually-hidden');
    }
  };

  return (
    <main>
      <Head>
        <title>TaskTracker | Login</title>
      </Head>
      <div className="d-flex justify-content-center align-items-center vh-100 flex-column">
        <div className="w-100" style={{ maxWidth: '450px' }}>
          <button
            className="btn text-secondary fw-bold fs-6"
            onClick={() => router.push('/')}
          >
            <span>&larr;</span> Back
          </button>
        </div>
        <div className="card p-4" style={{ width: '450px' }}>
          <h1 className="text-center mb-5 fw-bold">TaskTracker</h1>
          <form className='fs-4 mt-1'>
            <div className="form-group mb-3">
            <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            </div>
            <div className="form-group mb-4">
            <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            </div>
            <div id="login-error" className='btn btn-outline-warning visually-hidden text-center fs-5 my-3 w-100'>
                &nbsp;
                <span>Invalid credentials</span>
            </div>
            {/* Google button */}
            <button type="button" className="btn btn-outline-danger w-100" style={{marginBottom: "150px"}}>
              <i className="bi bi-google me-2"></i> Connect with Google
            </button>
            <button type="button" onClick={handleLogin} className="btn tt-bgcolor text-white w-100 mb-3 mt- fs-4 fw-bold login-button">Login</button>
          </form>
          <p className="text-center   ">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-black tt-color fw-bold">
              Register
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
