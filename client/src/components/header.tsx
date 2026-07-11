import "./header.css";

const Header = () => {
  return (
    <div className="header">
      <div className="header-box">
        <div className="logo-box">
          <i
            className="fa-solid fa-snowflake"
            style={{ fontSize: "xx-large" }}
          ></i>
          <h2>PuderSäkert</h2>
        </div>
      </div>
    </div>
  );
};
export default Header;
