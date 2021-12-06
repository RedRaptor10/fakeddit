import React from "react";
import "../styles/LogIn.css";

const LogIn = ({remove, toggleLogInForm, toggleSignUpForm}) => {
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
                <div className="log-in-form">
                    <h1>Login</h1>
                    <div>By continuing, you agree to our <span className="link">User Agreement</span> and <span className="link">Privacy Policy</span>.</div>
                    <input type="text" placeholder="Username" />
                    <input type="text" placeholder="Password" />
                    <button className="log-in-form-submit-btn">Log In</button>
                    <div className="log-in-form-bottom">
                        <div>Forgot your <span className="link">username</span> or <span className="link">password</span>?</div>
                        <div>New to Fakeddit? <span className="link" onClick={toggleForm}>SIGN UP</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogIn;