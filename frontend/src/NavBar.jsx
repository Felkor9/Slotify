import { useContext, useEffect, useState } from "react";
import "./NavBar.css";
import { Link, useNavigate } from "react-router-dom";
import GlobalContext from "./GlobalContext";

function NavBar() {
	const [isHamMenuVisible, setIsHamMenuVisible] = useState(false);
	const { loggedInUserId, users } = useContext(GlobalContext);
	const [name, setName] = useState(null);

	const navigate = useNavigate();

	useEffect(() => {
		if (users) {
			setName(users.find((u) => u.id == loggedInUserId));
		}
	}, [users, loggedInUserId]);

	return (
		<nav>
			<div className="navbar-container">
				<h2
					className="nav-header"
					onClick={() => (loggedInUserId ? navigate("/schedule") : navigate("/"))}>
					Slotify
				</h2>

				<p>
					<strong>Inloggad som:</strong> {name?.username}
				</p>

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
						<Link to="/create-user">Create account</Link>
					</li>
					<li>
						<Link to="/schedule">Schedule</Link>
					</li>
					<li>
						<Link to={"/settings"}>Settings</Link>
					</li>
					<li>Edit account</li>
					<li>My bookings</li>
				</ul>
			</div>
		</nav>
	);
}

export default NavBar;
