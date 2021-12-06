import React from "react";
import "../styles/SignUp.css";

const SignUp = ({remove, toggleLogInForm, toggleSignUpForm}) => {
    const toggleForm = () => {
        toggleLogInForm();
        toggleSignUpForm();
    };

    return (
        <div className="sign-up">
            <div className="canvas sign-up-canvas" />
            <div className="sign-up-form-container">
                <div className="sign-up-form-close">
                    <div className="sign-up-form-close-btn" onClick={remove} />
                </div>
                <div className="sign-up-form">
                    <h1>Sign up</h1>
                    <div>By continuing, you are setting up a Fakeddit account and agree to our <span className="link">User Agreement</span> and <span className="link">Privacy Policy</span>.</div>
                    <input type="text" placeholder="Email" />
                    <button className="sign-up-form-submit-btn">Continue</button>
                    <div className="sign-up-form-bottom">
                        <div>Already a Fakedditor? <span className="link" onClick={toggleForm}>LOG IN</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;