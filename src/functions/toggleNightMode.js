const toggleNightMode = (nightMode, setNightMode) => {
	const body = document.body;
	const nightBtn = document.querySelector('.night-mode-btn');
	const nightSwitch = document.querySelector('.night-mode-btn-switch');
	const header = document.querySelector('.header');
	const headerTitle = document.querySelector('.header-title');
	const searchField = document.querySelector('.search-field');
	const logInBtn = document.querySelector('.login-btn');
	const signUpBtn = document.querySelector('.signup-btn');
	const userBtn = document.querySelector('.user-btn');
	const dropdownMenu = document.querySelector('.user-dropdown-menu');
	const dropdownItem = document.querySelectorAll('.dropdown-item');
	const sortbar = document.querySelector('.sortbar-posts');
	const sortbarBtn = document.querySelectorAll('.sortbar-btn');
	const postBox = document.querySelectorAll('.post-box');
	const postBoxVotesContainer = document.querySelectorAll('.post-box-votes-container');
	const postBoxSubreddit = document.querySelectorAll('.post-box-subreddit');
	const postBoxFlair = document.querySelectorAll('.post-box-flair');
	const homeSidebarSection = document.querySelectorAll('.home-sidebar-section-content');
	const subredditSidebarSection = document.querySelectorAll('.subreddit-sidebar-section');
	const subredditSidebarFlair = document.querySelectorAll('.subreddit-sidebar-section-flair');
	const subredditHeader = document.querySelector('.subreddit-header');

	if (!nightMode) {
		setNightMode(true);
		body.classList.add('background-1-dark');
		nightBtn.classList.add('night-mode-btn-dark');
		nightSwitch.classList.add('night-mode-btn-switch-dark');
		header.classList.add('header-dark');
		headerTitle.classList.add('header-title-dark');
		searchField.classList.add('search-field-dark');
		userBtn.classList.add('user-btn-dark');
		dropdownMenu.classList.add('user-dropdown-menu-dark');
		dropdownItem.forEach(i => { i.classList.add('dropdown-item-dark'); });
		if (logInBtn) { logInBtn.classList.add('login-btn-dark'); }
		if (signUpBtn) { signUpBtn.classList.add('signup-btn-dark'); }
		if (sortbar) {
			sortbar.classList.add('sortbar-posts-dark');
			sortbarBtn.forEach(i => { i.classList.add('sortbar-btn-dark'); });
			postBox.forEach(i => { i.classList.add('post-box-dark'); });
			postBoxVotesContainer.forEach(i => { i.classList.add('post-box-votes-container-dark'); });
		}
		if (postBoxSubreddit) { postBoxSubreddit.forEach(i => { i.classList.add('post-box-subreddit-dark'); }); }
		if (homeSidebarSection) {
			homeSidebarSection.forEach(i => { i.classList.add('home-sidebar-section-content-dark'); });
		}
		if (subredditHeader) {
			subredditHeader.classList.add('subreddit-header-dark');
			subredditSidebarSection.forEach(i => { i.classList.add('subreddit-sidebar-section-dark'); });
			postBoxFlair.forEach(i => { i.classList.add('post-box-flair-dark'); });
			subredditSidebarFlair.forEach(i => { i.classList.add('subreddit-sidebar-section-flair-dark'); });
		}
	} else {
		setNightMode(false);
		body.classList.remove('background-1-dark');
		nightBtn.classList.remove('night-mode-btn-dark');
		nightSwitch.classList.remove('night-mode-btn-switch-dark');
		header.classList.remove('header-dark');
		headerTitle.classList.remove('header-title-dark');
		searchField.classList.remove('search-field-dark');
		userBtn.classList.remove('user-btn-dark');
		dropdownMenu.classList.remove('user-dropdown-menu-dark');
		dropdownItem.forEach(i => { i.classList.remove('dropdown-item-dark'); });
		if (logInBtn) { logInBtn.classList.remove('login-btn-dark'); }
		if (signUpBtn) { signUpBtn.classList.remove('signup-btn-dark'); }
		if (sortbar) {
			sortbar.classList.remove('sortbar-posts-dark');
			sortbarBtn.forEach(i => { i.classList.remove('sortbar-btn-dark'); });
			postBox.forEach(i => { i.classList.remove('post-box-dark'); });
			postBoxVotesContainer.forEach(i => { i.classList.remove('post-box-votes-container-dark'); });
		}
		if (postBoxSubreddit) { postBoxSubreddit.forEach(i => { i.classList.remove('post-box-subreddit-dark'); }); }
		if (homeSidebarSection) {
			homeSidebarSection.forEach(i => { i.classList.remove('home-sidebar-section-content-dark'); });
		}
		if (subredditHeader) {
			subredditHeader.classList.remove('subreddit-header-dark');
			subredditSidebarSection.forEach(i => { i.classList.remove('subreddit-sidebar-section-dark'); });
			postBoxFlair.forEach(i => { i.classList.remove('post-box-flair-dark'); });
			subredditSidebarFlair.forEach(i => { i.classList.remove('subreddit-sidebar-section-flair-dark'); });
		}
	}
};

export default toggleNightMode;