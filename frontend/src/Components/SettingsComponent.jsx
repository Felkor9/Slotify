import { useEffect, useState, useContext } from "react";
import "./settingsComponent.css";
import GlobalContext from "../GlobalContext";

function SettingsComponent() {
	const [username, setUserName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isUpdateVisible, setUpdateVisible] = useState(false);

	const { users } = useContext(GlobalContext); // Lista på användare
	const { loggedInUserId } = useContext(GlobalContext); // Inloggad användarens ID
	const [user, setUser] = useState(null); // State för den aktuella användaren

	useEffect(() => {
		// Hitta användaren i users-listan baserat på loggedInUserId
		const foundUser = users.find((u) => u.id === loggedInUserId);

		// Om användaren finns i users, sätt den i state
		if (foundUser) {
			setUser(foundUser);
		} else {
			// Om användaren inte finns i `users`, hämta från API
			fetch("/api/user")
				.then((response) => response.json())
				.then((data) => {
					setUser(data); // Uppdatera användaren när datan har hämtats
				})
				.catch((error) => console.error("Error fetching user data:", error));
		}
	}, [users, loggedInUserId]); // Kör när `users` eller `loggedInUserId` ändras

	const handleUpdateClick = () => {
		if (!email || !password) {
			alert("Please fill in all fields before updating!");
			return;
		}
		setUpdateVisible(true); // Visa modalen för att bekräfta uppdatering
	};

	const handleUpdate = () => {
		// Kontrollera att användaren finns
		if (!user || !user.id) {
			alert("No user data available.");
			return;
		}

		// Uppdatera användarens data
		fetch(`/api/user/${user.id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, email, password }),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((data) => {
				console.log("Success:", data);
				setUpdateVisible(false); // Stäng modalen
				alert("User information updated successfully!");
				setUser(data.user); // Uppdatera användaren i state
			})
			.catch((error) => {
				console.error("Error:", error);
				alert("There was an error updating your information.");
			});
	};

	return (
		<>
			<div className="settings-container">
				<h1>Update your user-info</h1>
				<div className="form-div-settings">
					<div>
						<p>Current information </p>
						{/* Kontrollera om user finns innan vi försöker rendera user.id */}
						{user ? (
							user.id === loggedInUserId ? (
								<div>
									<p>Current User: {user.username}</p>
									<p>Current Email: {user.email}</p>
								</div>
							) : (
								<p>Loading user data...</p>
							)
						) : (
							<p>Loading user data...</p>
						)}
					</div>
					<form className="login-form" onSubmit={(e) => e.preventDefault()}>
						<div className="input-group">
							<label htmlFor="username">Name:</label>
							<input
								className="input-text"
								type="text"
								id="username"
								name="username"
								value={username}
								onChange={(e) => setUserName(e.target.value)}
								required
							/>
							<label htmlFor="email">Email:</label>
							<input
								className="input-text"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								type="email"
								id="email"
								name="email"
								required
							/>
							<label htmlFor="password">Password:</label>
							<input
								className="input-text"
								type="password"
								id="password"
								name="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						<div className="btn-group">
							<button className="login-btn" type="button" onClick={() => handleUpdateClick()}>
								Update Credentials
							</button>
						</div>
					</form>
				</div>
			</div>
			{isUpdateVisible && (
				<div
					onClick={() => setUpdateVisible(false)}
					className={`module-update ${isUpdateVisible ? "show" : ""}`}>
					<div className="module-update-content">
						<p className="header-update">Are you sure you want to update?</p>
						<button className="update-btn" onClick={() => handleUpdate()}>
							Update
						</button>
					</div>
				</div>
			)}
		</>
	);
}

export default SettingsComponent;
