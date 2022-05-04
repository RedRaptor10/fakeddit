import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, addDoc } from "firebase/firestore";
import "../styles/LogIn.css";

const LogIn = ({setLogInForm, setSignUpForm, logIn, nightMode}) => {
    const [form, setForm] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = event => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const processLogIn = event => {
        event.preventDefault();

        // Check if username exists
        const checkUsername = async () => {
            const db = getFirestore();
            const q = query(collection(db, "users"), where("username", "==", form.username));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                let email = '';
                querySnapshot.forEach((doc) => {
                    email = doc.data().email;
                });

                return email;
            } else {
                throw new Error('Invalid username');
            }
        };

        // Log in
        const logIn = async (email, password) => {
            const auth = getAuth();
            signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                setLogInForm(false);
            })
            .catch((error) => {
                if (error.code === 'auth/wrong-password') {
                    setError('Wrong password.');
                }
                console.log(error);
            });
        };

        // Check if any field is empty
        if (form.username === '' || form.password === '') {
            setError('All fields required.');
        } else {
            checkUsername()
            .then((email) => {
                logIn(email, form.password);
            })
            .catch((error) => {
                setError(error.message);
            });
        }
    };

    const processSignUp = event => {
        event.preventDefault();

        // Check if username exists
        const checkUsername = async () => {
            const db = getFirestore();
            const q = query(collection(db, "users"), where("username", "==", form.username));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                throw new Error('Username already exists.');
            }
        };

        // Create Account
        const createAccount = async () => {
            const db = getFirestore();
            await addDoc(collection(db, "users"), {
                email: form.email,
                username: form.username,
                password: form.password,
                upvoted: [],
                downvoted: []
            });
        };

        // Check if any field is empty and if passwords match
        if (form.email === '' || form.username === '' || form.password === '' || form.confirmPassword === '') {
            setError('All fields required.');
        } else if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.');
        } else {
            checkUsername()
            .then(() => {
                // Create Auth Account
                const auth = getAuth();
                createUserWithEmailAndPassword(auth, form.email, form.password)
                .then(createAccount)
                .then(() => { setSignUpForm(false); })
                .catch((error) => {
                    if (error.code === 'auth/weak-password') {
                        setError('Password must have at least 6 characters.');
                    } else if (error.code === 'auth/invalid-email') {
                        setError('Invalid email.');
                    } else if (error.code === 'auth/email-already-in-use') {
                        setError('Email in use.');
                    }
                    console.log(error);
                });
            })
            .catch((error) => {
                setError(error.message);
                console.log(error);
            });
        }
    };

    const setError = message => {
        let errorMsg = document.querySelector('.error-msg');
        if (!errorMsg) {
            const submitBtn = document.querySelector('.log-in-form-submit-btn');
            errorMsg = document.createElement('div');
            errorMsg.classList.add('error-msg');
            submitBtn.parentNode.insertBefore(errorMsg, submitBtn);
        }

        errorMsg.innerHTML = message;
    };

    return (
        <div className={!nightMode ? "log-in" : "log-in log-in-dark"}>
            <div className="canvas log-in-canvas" />
            <div className="log-in-form-container">
                <div className="log-in-form-close">
                    <div className="log-in-form-close-btn" onClick={() => {
                        logIn ? setLogInForm(false) : setSignUpForm(false);
                    }} />
                </div>
                {logIn ?
                <form className="log-in-form" action="">
                    <h1>Login</h1>
                    <div>By continuing, you agree to our <span className="link">User Agreement</span> and <span className="link">Privacy Policy</span>.</div>
                    <input type="text" name="username" value={form.username} placeholder="Username" onChange={handleChange} />
                    <input type="password" name="password" value={form.password} placeholder="Password" onChange={handleChange} />
                    <button type="submit" className="log-in-form-submit-btn" onClick={processLogIn}>Log In</button>
                    <div className="log-in-form-bottom">
                        <div>Forgot your <span className="link">username</span> or <span className="link">password</span>?</div>
                        <div>New to Fakeddit? <span className="link" onClick={() => {
                            setLogInForm(false);
                            setSignUpForm(true);
                        }}>SIGN UP</span></div>
                    </div>
                </form>
                :
                <form className="log-in-form" action="">
                    <h1>Sign up</h1>
                    <div>By continuing, you are setting up a Fakeddit account and agree to our <span className="link">User Agreement</span> and <span className="link">Privacy Policy</span>.</div>
                    <input type="email" name="email" value={form.email} placeholder="Email" onChange={handleChange} />
                    <input type="text" name="username" value={form.username} placeholder="Username" onChange={handleChange} />
                    <input type="password" name="password" value={form.password} placeholder="Password" onChange={handleChange} />
                    <input type="password" name="confirmPassword" value={form.confirmPassword} placeholder="Confirm Password" onChange={handleChange} />
                    <button type="submit" className="log-in-form-submit-btn" onClick={processSignUp}>Continue</button>
                    <div className="log-in-form-bottom">
                        <div>Already a Fakedditor? <span className="link" onClick={() => {
                            setLogInForm(true);
                            setSignUpForm(false);
                        }}>LOG IN</span></div>
                    </div>
                </form>
                }
            </div>
        </div>
    );
};

export default LogIn;