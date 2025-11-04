import { useContext, useEffect, useState } from "react";
import "./NavBar.css";
import { Link } from "react-router-dom";
import GlobalContext from "./GlobalContext";

function NavBar() {
  const [isHamMenuVisible, setIsHamMenuVisible] = useState(false);
  const { loggedInUserId, users } = useContext(GlobalContext);
  const [name, setName] = useState(null);

  useEffect(() => {
    if (users) {
      setName(users.find((u) => u.id == loggedInUserId));
    }
  }, [users, loggedInUserId]);

  return (
    <nav>
      <div className="navbar-container">
        <Link to={"/"}>
          <h2 className="nav-header">Slotify</h2>
        </Link>
        <p>
          <strong>Inloggad som:</strong> {name?.username}
        </p>

        <img
          className="hamburger-icon"
          onClick={() => setIsHamMenuVisible(!isHamMenuVisible)}
          width={35}
          src="/icons8-hamburger.svg"
          alt="hamburger menu"
        />
      </div>

      <div className={`ham-menu-overlay ${isHamMenuVisible ? "show" : ""}`}>
        <ul className="ham-menu-list">
          <li>
            <Link to="/create-user">Create account</Link>
          </li>
          <li>
            <Link to="/schedule">Schedule</Link>
          </li>
          <li>Settings</li>
          <li>Edit account</li>
          <li>My bookings</li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
