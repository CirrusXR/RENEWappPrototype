import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const auth = getAuth();

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.querySelector('form');
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                updateProfile(user, { displayName: fullName })
                    .then(() => {
                        console.log('User profile updated');
                        window.location.href = 'home.html';
                    })
                    .catch((error) => {
                        console.error('Profile update error:', error);
                        // even if profile update fails, redirect to home
                        window.location.href = 'home.html';
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Sign up error:', errorCode, errorMessage);
                alert(`Error: ${errorMessage}`);
            });
    });
});