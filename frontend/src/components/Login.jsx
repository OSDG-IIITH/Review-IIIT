import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, Box } from '@mui/material';
import { api, prefix_api } from '../api';

const LoginButton = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkLoginStatus = async () => {
            setLoading(true);
            try {
                const response = await api.get('/has_login');
                setIsLoggedIn(response.data);
            } catch (err) {
                setError(err.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        checkLoginStatus();
    }, []);

    const handleAuthAction = async () => {
        window.location.href = prefix_api(isLoggedIn ? '/logout' : '/login');
    };

    // UI rendering
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <Button
                variant="contained"
                color="secondary"
                onClick={handleAuthAction}
                disabled={loading || isLoggedIn === null}
                sx={{ marginTop: 2, minWidth: 150, size: "large" }}
            >
                {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                    isLoggedIn !== null && (isLoggedIn ? 'Logout' : 'Login')
                )}
            </Button>
        </Box>
    );
};

export default LoginButton;
