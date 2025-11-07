import { useContext } from "react";
import { Navigate } from "react-router-dom";
import GlobalContext from "./GlobalContext";

function ProtectedRoute({ children }) {
	const { loggedInUserId } = useContext(GlobalContext);
	if (!loggedInUserId) {
		return <Navigate to="/" replace />;
	}
	return children;
}

export default ProtectedRoute;
