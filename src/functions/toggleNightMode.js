const toggleNightMode = (nightMode, setNightMode) => {
	const body = document.body;
	const nightBtn = document.querySelector('.night-mode-btn');
	const nightSwitch = document.querySelector('.night-mode-btn-switch');
	const header = document.querySelector('.header');
	const headerTitle = document.querySelector('.header-title');
	const searchField = document.querySelector('.search-field');
	const loginBtn = document.querySelector('.login-btn');
	const signupBtn = document.querySelector('.signup-btn');
	const userBtn = document.querySelector('.user-btn');
	const dropdownMenu = document.querySelector('.user-dropdown-menu');
	const dropdownItem = document.querySelectorAll('.dropdown-item');

	if (nightMode) {
		setNightMode(false);
		body.style.background = 'rgb(218, 224, 230)';
		nightBtn.style.background = 'rgba(26, 26, 27, 0.1)';
		nightSwitch.style.left = '0';
		header.style.background = 'rgb(255, 255, 255)';
		header.style.borderBottom = '1px solid rgb(237, 239, 241)';
		headerTitle.style.color = 'rgb(0, 0, 0)';
		searchField.style.background = 'rgb(246, 247, 248)';
		searchField.style.color = 'rgb(0, 0, 0)';
		searchField.style.border = '1px solid rgb(237, 239, 241)';
		loginBtn.style.background = 'rgb(255, 255, 255)';
		loginBtn.style.color = 'rgb(0, 121, 211)';
		loginBtn.style.border = '1px solid rgb(0, 121, 211)';
		signupBtn.style.background = 'rgb(0, 121, 211)';
		signupBtn.style.color = 'rgb(255, 255, 255)';
		signupBtn.style.border = '1px solid rgb(0, 121, 211)';
		userBtn.style.color = 'rgb(0, 0, 0)';
		dropdownMenu.style.background = 'rgb(255, 255, 255)';
		dropdownItem.forEach(i => { i.style.color = 'rgb(0, 0, 0)' });
	} else {
		setNightMode(true);
		body.style.background = 'rgb(0, 0, 0)';
		nightBtn.style.background = 'rgb(0, 121, 211)';
		nightSwitch.style.left = '12px';
		header.style.background = 'rgb(26, 26, 27)';
		header.style.borderBottom = '1px solid rgb(52, 53, 54)';
		headerTitle.style.color = 'rgb(215, 218, 220)';
		searchField.style.background = 'rgb(39, 39, 41)';
		searchField.style.color = 'rgb(215, 218, 220)';
		searchField.style.border = '1px solid rgb(52, 53, 54)';
		loginBtn.style.background = 'rgb(26, 26, 27)';
		loginBtn.style.color = 'rgb(215, 218, 220)';
		loginBtn.style.border = '1px solid rgb(215, 218, 220)';
		signupBtn.style.background = 'rgb(215, 218, 220)';
		signupBtn.style.color = 'rgb(26, 26, 27)';
		signupBtn.style.border = '1px solid rgb(215, 218, 220)';
		userBtn.style.color = 'rgb(215, 218, 220)';
		dropdownMenu.style.background = 'rgb(26, 26, 27)';
		dropdownItem.forEach(i => { i.style.color = 'rgb(215, 218, 220)' });
	}
};

export default toggleNightMode;