import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import api from '../services/api';
import AuthService from '../services/auth.service';

function GoogleLoginComponent() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [registerSuccess, setRegisterSuccess] = useState(false);
    const [loading, setLoading] = useState(false); // Nouvel état pour gérer le chargement initial

    const login = useGoogleLogin({
        onSuccess: (response) => setUser(response),
        onError: (error) => console.error('Login Failed:', error)
    });

    useEffect(() => {
        if (user) {
            setLoading(true); // Activer l'état de chargement

            api
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then((res) => {
                    // Generate username from initials of user's name
                    const initials = res.data.name.split(' ')[0];
                    console.log('Initials:', initials);
                    console.log('Email:', res.data.email);
                    setProfile(res.data);
                    // Register the user after successful Google login with the generated username
                    AuthService.register(initials, res.data.email, res.data.given_name)
                        .then(() => {
                            setRegisterSuccess(true);
                            // Log in automatically after successful registration
                            AuthService.login(initials, res.data.given_name).then(() => {
                                // Redirect to profile page after successful login
                                window.location.href = '/profile';
                            });
                        })
                        .catch((error) => {
                            if (error.response && error.response.status === 400) {
                                // User is already registered, proceed to login
                                AuthService.login(initials, res.data.given_name).then(() => {
                                    // Redirect to profile page after successful login
                                    window.location.href = '/profile';
                                });
                            } else {
                                console.error('Registration Failed:', error);
                            }
                        })
                        .finally(() => {
                            setLoading(false); // Marquer le chargement comme terminé une fois les opérations terminées
                        });
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false); // Marquer le chargement comme terminé en cas d'erreur
                });
        }
    }, [user]);

    const logOut = () => {
        googleLogout();
        setUser(null);
        setProfile(null);
    };

    return (
        <div>
            {loading ? ( // Afficher un indicateur de chargement si les données sont en cours de chargement
                <p>Loading...</p>
            ) : profile ? ( // Afficher le profil une fois que les données sont disponibles
                <div>
                    <img src={profile.picture} alt="User" />
                    <h3>User Logged in</h3>
                    <p>Name: {profile.name}</p>
                    <p>Email Address: {profile.email}</p>
                    <p>Name: {profile.given_name}</p>
                    {registerSuccess ? (
                        <button onClick={logOut}>Log out</button>
                    ) : (
                        <p>Registering...</p>
                    )}
                </div>
            ) : (
                <button onClick={login}>Sign in with Google 🚀</button>
            )}
        </div>
    );
}

export default GoogleLoginComponent;
