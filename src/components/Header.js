import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, signOut, deleteUser } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, doc, deleteDoc, updateDoc, deleteField } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faUser, faCircleUser, faMoon } from "@fortawesome/free-solid-svg-icons";
import LogIn from "./LogIn";
import '../styles/Header.css';

const Header = ({user, nightMode, setNightMode}) => {
	const [searchInput, setSearchInput] = useState('');
	const [logInForm, setLogInForm] = useState(false);
	const [signUpForm, setSignUpForm] = useState(false);
	const [dropdown, setDropdown] = useState(false);
	const navigate = useNavigate();
	const sampleAccount = {
		username: 'johndoe',
		email: 'johndoe@johndoe.com',
		password: 'johndoe'
	};

	const handleInput = event => {
		setSearchInput(event.target.value);
	};

	const submitSearch = event => {
		if (event.keyCode === 13) {
			navigate("/search/" + searchInput);
		}
	};

	const sampleLogIn = async () => {
		const auth = getAuth();
		signInWithEmailAndPassword(auth, sampleAccount.email, sampleAccount.password);
	};

	const logOut = () => {
		const auth = getAuth();
		signOut(auth).then(() => {
			setDropdown(false);
		}).catch(error => {
			console.log(error);
		});
	};

	const deleteAccount = () => {
		const db = getFirestore();
		const auth = getAuth();

		// Get Document id of user
		const getDocId = async () => {
			const q = query(collection(db, "users"), where("email", "==", auth.currentUser.email));
			const querySnapshot = await getDocs(q);
			let docId = '';
			querySnapshot.forEach(doc => {
				docId = doc.id;
			});

			return docId;
		}

		// Delete Fields from Document
		const deleteDocFields = async (id) => {
			const docRef = doc(db, "users", id);
			await updateDoc(docRef, {
				email: deleteField(),
				username: deleteField(),
				password: deleteField(),
				upvoted: deleteField(),
				downvoted: deleteField()
			});
		};

		// Delete Document
		const deleteDocument = async (id) => {
			const docRef = doc(db, "users", id);
			await deleteDoc(docRef);
		};

		// Delete Account
		getDocId()
		.then(id => {
			deleteDocFields(id)
			.then(() => { deleteDocument(id) })
			.then(() => { deleteUser(auth.currentUser) })
			.then(() => {
				setDropdown(false);
				console.log('Successfully deleted account');
			})
			.catch(error => {
				console.log(error);
			});
		});
	}

	const toggleNightMode = () => {
		if (!nightMode) {
			document.body.classList.add('dark');
			setNightMode(true);
		} else {
			document.body.classList.remove('dark');
			setNightMode(false);
		}
	};

	return (
		<header className={!nightMode ? 'header' : 'header dark'}>
			{dropdown ?
				<div className="canvas" onClick={() => {setDropdown(false)}} />
			: null}
			<div className="header-left">
				<Link to="/">
					<div className="header-title">fakeddit</div>
				</Link>
			</div>
			<div className="header-center">
				<div className="search-box">
					<form>
						<FontAwesomeIcon icon={faMagnifyingGlass} />
						<input className="search-field" type="search" placeholder="Search Fakeddit" onChange={handleInput} onKeyDown={submitSearch}></input>
					</form>
				</div>
			</div>
			<div className="header-right">
				{!user ?
					<div className="header-btns-container">
						<button className="header-btn sample-btn" onClick={sampleLogIn}>Use A Sample Account</button>
						<button className="header-btn login-btn" onClick={() => {setLogInForm(true)}}>Log In</button>
						<button className="header-btn signup-btn" onClick={() => {setSignUpForm(true)}}>Sign Up</button>
					</div>
				:
					<div className="header-username">{user.username}</div>
				}
				<div className="user-btn" onClick={() => {setDropdown(true)}}>
					<div className="user-dropdown-btn">
						<FontAwesomeIcon icon={faUser} />
					</div>
					{dropdown ?
						<div className="user-dropdown-menu">
							<div className="dropdown-header">VIEW OPTIONS</div>
							<div className="dropdown-item" onClick={toggleNightMode}>
								<FontAwesomeIcon icon={faMoon} />
								<span>Night Mode</span>
								<button className="night-mode-btn" type="button">
									<div className="night-mode-btn-switch" />
								</button>
							</div>
							<div className="dropdown-header">MORE STUFF</div>
							<div className="dropdown-item"><span>Coins</span></div>
							<div className="dropdown-item"><span>Premium</span></div>
							<div className="dropdown-item"><span>Powerups</span></div>
							<div className="dropdown-item"><span>Talk</span></div>
							<div className="dropdown-item"><span>Predictions</span></div>
							<div className="dropdown-item"><span>Help Center</span></div>
							{user ?
								<div className="dropdown-item" onClick={logOut}>
									<FontAwesomeIcon icon={faCircleUser} />
									<span>Log Out</span>
								</div>
							:
								<div className="dropdown-item" onClick={() => {
									setDropdown(false);
									setLogInForm(true);
								}}>
									<FontAwesomeIcon icon={faCircleUser} />
									<span>Log In / Sign Up</span>
								</div>
							}
							{user && user.username !== sampleAccount.username ?
								<div className="dropdown-item" onClick={deleteAccount}>Delete Account</div>
							: null}
						</div>
					: null}
				</div>
			</div>
			{logInForm ?
				<LogIn setLogInForm={setLogInForm} setSignUpForm={setSignUpForm} logIn={true} />
			: null}
			{signUpForm ?
				<LogIn setLogInForm={setLogInForm} setSignUpForm={setSignUpForm} logIn={false} />
			: null}
		</header>
	);
}

export default Header;