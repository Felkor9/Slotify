import { useContext, useEffect, useState } from "react";
import "./NavBar.css";
import { Link, useNavigate } from "react-router-dom";
import GlobalContext from "./GlobalContext";

function NavBar() {
	const [isHamMenuVisible, setIsHamMenuVisible] = useState(false);
	const { loggedInUserId, setLoggedInUserId, users } = useContext(GlobalContext);
	const [name, setName] = useState(null);

	const navigate = useNavigate();

	useEffect(() => {
		if (users.length > 0 && loggedInUserId) {
			const foundUser = users.find((u) => u.id == loggedInUserId);
			setName(foundUser); // Uppdatera användaren baserat på ID
		}
	}, [users, loggedInUserId]);

	const isadmin = name?.isadmin;

	function handleLogout() {
		localStorage.removeItem("loggedInUserId");
		setLoggedInUserId(null);
		setIsHamMenuVisible(false);
		setName(null);
		navigate("/");
	}

	return (
		<nav>
			<div className="navbar-container">
				<h2
					className="nav-header"
					onClick={() => (loggedInUserId ? navigate("/schedule") : navigate("/"))}>
					Slotify
				</h2>

				{/* Visa användarnamn om inloggad */}
				<p>
					{name ? (
						<>
							<strong>Inloggad som:</strong> {name.username}
						</>
					) : (
						""
					)}
				</p>
				{isadmin ? (
					<button className="admin-button" onClick={() => navigate("/admin")}>
						Admin Panel
					</button>
				) : (
					""
				)}
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
						{/* Om användaren är inloggad, visa rätt länk */}
						<Link
							onClick={() => setIsHamMenuVisible(false)}
							className="link"
							to={loggedInUserId ? "/schedule" : "/"}>
							Home
						</Link>
					</li>
					<li>
						{" "}
						{loggedInUserId ? (
							""
						) : (
							<Link onClick={() => setIsHamMenuVisible(false)} className="link" to="/create-user">
								Create account
							</Link>
						)}
					</li>
					<li>
						<Link onClick={() => setIsHamMenuVisible(false)} className="link" to="/schedule">
							Schedule
						</Link>
					</li>
					<li>
						<Link onClick={() => setIsHamMenuVisible(false)} className="link" to="/settings">
							Settings
						</Link>
					</li>
					<li>
						{loggedInUserId ? (
							<Link
								className="link"
								to="/"
								onClick={() => {
									handleLogout();
									setIsHamMenuVisible(false); // Se till att meny döljs vid utloggning
								}}>
								Log Out
							</Link>
						) : (
							<Link onClick={() => setIsHamMenuVisible(false)} className="link" to="/">
								Log In
							</Link>
						)}
					</li>
					<li>My bookings</li>
				</ul>
			</div>
		</nav>
	);
}

export default NavBar;
