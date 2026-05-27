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
    return <Navigate to="/" replace />;
  }

  if (user.role !== "Admin") {
    if (user.role === "Community") {
      return <Navigate to="/feed" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

const RequireCommunity = ({ children }) => {
  const user = getSession();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== "Community") {
    if (user.role === "Admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
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

        {/* Community Routes */}
        <Route
          path="/feed"
          element={
            <RequireCommunity>
              <Layout variant="user">
                <Feed />
              </Layout>
            </RequireCommunity>
          }
        />
        <Route
          path="/reports"
          element={
            <RequireCommunity>
              <Layout variant="user">
                <Reports />
              </Layout>
            </RequireCommunity>
          }
        />
        <Route
          path="/user-profile"
          element={
            <RequireCommunity>
              <Layout variant="user">
                <UserProfile />
              </Layout>
            </RequireCommunity>
          }
        />

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
