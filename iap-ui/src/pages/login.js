import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();

  return (
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
            <input type="email" className="form-control" id="email" placeholder="Email" />
          </div>
          <div className="form-group mb-4">
            <input type="password" className="form-control" id="password" placeholder="Password" />
          </div>
          {/* Google button */}
          <button type="button" className="btn btn-outline-danger w-100" style={{marginBottom: "150px"}}>
            <i className="bi bi-google me-2"></i> Connect with Google
          </button>
          <button type="submit" className="btn tt-bgcolor text-white w-100 mb-3 mt- fs-4 fw-bold login-button">Login</button>
        </form>
        <p className="text-center   ">
          Don't have an account?{' '}
          <Link href="/register" className="text-black tt-color fw-bold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
