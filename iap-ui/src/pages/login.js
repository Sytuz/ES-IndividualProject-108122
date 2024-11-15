import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { jwtDecode } from "jwt-decode";    
import Cookies from 'js-cookie'; // Import js-cookie
import { API_URL } from '../../api_url';

const Login = () => {
    const router = useRouter();

    useEffect(() => {
        const { code } = router.query;

        if (code) {
            // Exchange code for tokens by calling backend using fetch
            fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    const { accessToken, refreshToken, idToken } = data;

                    // Store tokens in cookies
                    Cookies.set('idToken', idToken, { expires: 7, secure: true, sameSite: 'Strict' });

                    // Decode the access token to get the username (or other claims)
                    const decodedToken = jwtDecode(idToken);
                    console.log('Decoded token:', decodedToken);
                    const username = decodedToken['cognito:username']; // This is usually the claim for the username in Cognito

                    console.log('Username:', username);

                    // Redirect to authenticated dashboard
                    router.push('/dashboard');
                })
                .catch(error => console.error("Token exchange failed", error));
        }
    }, [router.query]);

    return (
        <div style={styles.container}>
            <div style={styles.spinner}></div>
            <p style={styles.message}>Authenticating... Please wait.</p>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f4f4f9',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
    },
    spinner: {
        width: '50px',
        height: '50px',
        border: '6px solid #ddd',
        borderTop: '6px solid #0070f3',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    message: {
        marginTop: '20px',
        fontSize: '18px',
        color: '#333',
    },
};

// Add keyframes for spinner animation
if (typeof document !== "undefined") {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.append(style);
}

export default Login;
