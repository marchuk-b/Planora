import React, {useContext} from "react";
import "./Navbar.scss";
import { AuthContext } from "../context/AuthContext";
import {Link} from "react-router-dom"

const Navbar = () => {
  const {logout, token} = useContext(AuthContext)
  const isLogin = !!token

  return (
    <nav>
      <div className="nav-wrapper navbar green">
        <a href="/" className="brand-logo">Planora</a>
        {
          isLogin 
          ? (
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li>
                <Link to="/" onClick={logout}>Вийти</Link> 
              </li>
            </ul>
          )
          : (
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li>
                <Link to="/login">Увійти</Link>
              </li>
            </ul>
          )
        }
        <div className="links right hide-on-med-and-down">
          {isLogin && <Link to="/create" className="link">Створити подію</Link>}
          <Link to="/" className="link">Головна</Link>
          <Link to="/myevents" className="link">Мої події</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
