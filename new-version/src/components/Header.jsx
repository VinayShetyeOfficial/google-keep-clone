import React, { useState, useEffect } from "react";
import keep_logo from "../assets/logo/keep_logo3.svg";
import { NavLink } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import SearchBar from "./SearchBar";
import SettingsIcon from "@mui/icons-material/Settings";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Header component displaying app logo, title, search bar, and user profile
 *
 * Props:
 * - user: Object - Firebase user object
 * - onSignOut: function - Callback for sign out action
 * - onSearch: function - Callback for search functionality
 *
 * Features:
 * - Navigation link to home
 * - Search bar for filtering notes
 * - User profile picture display
 * - User dropdown menu
 * - Responsive layout
 * - Dark theme settings
 */
function Header({ user, onSignOut, onSearch }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const open = Boolean(anchorEl);
  const settingsOpen = Boolean(settingsAnchorEl);

  // Theme context
  const { isDarkMode, updateTheme, isDeviceThemeActive, THEME_TYPES } =
    useTheme();

  // Function to get a CORS-friendly profile picture URL
  const getProfilePictureUrl = (photoURL) => {
    if (!photoURL) return null;

    // For Google profile pictures, use a more reliable approach
    if (photoURL.includes("googleusercontent.com")) {
      // Remove size parameters and use a larger size for better quality
      const baseUrl = photoURL.split("=")[0];
      return `${baseUrl}=s96-c`;
    }

    return photoURL;
  };

  // State to track if image loaded successfully
  const [imageLoaded, setImageLoaded] = useState(false);

  // Preload image to prevent flashing
  useEffect(() => {
    if (user?.photoURL) {
      setImageLoaded(false);

      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        setImageLoaded(true);
      };

      img.onerror = () => {
        setImageLoaded(false);
      };

      img.src = getProfilePictureUrl(user.photoURL);
    }
  }, [user?.uid, user?.photoURL]);

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

  const handleMobileSearchStateChange = (isOpen) => {
    setIsMobileSearchOpen(isOpen);
  };

  const handleSettingsClick = (event) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchorEl(null);
  };

  // Theme handling functions
  const handleEnableDarkTheme = () => {
    updateTheme(THEME_TYPES.DARK);
    handleSettingsClose();
  };

  const handleDisableDarkTheme = () => {
    updateTheme(THEME_TYPES.LIGHT);
    handleSettingsClose();
  };

  const handleUseDeviceTheme = () => {
    updateTheme(THEME_TYPES.DEVICE);
    handleSettingsClose();
  };

  const logo = (
    <img
      src={keep_logo}
      style={{ width: "40px", height: "40px", marginLeft: "-5px" }}
      alt="logo"
    />
  );

  return (
    <div className={`header ${isMobileSearchOpen ? "mobile-search-open" : ""}`}>
      <div className="header-left">
        <NavLink to="/">
          {logo}
          <h3>Keep</h3>
        </NavLink>
      </div>

      {user && (
        <div className="header-center">
          <SearchBar
            onSearch={onSearch}
            onMobileSearchStateChange={handleMobileSearchStateChange}
          />
        </div>
      )}

      {user && (
        <div className="header-right">
          {/* Settings Gear Icon */}
          <Tooltip title="Settings">
            <div className="settings-icon" onClick={handleSettingsClick}>
              <SettingsIcon />
            </div>
          </Tooltip>

          <Tooltip
            title={
              <div className="user-tooltip">
                <div className="tooltip-title">Google Account</div>
                <div className="tooltip-name">{user.displayName}</div>
                <div className="tooltip-email">{user.email}</div>
              </div>
            }
            placement="bottom"
            arrow={false}
            PopperProps={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, 8],
                  },
                },
              ],
            }}
          >
            <Avatar
              key={user?.uid} // Force re-render when user changes
              src={imageLoaded ? getProfilePictureUrl(user.photoURL) : null}
              alt={user.displayName}
              onClick={handleClick}
              crossOrigin="anonymous"
              sx={{
                width: 40,
                height: 40,
                cursor: "pointer",
                border: "3px solid transparent",
                objectFit: "cover",
                objectPosition: "center",
                borderRadius: "50%",
                overflow: "hidden",
                "& img": {
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                },
                "&:hover": {
                  border: "3px solid #fbbc04",
                },
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
                  width: 40,
                  height: 40,
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
                key={`dropdown-${user?.uid}`} // Force re-render when user changes
                src={imageLoaded ? getProfilePictureUrl(user.photoURL) : null}
                alt={user.displayName}
                crossOrigin="anonymous"
                sx={{
                  width: 40,
                  height: 40,
                  border: "3px solid transparent",
                  objectFit: "cover",
                  objectPosition: "center",
                  borderRadius: "50%",
                  overflow: "hidden",
                  "& img": {
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                  },
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

          {/* Settings Menu */}
          <Menu
            anchorEl={settingsAnchorEl}
            open={settingsOpen}
            onClose={handleSettingsClose}
            onClick={handleSettingsClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
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
            {!isDarkMode ? (
              // Light theme options
              <>
                <MenuItem onClick={handleEnableDarkTheme}>
                  <span>Enable dark theme</span>
                </MenuItem>
                <MenuItem onClick={handleUseDeviceTheme}>
                  <span>Use device theme</span>
                </MenuItem>
              </>
            ) : (
              // Dark theme options
              <>
                <MenuItem onClick={handleDisableDarkTheme}>
                  <span>Disable dark theme</span>
                </MenuItem>
                <MenuItem onClick={handleUseDeviceTheme}>
                  <span>Use device theme</span>
                </MenuItem>
              </>
            )}
          </Menu>
        </div>
      )}
    </div>
  );
}

export default Header;
