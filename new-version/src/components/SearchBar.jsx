import React, { useState, useEffect, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

/**
 * SearchBar component for filtering notes
 *
 * Props:
 * - onSearch: function - Callback with search query
 * - placeholder: string - Placeholder text for search input
 *
 * Features:
 * - Real-time search as user types
 * - Clear button to reset search
 * - Search icon
 * - Responsive design
 */
function SearchBar({
  onSearch,
  placeholder = "Search",
  onMobileSearchStateChange,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const searchContainerRef = useRef(null);

  // Debounce search to avoid too many calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timeoutId);
  }, [searchQuery, onSearch]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClear = () => {
    setSearchQuery("");
    onSearch("");
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleMobileSearchToggle = () => {
    const newState = !isMobileSearchOpen;
    setIsMobileSearchOpen(newState);
    if (onMobileSearchStateChange) {
      onMobileSearchStateChange(newState);
    }
    if (isMobileSearchOpen) {
      // Close mobile search
      setSearchQuery("");
      onSearch("");
    }
  };

  const handleMobileSearchClose = () => {
    setIsMobileSearchOpen(false);
    if (onMobileSearchStateChange) {
      onMobileSearchStateChange(false);
    }
    setSearchQuery("");
    onSearch("");
  };

  // Handle click outside to close mobile search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileSearchOpen &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        handleMobileSearchClose();
      }
    };

    // Add event listener when mobile search is open
    if (isMobileSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    // Cleanup event listeners
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobileSearchOpen]);

  return (
    <div
      ref={searchContainerRef}
      className={`search-container ${isFocused ? "focused" : ""} ${
        isMobileSearchOpen ? "mobile-search-open" : ""
      }`}
    >
      {/* Mobile Search Icon (visible only on mobile when search is closed) */}
      <div className="mobile-search-icon-wrapper">
        <Tooltip
          title="Search"
          placement="bottom"
          arrow={false}
          PopperProps={{
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, 4],
                },
              },
            ],
          }}
        >
          <div
            className="mobile-search-icon"
            onClick={handleMobileSearchToggle}
          >
            <SearchIcon className="search-icon" />
          </div>
        </Tooltip>
      </div>

      {/* Desktop/Mobile Search Bar */}
      <div className="search-input-wrapper">
        {/* Mobile Back Arrow (visible only when mobile search is open) */}
        {isMobileSearchOpen && (
          <Tooltip
            title="Close search"
            placement="bottom"
            arrow={false}
            PopperProps={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, 4],
                  },
                },
              ],
            }}
          >
            <IconButton
              onClick={handleMobileSearchClose}
              className="mobile-back-button"
              size="small"
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
        )}

        {/* Desktop Search Icon (hidden on mobile when search is closed) */}
        <div className="desktop-search-icon-wrapper">
          <Tooltip
            title="Search"
            placement="bottom"
            arrow={false}
            PopperProps={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, 4],
                  },
                },
              ],
            }}
          >
            <div className="search-icon-wrapper">
              <SearchIcon className="search-icon" />
            </div>
          </Tooltip>
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="search-input"
        />
        {searchQuery && (
          <Tooltip
            title="Clear search"
            placement="bottom"
            arrow={false}
            PopperProps={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, 4],
                  },
                },
              ],
            }}
          >
            <IconButton
              onClick={handleClear}
              className="clear-button"
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
