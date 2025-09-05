// GoogleSignInButton.js
import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase";
import { useNavigate } from "react-router-dom";
import logo from '../assets/Google-icon.png';

const GoogleSignInButton = () => {
    const navigate = useNavigate();
    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user.getIdToken();
            console.log("Google Sign-In Successful:", auth.currentUser.getIdToken());
            navigate("/home")
        } catch (error) {
            console.error("Google Sign-In Error:", error);
        }
    };

    return (
        <div className="Google-login-provider-button"  onClick={handleGoogleSignIn}>
            
            <img src={logo} alt="Google Icon"></img>
            Sign in with Google
        
        </div>
    );
};

export default GoogleSignInButton;
