import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Home, SignUp, Login, AdminDashboard, AdminReport } from "../pages";
import Layout from "../Components/Layout/Layout";
import { getSession } from "../Api/Profiles";

const RequireAdmin = ({ children }) => {
  const user = getSession();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const Routers = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin/dashboard"
          element={
            <RequireAdmin>
              <Layout>
                <AdminDashboard />
              </Layout>
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/report"
          element={
            <RequireAdmin>
              <Layout>
                <AdminReport />
              </Layout>
            </RequireAdmin>
          }
        />
      </Routes>
    </Router>
  );
};
