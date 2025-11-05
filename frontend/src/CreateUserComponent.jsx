import "./CreateUserComponent.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function CreateUserComponent() {
	const navigate = useNavigate();
	const [username, setUserName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);

	useEffect(() => {
		fetch("/api/user")
			.then((response) => response.json())
			.then((data) => console.log(data));
	}, []);

	const addUser = async () => {
		if (!username || !email || !password) {
			setError("Vänligen fyll i alla fält.");
			return;
		}
		try {
			const res = await fetch("/api/user", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, email, password }),
			});
			if (!res.ok) throw new Error("Kunde inte skapa användare");

			setUserName("");
			setEmail("");
			setPassword("");
			setError(null);
			navigate("/");
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<>
			<div className="login-container">
				<div className="form-div">
					<h2 className="heading-slotify">Sign up to Slotify</h2>
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
							<div className="terms-group">
								<label htmlFor="agree">Agree terms of use and handling of GDPR</label>
								<input type="checkbox" name="agree" id="agree" required className="check-btn" />
							</div>
						</div>
						<div className="btn-group">
							{error && <p style={{ color: "red" }}>Fel: {error}</p>}
							<button className="login-btn" onClick={addUser} type="submit">
								Create Account
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}
export default CreateUserComponent;
