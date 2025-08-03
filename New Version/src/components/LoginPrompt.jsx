import React from "react";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import keep_logo from "../assets/logo/keep_logo3.svg";

/**
 * Login prompt component for Google authentication
 * 
 * Props:
 * - onSignIn: function - Callback for sign-in action
 * - error: string - Error message to display
 * 
 * Features:
 * - Google Keep style design
 * - Error handling display
 * - Responsive layout
 */
function LoginPrompt({ onSignIn, error }) {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img 
            src={keep_logo} 
            alt="Keep" 
            style={{ width: "60px", height: "60px" }} 
          />
          <h1>Welcome to Keep</h1>
          <p>Sign in to access your notes</p>
        </div>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <div className="login-actions">
          <Button
            variant="contained"
            onClick={onSignIn}
            sx={{
              backgroundColor: '#4285f4', // Google blue
              color: 'white',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: 500,
              borderRadius: '4px',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#3367d6'
              }
            }}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              style={{ marginRight: '8px' }}
            >
              <path 
                fill="currentColor" 
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path 
                fill="currentColor" 
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path 
                fill="currentColor" 
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path 
                fill="currentColor" 
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </Button>
        </div>

        <div className="login-footer">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPrompt; 