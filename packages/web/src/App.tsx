import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import Todos from "./pages/Todos";
import { useAuthStore } from "./store/authStore";
import { ProtectedRoute } from "./components/auth/ProtectRoute";
import Navbar from "./components/Navbar";

const App = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/todos"
          element={
            <ProtectedRoute>
              <Todos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to={"/"} /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to={"/"} /> : <Register />}
        />
      </Routes>
    </Router>
  );
};

export default App;
