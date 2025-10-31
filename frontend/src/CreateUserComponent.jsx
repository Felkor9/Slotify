import "./CreateUserComponent.css";
import { Link } from "react-router-dom";

function CreateUserComponent() {
	return (
		<>
			<div className="login-container">
				<div className="form-div">
					<h2 className="heading-slotify">Sign up to Slotify</h2>
					<form className="login-form" onSubmit={(e) => e.preventDefault()}>
						<div className="input-group">
							<label htmlFor="username">Name:</label>
							<input className="input-text" type="text" id="username" name="username" required />
							<label htmlFor="email">Email:</label>
							<input className="input-text" type="text" id="email" name="email" required />
							<label htmlFor="password">Password:</label>
							<input
								className="input-text"
								type="password"
								id="password"
								name="password"
								required
							/>
							<div className="terms-group">
								<label htmlFor="agree">Agree terms of use and handling of GDPR</label>
								<input type="checkbox" name="agree" id="agree" required className="check-btn" />
							</div>
						</div>
						<div className="btn-group">
							<button className="login-btn" type="submit">
								<Link to={"/schedule"}>Sign up</Link>
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}
export default CreateUserComponent;
