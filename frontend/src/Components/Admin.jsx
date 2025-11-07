import "./Admin.css";
import { useContext, useState } from "react";
import GlobalContext from "../GlobalContext";
import { toast } from "react-toastify";

function Admin() {
	const { users } = useContext(GlobalContext);
	const [isUpdateVisible, setIsUpdateVisible] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);

	const handleCheckboxChange = (user) => {
		const updatedIsAdmin = !user.isadmin; // Toggle isadmin status
		fetch(`/api/admin/${user.id}`, {
			// Skickar till den rätta API-endpointen
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ isadmin: updatedIsAdmin }), // Skickar den nya isadmin-statusen
		})
			.then((response) => {
				if (!response.ok) {
					throw (
						(new Error("Network response was not ok"),
						toast.error("There was an error updating admin status."))
					);
				}
				return response.json();
			})
			.then((data) => {
				console.log("Success:", data);
				toast.success("Admin status updated successfully!");
			})
			.catch((error) => {
				console.error("Error:", error);
				toast.error("There was an error updating admin status.");
			});
	};

	return (
		<>
			<div className="admin-container">
				<h1>Admin Panel</h1>
				<p>Here can administrators configure their users.</p>

				<div className="admin-sections">
					<div className="user-div">
						{users.map((user) => (
							<div key={user.id} className="user-card">
								<div className="user-info">
									<p>
										<strong>Username:</strong> {user.username}
									</p>
									<p>
										<strong>Admin status:</strong> {user.isadmin ? "Yes" : "No"}
									</p>
								</div>
								<div className="user-actions">
									<label className="checkbox-container">
										Change admin status
										<input
											className="checkbox-custom"
											type="checkbox"
											checked={user.isadmin}
											onChange={() => {
												setSelectedUser(user);
												setIsUpdateVisible(true);
											}}
										/>
									</label>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
			{isUpdateVisible && (
				<div className="update-confirmation">
					<div className="holder-confirmation">
						<p>
							Are you sure you want to change Administrator-status for{" "}
							<strong>{selectedUser.username}</strong>?
						</p>
						<button
							className="conf-btn"
							onClick={() => {
								handleCheckboxChange(selectedUser);
								setIsUpdateVisible(false);
							}}>
							Yes
						</button>
						<button className="conf-btn" onClick={() => setIsUpdateVisible(false)}>
							No
						</button>
					</div>
				</div>
			)}
		</>
	);
}

export default Admin;
