import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "./Firebase.js";
import "./CustomButtons.css";
import theme from "./theme.js";

function LoginPage({ error }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (error) setErr(error);
  }, [error]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      await signInWithEmailAndPassword(auth, email, pass);
      navigate("/admin");
    } catch (error) {
      setErr("Giriş başarısız: " + error.message);
    }
  };

  return (
    <div
      style={{ backgroundColor: theme.colors["background-light"] }}
      className="d-flex justify-content-center align-items-center min-vh-100"
    >
      <div
        className="p-4 shadow-lg rounded-4"
        style={{ backgroundColor: theme.colors["card-background-light"] }}
      >
        <h3 className="text-center mb-4 mt-3">Administrator Panel Log In</h3>

        <form onSubmit={handleLogin}>
          <label htmlFor="email" style={{ fontFamily: theme.fonts.primary }}>
            Email
          </label>
          <div className="input-group">
            <span className="input-group-text mb-3 px-2">
              <i className="bi bi-person-circle"></i>
            </span>
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Please, enter your email"
              style={{ fontFamily: theme.fonts.secondary }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <label htmlFor="password" style={{ fontFamily: theme.fonts.primary }}>
            Password
          </label>
          <div className="input-group">
            <span className="input-group-text mb-3 px-2">
              <i className="bi bi-lock-fill"></i>
            </span>
            <input
              type="password"
              className="form-control mb-3"
              placeholder="Please, enter your password"
              style={{ fontFamily: theme.fonts.secondary }}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>

          {err && <p className="text-danger text-center mb-3">{err}</p>}

          <button
            id="custom-buttons"
            type="submit"
            className="btn btn-primary w-100 border-0 mb-2 fw-bold"
            style={{
              fontFamily: theme.fonts.primary,
              backgroundColor: theme.colors.primary,
            }}
          >
            Log In
          </button>
        </form>
      </div>

      <p
        style={{ fontFamily: theme.fonts.secondary }}
        className="fixed-bottom text-center"
      >
        © 2025 Nerede Yiyelim?
      </p>
    </div>
  );
}

export default LoginPage;
