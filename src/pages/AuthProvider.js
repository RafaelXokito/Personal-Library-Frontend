import React, { createContext, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const history = useNavigate();
    const location = useLocation();

    const refreshTokenFunc = (history) => {
        let config = {
            method: 'post',
            url: 'http://localhost:8080/api/auth/token',
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                "refreshToken": localStorage.getItem("refreshToken")
            }
        };


        console.log("config: ", config);
    
        axios.request(config)
            .then((response) => {
                if (response.data) {
                    // Store the tokens and userId in local storage or state
                    localStorage.setItem("accessToken", response.data.accessToken);
                    localStorage.setItem("refreshToken", response.data.refreshToken);
                    localStorage.setItem("userId", response.data.userId);
                    localStorage.setItem("isLoggedIn", true);

                    // Redirect to the home after successful login
                    history('/')

                    console.log("Token refreshed successful!");
                }
            })
            .catch((error) => {
                // Handle error. If the token is invalid, you might want to remove it from local storage.
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.setItem("isLoggedIn", false);
    
                console.error("Authentication check failed:", error.message);
                history('/login');
            });
    }

    const checkAuthentication = async () => {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        // If there's no accessToken in the localStorage, then user is not authenticated.
        
        if (!accessToken) {
            if (refreshToken) {
                refreshTokenFunc(history);
            } else {
                localStorage.setItem("isLoggedIn", false);

                if (location.pathname !== '/login' && location.pathname !== '/register') {
                    history('/');
                }
            }
            return false;
        }
    
        // Set up axios defaults
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        
        try {
            // Make the GET request to the /me endpoint
            const response = await axios.get("http://localhost:8080/api/auth/me");
    
            if (response.data) {
                // Store the user data or process as required
                localStorage.setItem("userData", JSON.stringify(response.data));
                localStorage.setItem("isLoggedIn", true);
            }
        } catch (error) {
            // Try to refresh the token
            refreshTokenFunc(history);

            return false;
        }
      };

    useEffect(() => {
        checkAuthentication();
    }, []);

    return (
        <AuthContext.Provider value={{ /* any values you want to pass down */ }}>
            {children}
        </AuthContext.Provider>
    );
};

