import React from "react";
import "../styles/Footer.css";

const Footer = ({nightMode}) => {
	return (
		<div className={!nightMode ? "footer" : "footer footer-dark"}>
            <div className="footer-content">
			    <ul>
                    <li>About</li>
                    <li>Careers</li>
                    <li>Press</li>
                </ul>
                <ul>
                    <li>Advertise</li>
                    <li>Blog</li>
                    <li>Help</li>
                </ul>
                <ul>
                    <li>Fakeddit Coins</li>
                    <li>Fakeddit Premium</li>
                    <li>Fakeddit Gifts</li>
                </ul>
                <ul>
                    <li>Facebook</li>
                    <li>Twitter</li>
                    <li>Instagram</li>
                </ul>
            </div>
            <div className="footer-bottom">
                <ul>
                    <li>Content Policy</li>
                    <li>Privacy Policy</li>
                    <li>User Agreement</li>
                    <li>Mod Policy</li>
                </ul>
            </div>
		</div>
	);
}

export default Footer;