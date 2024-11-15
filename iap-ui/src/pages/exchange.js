import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { jwtDecode } from "jwt-decode";    
import Cookies from 'js-cookie';  // Import js-cookie
import { API_URL } from '../../api_url';

const Exchange = () => {
    const router = useRouter();

    useEffect(() => {
        const { code } = router.query;

        if (code) {
            // Optionally verify state matches a value in localStorage/sessionStorage
            // const storedState = sessionStorage.getItem('oauthState');
            // if (storedState !== state) {
            //    console.error("Invalid state parameter");
            //    return;
            // }

            // Exchange code for tokens by calling backend using fetch
            fetch(`${API_URL}/auth/exchange`, {
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
                    Cookies.set('accessToken', accessToken, { expires: 7, secure: true, sameSite: 'Strict' });
                    Cookies.set('refreshToken', refreshToken, { expires: 7, secure: true, sameSite: 'Strict' });
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

    return <div>Loading...</div>;
};

export default Exchange;
