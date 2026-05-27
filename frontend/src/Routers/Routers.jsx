import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, SignUp, Login, AdminDashboard, AdminReport } from "../pages";

export const Routers = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/report" element={<AdminReport />} />
      </Routes>
    </Router>
  );
};
