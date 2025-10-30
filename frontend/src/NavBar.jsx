import { useState } from "react";
import "./NavBar.css";
import { Link } from "react-router-dom";

function NavBar() {
	const [isHamMenuVisible, setIsHamMenuVisible] = useState(false);

	return (
		<nav>
			<div className="navbar-container">
				<h2 className="nav-header">Slotify</h2>
				<img
					className="hamburger-icon"
					onClick={() => setIsHamMenuVisible(!isHamMenuVisible)}
					width={35}
					src="/icons8-hamburger.svg"
					alt="hamburger menu"
				/>
			</div>

			<div className={`ham-menu-overlay ${isHamMenuVisible ? "show" : ""}`}>
				<ul className="ham-menu-list">
					<li>
						<Link to="/">Create account</Link>
					</li>
					<li>
						<Link to="/schedule">Schedule</Link>
					</li>
					<li>Settings</li>
					<li>Edit account</li>
					<li>My bookings</li>
				</ul>
			</div>
		</nav>
	);
}

export default NavBar;
