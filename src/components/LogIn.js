import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, addDoc } from "firebase/firestore";
import "../styles/LogIn.css";

const LogIn = ({remove, toggleLogInForm, toggleSignUpForm, signUp}) => {
    const [form, setForm] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    });
    const [accountCreated, setAccountCreated] = useState(false);

    const handleChange = event => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const processForm = () => {
        // Check if any field is empty and if passwords match
        if (form.email === '' || form.username === '' || form.password === '' || form.confirmPassword === '') {
            setErrorMsg('All fields required.');
        } else if (form.password !== form.confirmPassword) {
            setErrorMsg('Passwords do not match.');
        } else {
            // Check if username already exists
            (async () => {
                const db = getFirestore();
                const q = query(collection(db, "users"), where("username", "==", form.username));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    setErrorMsg('Username already exists.');
                } else {
                    // Create Auth Account
                    const auth = getAuth();
                    createUserWithEmailAndPassword(auth, form.email, form.password)
                    .then(() => {
                        // Create Account
                        (async () => {
                            await addDoc(collection(db, "users"), {
                                email: form.email,
                                username: form.username,
                                password: form.password
                            });
                        })().catch((error) => {
                            console.log(error);
                        });

                        const errorMsg = document.querySelector('.error-msg');
                        if (errorMsg) {
                            errorMsg.remove();
                        }
                        setAccountCreated(true);
                    })
                    .catch((error) => {
                        if (error.code === 'auth/weak-password') {
                            setErrorMsg('Password must have at least 6 characters.');
                        } else if (error.code === 'auth/invalid-email') {
                            setErrorMsg('Invalid email.');
                        } else if (error.code === 'auth/email-already-in-use') {
                            setErrorMsg('Email already exists.');
                        }
                        console.log(error);
                    });
                }
            })();
        }
    };

    const setErrorMsg = message => {
        let errorMsg = document.querySelector('.error-msg');
        if (!errorMsg) {
            const submitBtn = document.querySelector('.log-in-form-submit-btn');
            errorMsg = document.createElement('div');
            errorMsg.classList.add('error-msg');
            submitBtn.parentNode.insertBefore(errorMsg, submitBtn);
        }

        errorMsg.innerHTML = message;
    };

    const toggleForm = () => {
        toggleLogInForm();
        toggleSignUpForm();
    };

    return (
        <div className="log-in">
            <div className="canvas log-in-canvas" />
            <div className="log-in-form-container">
                <div className="log-in-form-close">
                    <div className="log-in-form-close-btn" onClick={remove} />
                </div>
                {!accountCreated ?
                    !signUp ?
                    <div className="log-in-form">
                        <h1>Login</h1>
                        <div>By continuing, you agree to our <span className="link">User Agreement</span> and <span className="link">Privacy Policy</span>.</div>
                        <input type="text" name="username" value={form.username} placeholder="Username" onChange={handleChange} />
                        <input type="text" name="password" value={form.password} placeholder="Password" onChange={handleChange} />
                        <button className="log-in-form-submit-btn">Log In</button>
                        <div className="log-in-form-bottom">
                            <div>Forgot your <span className="link">username</span> or <span className="link">password</span>?</div>
                            <div>New to Fakeddit? <span className="link" onClick={toggleForm}>SIGN UP</span></div>
                        </div>
                    </div>
                    :
                    <div className="log-in-form">
                        <h1>Sign up</h1>
                        <div>By continuing, you are setting up a Fakeddit account and agree to our <span className="link">User Agreement</span> and <span className="link">Privacy Policy</span>.</div>
                        <input type="text" name="email" value={form.email} placeholder="Email" onChange={handleChange} />
                        <input type="text" name="username" value={form.username} placeholder="Username" onChange={handleChange} />
                        <input type="text" name="password" value={form.password} placeholder="Password" onChange={handleChange} />
                        <input type="text" name="confirmPassword" value={form.confirmPassword} placeholder="Confirm Password" onChange={handleChange} />
                        <button className="log-in-form-submit-btn" onClick={processForm}>Continue</button>
                        <div className="log-in-form-bottom">
                            <div>Already a Fakedditor? <span className="link" onClick={toggleForm}>LOG IN</span></div>
                        </div>
                    </div>
                :
                <div className="log-in-form">
                    <h1>Sign up</h1>
                    <div>Account created successfully!</div>
                </div>
                }
            </div>
        </div>
    );
};

export default LogIn;