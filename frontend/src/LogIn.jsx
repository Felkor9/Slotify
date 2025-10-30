import React from "react";
import "./LogIn.css";
import { Link } from "react-router-dom";

function LogIn() {
	return (
		<>
			<div className="login-container">
				<div className="form-div">
					<h2 className="heading-slotify">Log In to Slotify</h2>
					<form className="login-form" onSubmit={(e) => e.preventDefault()}>
						<div className="input-group">
							<label htmlFor="username">Email:</label>
							<input className="input-text" type="text" id="username" name="username" required />
							<label htmlFor="password">Password:</label>
							<input
								className="input-text"
								type="password"
								id="password"
								name="password"
								required
							/>
						</div>
						<div className="btn-group">
							<a href="#">Forgot Password?</a>
							<button className="login-btn" type="submit">
								<Link to={"/schedule"}>Log In</Link>
							</button>
						</div>
						<div className="signup-group">
							<p>Do not have an account yet?</p>

							<button className="signup-btn" type="button">
								Sign Up
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}

export default LogIn;
