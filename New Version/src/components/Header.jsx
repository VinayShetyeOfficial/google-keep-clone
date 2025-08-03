import React, { useState } from "react";
import keep_logo from "../assets/logo/keep_logo3.svg";
import { NavLink } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";

/**
 * Header component displaying app logo, title, and user profile
 *
 * Props:
 * - user: Object - Firebase user object
 * - onSignOut: function - Callback for sign out action
 *
 * Features:
 * - Navigation link to home
 * - User profile picture display
 * - User dropdown menu
 * - Responsive layout
 */
function Header({ user, onSignOut }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Debug: Log user data to see if photoURL is available
  console.log("User data in Header:", user);
  console.log("User photoURL:", user?.photoURL);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    onSignOut();
    handleClose();
  };

  const logo = (
    <img src={keep_logo} style={{ width: "40px", height: "40px" }} alt="logo" />
  );

  return (
    <div className="header">
      <div className="header-left">
        <NavLink to="/">
          {logo}
          <h3>Keep</h3>
        </NavLink>
      </div>

      {user && (
        <div className="header-right">
          <Tooltip title={`${user.displayName} (${user.email})`}>
            <Avatar
              src={user.photoURL}
              alt={user.displayName}
              onClick={handleClick}
              sx={{
                width: 32,
                height: 32,
                cursor: "pointer",
                border: "2px solid transparent",
                "&:hover": {
                  border: "2px solid #fbbc04",
                },
              }}
              onError={(e) => {
                console.log("Avatar image failed to load:", user.photoURL);
                e.target.style.display = "none";
              }}
            >
              {user.displayName?.charAt(0)?.toUpperCase()}
            </Avatar>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleClose}>
              <Avatar
                src={user.photoURL}
                alt={user.displayName}
                onError={(e) => {
                  console.log(
                    "Dropdown avatar image failed to load:",
                    user.photoURL
                  );
                  e.target.style.display = "none";
                }}
              >
                {user.displayName?.charAt(0)?.toUpperCase()}
              </Avatar>
              <div>
                <div style={{ fontWeight: "bold" }}>{user.displayName}</div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {user.email}
                </div>
              </div>
            </MenuItem>
            <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
          </Menu>
        </div>
      )}
    </div>
  );
}

export default Header;
