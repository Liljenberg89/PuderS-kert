import { Link } from "react-router-dom";
import "./header.css";

const Header = () => {
  return (
    <div className="header">
      <div className="header-box">
        <Link to="/" className="logo-box">
          <i
            className="fa-solid fa-snowflake"
            style={{ fontSize: "xx-large" }}
            aria-hidden="true"
          ></i>
          <h2>PuderSäkert</h2>
        </Link>
        <Link to="/om" className="about-link">
          Om sidan
        </Link>
      </div>
    </div>
  );
};
export default Header;
