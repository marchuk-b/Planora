import React from "react";

import "./Navbar.scss";

const Navbar = () => {
  return (
    <nav>
      <div className="nav-wrapper navbar green">
        <a href="/" className="brand-logo">
          Planora
        </a>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          <li>
            <a href="/">Увійти</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
