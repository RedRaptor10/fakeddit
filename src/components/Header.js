import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, signOut, deleteUser } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, doc, deleteDoc, updateDoc, deleteField } from "firebase/firestore";
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
			document.body.classList.add('body-dark');
			setNightMode(true);
		} else {
			document.body.classList.remove('body-dark');
			setNightMode(false);
		}
	};

	return (
		<div className={!nightMode ? "header" : "header header-dark"}>
			{dropdown ?
				<div className="canvas" onClick={() => {setDropdown(false)}} />
			: null}
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
				<div className="user-btn">
					<div className="user-dropdown-btn" onClick={() => {setDropdown(true)}}></div>
					{dropdown ?
						<div className="user-dropdown-menu">
							<div className="dropdown-header">VIEW OPTIONS</div>
							<div className="dropdown-item" onClick={toggleNightMode}>
								Night Mode
								<button className="night-mode-btn" type="button">
									<div className="night-mode-btn-switch" />
								</button>
							</div>
							<div className="dropdown-header">MORE STUFF</div>
							<div className="dropdown-item">Coins</div>
							<div className="dropdown-item">Premium</div>
							<div className="dropdown-item">Powerups</div>
							<div className="dropdown-item">Talk</div>
							<div className="dropdown-item">Predictions</div>
							<div className="dropdown-item">Help Center</div>
							{user ?
								<div className="dropdown-item" onClick={logOut}>Log Out</div>
							:
								<div className="dropdown-item" onClick={() => {
									setDropdown(false);
									setLogInForm(true);
								}}>Log In / Sign Up</div>
							}
							{user ?
								<div className="dropdown-item" onClick={deleteAccount}>Delete Account</div>
							: null}
						</div>
					: null}
				</div>
			</div>
			{logInForm ?
				<LogIn setLogInForm={setLogInForm} setSignUpForm={setSignUpForm} logIn={true} nightMode={nightMode} />
			: null}
			{signUpForm ?
				<LogIn setLogInForm={setLogInForm} setSignUpForm={setSignUpForm} logIn={false} nightMode={nightMode} />
			: null}
		</div>
	);
}

export default Header;