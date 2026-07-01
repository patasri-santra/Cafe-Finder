import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../style/Register.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "User",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(
        "/auth/register",
        form
      );

      alert(res.data.message || "Registration successful");

      navigate("/home");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Registration failed"
      );
    }
  };

  return (
    <div className="container-register">

      <form onSubmit={handleSubmit} className="register">
        <h2>Register</h2>

        <input
          placeholder="Name"
          value={form.name}
          required
          className="register-input"
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          required
          className="register-input"
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          required
          className="register-input"
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        <select
          value={form.role}
          className="register-option"
          onChange={(e) =>
            setForm({
              ...form,
              role: e.target.value,
            })
          }
        >
          <option value="user">
            user
          </option>
          <option value="admin">
            Admin
          </option>
        </select>

        <button className="btn-register" >
          Register
        </button>

        <p>
        Already have an account?{" "}
        <Link to="/login">
          Login
        </Link>
      </p>
      </form>

    </div>
  );
}

export default Register;
