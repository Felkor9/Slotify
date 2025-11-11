import { useContext, useState, useEffect } from "react";
import "./LogIn.css";
import { Link, useNavigate } from "react-router-dom";
import GlobalContext from "./GlobalContext";
import { toast } from "react-toastify";

function LogIn() {
	const { setLoggedInUserId } = useContext(GlobalContext);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		fetch("/api/user")
			.then((response) => response.json())
			.then((data) => console.log(data));
	}, []);

	const handleLogIn = async () => {
		try {
			const response = await fetch("/api/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});
			const data = await response.json();

			if (response.ok) {
				console.log(data);
				setLoggedInUserId(data.user.id);
				localStorage.setItem("loggedInUserId", data.user.id);
				toast.success("Successfully logged in!");
				navigate("/schedule");
			} else {
				toast.error(data.message || "Login failed. Please try again.");
			}
		} catch (err) {
			toast.error("An error occurred during login. Please try again.");
			console.error("Login error:", err);
		}
	};

	return (
		<>
			<div className="logins-container">
				<div className="form-div">
					<h2 className="heading-login-slotify">Log In to Slotify</h2>
					<form className="login-form" onSubmit={(e) => e.preventDefault()}>
						<div className="input-group">
							<label className="login-label" htmlFor="username">
								Email:
							</label>
							<input
								className="input-text"
								type="text"
								id="username"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								name="username"
								required
							/>
							<label className="login-label" htmlFor="password">
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
						<div className="btn-group">
							<a href="#">Forgot Password?</a>
							<button className="login-btn" type="submit" onClick={() => handleLogIn()}>
								Log In
							</button>
						</div>
						<div className="signup-group">
							<p>Do not have an account yet?</p>

							<button className="signup-btn" type="button">
								<Link to={"/create-user"}>Sign Up</Link>
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}

export default LogIn;
