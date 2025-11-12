import { useEffect, useState, useContext } from "react";
import "./SettingsComponent.css";
import { useNavigate } from "react-router-dom";
import GlobalContext from "../GlobalContext";
import { toast } from "react-toastify";

function SettingsComponent() {
	const [username, setUserName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [currentPassword, setCurrentPassword] = useState("");
	const [isUpdateVisible, setUpdateVisible] = useState(false);
	const { users } = useContext(GlobalContext);
	const { loggedInUserId, setLoggedInUserId } = useContext(GlobalContext);
	const [user, setUser] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		console.log("Users:", users);
		console.log("Logged In User ID:", loggedInUserId);

		if (users && loggedInUserId) {
			const foundUser = users.find((u) => u.id === Number(loggedInUserId));
			console.log("Found user:", foundUser);

			if (foundUser) {
				setUser(foundUser);
			}
		}
	}, [users, loggedInUserId]);

	const handleUpdateClick = () => {
		if (!email || !password || !currentPassword) {
			toast.error("Please fill in all fields.");
			return;
		}
		setUpdateVisible(true);
	};

	const handleUpdate = () => {
		if (!users || !user.id) {
			toast.error("User data is not available.");
			return;
		}

		// Uppdatera användarens data
		fetch(`/api/user/${user.id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, email, password, currentPassword }),
		})
			.then((response) => {
				if (!response.ok) {
					throw (
						(new Error("Network response was not ok"),
						toast.error("There was an error updating your information."))
					);
				}
				return response.json();
			})
			.then((data) => {
				console.log("Success:", data);
				setUpdateVisible(false);
				toast.success("User information updated successfully!");
				setUser(data.user);
			})
			.catch((error) => {
				console.error("Error:", error);
				toast.error("There was an error updating your information.");
			});
	};

	const deleteUser = async () => {
		try {
			console.log("Deleting user with id:", user.id);

			const res = await fetch(`/api/deleteuser`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: user.id }),
			});

			if (!res.ok) {
				toast.error("Kunde inte ta bort användaren");
				throw new Error("Delete failed");
			}

			localStorage.removeItem("loggedInUserId");
			setLoggedInUserId(null);
			toast.success("Användare raderad!");
			navigate("/");
		} catch (err) {
			console.error(err.message);
			toast.error("Ett fel uppstod");
		}
	};

	return (
		<>
			<div className="settings-container">
				<div className="form-div-settings">
					<h1>Update your user-info</h1>
					<button className="delete-btn" onClick={() => deleteUser(loggedInUserId)}>
						Delete account
					</button>
					<div className="form-div-holder">
						<div className="current-info">
							<h2 className="heading-info">Current information </h2>
							{/* Kontrollera om user finns innan vi försöker rendera user.id */}
							{user ? (
								<div className="info-div">
									<p className="info-text">
										<strong>Current User: </strong>
										{user.username}
									</p>
									<p className="info-text">
										<strong>Current Email: </strong>
										{user.email}
									</p>
								</div>
							) : (
								<p>Loading user data...</p>
							)}
						</div>
						<form className="settings-form" onSubmit={(e) => e.preventDefault()}>
							<div className="input-settings">
								<label className="label-settings" htmlFor="username">
									Name:
								</label>
								<input
									className="settingInputs"
									type="text"
									id="username"
									name="username"
									value={username}
									onChange={(e) => setUserName(e.target.value)}
									required
								/>
								<label className="label-settings" htmlFor="email">
									Email:
								</label>
								<input
									className="settingInputs"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									type="email"
									id="email"
									name="email"
									required
								/>
								<label className="label-settings" htmlFor="currentPassword">
									Current Password:
								</label>
								<input
									className="settingInputs"
									type="password"
									id="currentPassword"
									value={currentPassword}
									onChange={(e) => setCurrentPassword(e.target.value)}
									required
								/>
								<label className="label-settings" htmlFor="password">
									New Password:
								</label>
								<input
									className="settingInputs"
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
