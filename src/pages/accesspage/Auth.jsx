import "../../styles/Authpage.css";
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useParams();
  const [isUser, setIsUser] = useState(user);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isUser === "login") {
        const res = await axios.post("http://localhost:5000/api/login", {
          email: formData.email,
          password: formData.password,
        });
        const username = res.data.user.name;

        // Pass the username as state when navigating
        navigate("/", { state: { username: username } });
      } else {
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match");
          return;
        }
        const res = await axios.post("http://localhost:5000/api/signup", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        const username = res.data.user.name;
        navigate("/", { state: { username: username } });
      }
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
    }
  };

  const toggleForm = () => {
    if (isUser === "login") {
      navigate("/authentication/signUp");
      setIsUser("signUp");
    } else {
      navigate("/authentication/login");
      setIsUser("login");
    }
  };

  return (
    <div className="auth-page">
      <div className="form-container">
        <h1>{isUser === "login" ? "Login" : "Sign Up"}</h1>

        <form className={isUser === "login" ? "login-form" : "signup-form"}>
          {isUser === "signUp" && (
            <div className="input-group">
              <label>Full Name:</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          )}
          <div className="input-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              placeholder={
                isUser === "login" ? "Enter your password" : "Create a password"
              }
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          {isUser === "signUp" && (
            <div className="input-group">
              <label>Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          )}
          <button className="btn" onClick={handleSubmit}>
            {isUser === "login" ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="toggle-text">
          {isUser === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <span onClick={toggleForm} className="toggle-link">
            {isUser === "login" ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
