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
      </div>
    </nav>
  );
};

export default Navbar;
