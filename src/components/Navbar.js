
import { Link } from "react-router-dom";
import "../css/Navbar.css";
import { Icon } from "react-icons-kit";
import { home } from "react-icons-kit/icomoon/home";
import { FaShoppingCart } from "react-icons/fa";
import firebase from "firebase";
import { clearUser,  getUserInfo } from "../localStorage";
import { useAlert } from "react-alert";


export const Navbar = () => {
  const { _id, userName } = getUserInfo();
  const alert = useAlert();
  const logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        alert.success("logout");
        clearUser();
      })
      .catch((error) => {
        // An error happened.
        alert.error(error.message);
      });
  };

  return (
    <div className="navbar">
      <div className="brand">
        <Link to="/" className="brandlink">
          <Icon size={30} icon={home} />
        </Link>
      </div>

      <div className="navbar-items">
        {_id !== "" ? (
          <button onClick={logout} className="profile">
            Logout
          </button>
        ) : (
          <Link to="/login" className="signin">
            Login
          </Link>
        )}
        <Link to="/signup" className="signup">
          Signup
        </Link>
        <Link to="/cart">
          <FaShoppingCart
            style={{ color: "purple", cursor: "pointer" }}
            size="3rem"
          />
          </Link>
        {_id !== "" ? (
          <Link to="/profile" className="profile">
            {userName}
          </Link>
        ) : (
          <Link to="/login" className="signin">
            Guest
          </Link>
        )}
      </div>
    </div>
  );
};
