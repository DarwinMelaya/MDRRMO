import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  SignUp,
  Login,
  AdminDashboard,
  AdminReport,
  Feed,
  Reports,
  UserProfile,
} from "../pages";
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
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Login />} />

        {/* User Routes */}
        <Route path="/feed" element={<Feed />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/user-profile" element={<UserProfile />} />

        {/* Admin Routes */}
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
