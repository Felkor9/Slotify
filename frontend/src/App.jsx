import "./App.css";
import { useEffect, useState } from "react";
import NavBar from "./NavBar.jsx";
import LoginView from "./views/LoginView.jsx";
import ScheduleView from "./views/ScheduleView.jsx";
import CreateUserView from "./views/CreateUserView.jsx";
import SettingsView from "./views/SettingsView.jsx";
import { createHashRouter, RouterProvider, Outlet } from "react-router-dom";
import GlobalContext from "./GlobalContext";

const router = createHashRouter([
	{
		element: (
			<>
				<NavBar />
				<main>
					<Outlet />
				</main>
			</>
		),
		children: [
			{ index: true, element: <LoginView /> },
			{ path: "schedule", element: <ScheduleView /> },
			{ path: "create-user", element: <CreateUserView /> },
			{ path: "settings", element: <SettingsView /> },
		],
	},
]);

export default function App() {
	const [loggedInUserId, setLoggedInUserId] = useState(
		localStorage.getItem("loggedInUserId") || null
	);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		fetch("/api/users")
			.then((response) => response.json())
			.then((data) => {
				setUsers(data);
			});
	}, []);

	return (
		<GlobalContext.Provider value={{ loggedInUserId, setLoggedInUserId, users, setUsers }}>
			<RouterProvider router={router} />
		</GlobalContext.Provider>
	);
}
