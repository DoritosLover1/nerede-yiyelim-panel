import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "bootstrap-icons/font/bootstrap-icons.css";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Firebase.js";
import LoginPage from "./LoginPage.jsx";
import AdminPage from "./AdminPanel.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const ADMIN_EMAILS = [
    "neredeyiyelim1@gmail.com",
  ];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && ADMIN_EMAILS.includes(currentUser.email)) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {!user && <Route path="/login" element={<LoginPage />} />}
        {user && (
          <>
            <Route path="/admin" element={<AdminPage auth={auth} user={user} />} />
          </>
        )}
        <Route
          path="*"
          element={user ? <Navigate to="/admin" replace /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;