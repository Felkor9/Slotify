import "./App.css";
import { useEffect, useState, lazy, Suspense } from "react";
import NavBar from "./NavBar.jsx";

const LoginView = lazy(() => import("./views/LoginView.jsx"));
// import ScheduleView from "./views/ScheduleView.jsx";
const ScheduleView = lazy(() => import("./views/ScheduleView.jsx"));
// import CreateUserView from "./views/CreateUserView.jsx";
const CreateUserView = lazy(() => import("./views/CreateUserView.jsx"));
// import SettingsView from "./views/SettingsView.jsx";
const SettingsView = lazy(() => import("./views/SettingsView.jsx"));
// import AdminView from "./views/AdminView.jsx";
const AdminView = lazy(() => import("./views/AdminView.jsx"));
import { createHashRouter, RouterProvider, Outlet } from "react-router-dom";
import GlobalContext from "./GlobalContext";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { ToastContainer } from "react-toastify";

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
			{
				path: "schedule",
				element: (
					<ProtectedRoute>
						<Suspense fallback={<>Laddar...</>}>
							<ScheduleView />
						</Suspense>
					</ProtectedRoute>
				),
			},
			{
				path: "create-user",
				element: <CreateUserView />,
			},
			{
				path: "settings",
				element: (
					<ProtectedRoute>
						<SettingsView />{" "}
					</ProtectedRoute>
				),
			},
			{
				path: "admin",
				element: (
					<ProtectedRoute>
						<AdminView />
					</ProtectedRoute>
				),
			},
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
			<ToastContainer
				position="bottom-left"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="colored"
			/>
			<RouterProvider router={router} />
		</GlobalContext.Provider>
	);
}
