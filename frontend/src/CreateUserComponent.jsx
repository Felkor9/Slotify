import "./CreateUserComponent.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function CreateUserComponent() {
	const navigate = useNavigate();
	const [username, setUserName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const [istermsVisible, setIsTermsVisible] = useState(false);

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
				<div className="signup-div">
					<div className="cursor-glow"></div>
					<h1 className="slotify-icon">SLOTIFY</h1>
				</div>
				<div className="form-create-div">
					<h2 className="heading-slotify">Sign up to Slotify</h2>
					<form className="create-form" onSubmit={(e) => e.preventDefault()}>
						<div className="input-group-create">
							<label className="label-create" htmlFor="username">
								Name:
							</label>
							<input
								className="input-text"
								type="text"
								id="username"
								name="username"
								value={username}
								onChange={(e) => setUserName(e.target.value)}
								required
							/>
							<label className="label-create" htmlFor="email">
								Email:
							</label>
							<input
								className="input-text"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								type="text"
								id="email"
								name="email"
								required
							/>
							<label className="label-create" htmlFor="password">
								Password:
							</label>
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
						<div className="terms-group">
							<label htmlFor="agree"></label>
							<input type="checkbox" name="agree" id="agree" required className="check-btn" />
							Agree terms of use and handling of GDPR{" "}
						</div>
						<div className="terms-div">
							<p>
								By creating an account, you agree to the{" "}
								<a onClick={() => setIsTermsVisible(true)} className="terms-link">
									Terms of Service.
								</a>{" "}
							</p>
						</div>

						<div className="btn-group">
							{error && <p style={{ color: "red" }}>Fel: {error}</p>}
							<button className="create-btn" onClick={addUser} type="submit">
								Create Account
							</button>
						</div>
					</form>
				</div>
			</div>

			{istermsVisible && (
				<div className="terms-modal">
					<div className="terms-content">
						<div className="terms-header">
							<h2>Terms of Use and GDPR Handling</h2>
							<p>
								By creating an account on Slotify, you agree to our Terms of Use and consent to the
								handling of your personal data in accordance with our GDPR policy. We are committed
								to protecting your privacy and ensuring the security of your information.
							</p>
							<h3>Terms of Use</h3>
							<ul>
								<li>You must be at least 13 years old to create an account.</li>
								<li>
									You are responsible for maintaining the confidentiality of your account
									information.
								</li>
								<li>You agree not to use Slotify for any unlawful or prohibited activities.</li>
								<li>
									We reserve the right to suspend or terminate your account for violations of our
									terms.
								</li>
							</ul>
							<h3>GDPR Handling</h3>
							<ul>
								<li>
									We collect and process your personal data in accordance with GDPR regulations.
								</li>
								<li>Your data will be used to provide and improve our services.</li>
								<li>
									You have the right to access, rectify, or delete your personal data at any time.
								</li>
								<li>We implement appropriate security measures to protect your data.</li>
							</ul>
							<button className="terms-btn" onClick={() => setIsTermsVisible(false)}>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
export default CreateUserComponent;
