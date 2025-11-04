import { useEffect, useState } from "react";
import "./settingsComponent.css";
import GlobalContext from "../GlobalContext";

function SettingsComponent() {
	const [username, setUserName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isUpdateVisible, setUpdateVisible] = useState(false);

	// const { setLoggedInUserId } = useContext(GlobalContext);

	useEffect(() => {
		fetch("/api/user")
			.then((Response) => Response.json)
			.then((data) => console.log(data));
	});

	const handleUpdateClick = () => {
		if (!email || !password) {
			alert("Please fill in all fields before updating!");
			return; // stoppar modalen från att öppnas
		}

		setUpdateVisible(true);
	};

	return (
		<>
			<div className="settings-container">
				<div className="form-div">
					<h1>Update your user-info</h1>
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
								type="text"
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
						<button className="update-btn">Update</button>
					</div>
				</div>
			)}
		</>
	);
}

export default SettingsComponent;
