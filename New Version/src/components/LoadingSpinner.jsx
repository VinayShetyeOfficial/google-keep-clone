import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

/**
 * Loading spinner component for authentication state checking
 * 
 * Features:
 * - Centered loading spinner
 * - Google Keep style design
 * - Smooth animation
 */
function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <CircularProgress 
          size={60} 
          thickness={4}
          sx={{ 
            color: '#fbbc04', // Google Keep yellow
            marginBottom: 2
          }} 
        />
        <h3>Loading Keep...</h3>
        <p>Please wait while we check your authentication status</p>
      </div>
    </div>
  );
}

export default LoadingSpinner; 