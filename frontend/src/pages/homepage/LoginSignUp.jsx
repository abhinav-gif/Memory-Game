import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function LoginSignUp() {
  const navigate = useNavigate();
  const handleUserClick = (user) => {
    if (user === "logout") {
      setIsUser(false);
      navigate("/");
    } else {
      // send login/signup info to auth page
      navigate(`/authentication/${user}`);
    }
  };

  const location = useLocation();
  // access the state sent by Auth.jsx
  const username = location.state?.username;
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    if (username) {
      setIsUser(true);
    }
  }, [username]);

  return (
    <div className="login-signup">
      {!isUser ? (
        <>
          <button
            className="login-btn"
            onClick={() => handleUserClick("login")}
          >
            Login
          </button>
          <button
            className="signup-btn"
            onClick={() => handleUserClick("signUp")}
          >
            Sign Up
          </button>
        </>
      ) : (
        <>
          <p>Hello {username}!</p>
          <button
            className="logout-btn"
            onClick={() => handleUserClick("logout")}
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}

export default LoginSignUp;
