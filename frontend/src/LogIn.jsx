import { useContext, useState, useEffect } from "react";
import "./LogIn.css";
import { Link, useNavigate } from "react-router-dom";
import GlobalContext from "./GlobalContext";

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
				navigate("/schedule");
			} else {
				alert(data.error);
			}
		} catch (err) {
			console.error(err.message);
		}
	};

	return (
		<>
			<div className="login-container">
				<img src="/header.png" alt="" className="header-img" />
				<div className="overlay"></div>
				<div className="form-div">
					<h2 className="heading-slotify">Log In to Slotify</h2>
					<form className="login-form" onSubmit={(e) => e.preventDefault()}>
						<div className="input-group">
							<label htmlFor="username">Email:</label>
							<input
								className="input-text"
								type="text"
								id="username"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								name="username"
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
