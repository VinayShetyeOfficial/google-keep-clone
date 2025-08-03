import React from "react";
import keep_logo from "../assets/logo/keep_logo3.svg";
import { NavLink } from "react-router-dom";

/**
 * Header component displaying app logo and title
 *
 * Features:
 * - Navigation link to home
 * - Responsive layout
 */
function Header() {
  const logo = (
    <img src={keep_logo} style={{ width: "40px", height: "40px" }} alt="logo" />
  );

  // Header component
  return (
    <div className="header">
      <NavLink to="/">
        {logo}
        <h3>Keep</h3>
      </NavLink>
    </div>
  );
}

export default Header;
