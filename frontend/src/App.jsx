import "./App.css";
import NavBar from "./NavBar.jsx";
import LoginView from "./views/LoginView.jsx";
import ScheduleView from "./views/ScheduleView.jsx";
import CreateUserView from "./views/CreateUserView.jsx";
import { createHashRouter, RouterProvider, Outlet } from "react-router-dom";

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
		],
	},
]);

export default function App() {
	return <RouterProvider router={router} />;
}
