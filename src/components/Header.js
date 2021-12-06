import React, { useState } from "react";
import { Link } from "react-router-dom";
import LogIn from "./LogIn";
import '../styles/Header.css';
import toggleNightMode from '../functions/toggleNightMode';

const Header = () => {
	const [logInForm, setLogInForm] = useState(false);
	const [signUpForm, setSignUpForm] = useState(false);
	const [dropdown, setDropdown] = useState(false);
	const [nightMode, setNightMode] = useState(false);

	const toggleLogInForm = () => {
		logInForm ? setLogInForm(false) : setLogInForm(true);
	};

	const toggleSignUpForm = () => {
		signUpForm ? setSignUpForm(false) : setSignUpForm(true);
	};

	const toggleDropdown = () => {
		dropdown ? setDropdown(false) : setDropdown(true);
	};

	const remove = () => {
		if (logInForm) { setLogInForm(false) }
		if (signUpForm) { setSignUpForm(false) }
		if (dropdown) { setDropdown(false) }
	};

	return (
		<div className="header">
			<div className="header-left">
				<Link to="/">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="logo">
						<g>
							<circle fill="#FF4500" cx="10" cy="10" r="10"></circle>
							<path fill="#FFFFFF" d="M6.83 8.24h1.64V6.65A4.26 4.26 0 0 1 9 4.19 2.92 2.92 0 0 1 11.54 3a10.31 10.31 0 0 1 2.94.29l-.41 2.43a5.54 5.54 0 0 0-1.32-.2 1 1 0 0 0-1.21.87v1.85h2.62L14 10.61h-2.46v8.24H8.47v-8.24H6.83V8.24z"></path>
						</g>
					</svg>
				</Link>
				<Link to="/">
					<div className="header-title">fakeddit</div>
				</Link>
			</div>
			<div className="header-center">
				<div className="search-box">
					<form>
						<input className="search-field" type="search" placeholder="Search Fakeddit"></input>
					</form>
				</div>
			</div>
			<div className="header-right">
				<button className="header-btn login-btn" onClick={toggleLogInForm}>Log In</button>
				<button className="header-btn signup-btn" onClick={toggleSignUpForm}>Sign Up</button>
				<div className="user-btn">
					<div className="user-dropdown-btn" onClick={toggleDropdown}></div>
					{dropdown ?
						<div>
							<div className="canvas" onClick={remove} />
							<div className={nightMode ? "user-dropdown-menu user-dropdown-menu-night" : "user-dropdown-menu"}>
								<div className="dropdown-header">VIEW OPTIONS</div>
								<div className={nightMode ? "dropdown-item dropdown-item-night" : "dropdown-item"} onClick={() => { toggleNightMode(nightMode, setNightMode) }}>
									Night Mode
									<button className={nightMode ? "night-mode-btn night-mode-btn-night" : "night-mode-btn"} type="button">
										<div className={nightMode ? "night-mode-btn-switch night-mode-btn-switch-night" : "night-mode-btn-switch"}></div>
									</button>
								</div>
								<div className="dropdown-header">MORE STUFF</div>
								<div className={nightMode ? "dropdown-item dropdown-item-night" : "dropdown-item"}>Coins</div>
								<div className={nightMode ? "dropdown-item dropdown-item-night" : "dropdown-item"}>Premium</div>
								<div className={nightMode ? "dropdown-item dropdown-item-night" : "dropdown-item"}>Powerups</div>
								<div className={nightMode ? "dropdown-item dropdown-item-night" : "dropdown-item"}>Talk</div>
								<div className={nightMode ? "dropdown-item dropdown-item-night" : "dropdown-item"}>Predictions</div>
								<div className={nightMode ? "dropdown-item dropdown-item-night" : "dropdown-item"}>Help Center</div>
								<div className={nightMode ? "dropdown-item dropdown-item-night" : "dropdown-item"}>Log In / Sign Up</div>
							</div>
						</div>
					: null}
				</div>
			</div>
			{logInForm ?
				<LogIn remove={remove} toggleLogInForm={toggleLogInForm} toggleSignUpForm={toggleSignUpForm} signUp={false} />
			: null}
			{signUpForm ?
				<LogIn remove={remove} toggleLogInForm={toggleLogInForm} toggleSignUpForm={toggleSignUpForm} signUp={true} />
			: null}
		</div>
	);
}

export default Header;