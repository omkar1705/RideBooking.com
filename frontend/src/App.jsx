import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PassengerDashboard from "./pages/PassengerDashboard";
import DriverDashboard from "./pages/DriverDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/passenger" element={<PassengerDashboard />} />
      <Route path="/driver" element={<DriverDashboard />} />
      <Route path="/authenticated" element={<AuthenticatedRoute />} />
    </Routes>
  );
}

function AuthenticatedRoute() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.user_metadata?.role;

  if (role) {
    return <Navigate to={`/${role}`} replace />;
  }

  return <Navigate to="/login" replace />;
}

export default App;
