import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../style/Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );
      navigate("/home");

      
    } catch (error) {
      alert(error.response.data.message);
    }
  };



  return (
    <div className="login-page">

      <form
        onSubmit={handleSubmit}
        className="login-card"
      >
      
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          className="login-input"
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          className="login-input"
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button type="submit" className="login-btn">
          Login
        </button>

        <p className="login-footer">
          Not have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>
      </form>

    </div>
  );
}

export default Login;
