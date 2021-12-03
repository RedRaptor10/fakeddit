import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
	return (
		<div className="home">
			<Link to="/r/news">r/news</Link>
		</div>
	);
}

export default Home;