import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginProfile, setSession } from "../../Api/Profiles";
import AuthShell, {
  authButtonClass,
  authFieldClass,
  authLabelClass,
  authLinkClass,
} from "../../Components/Auth/AuthShell";
import PasswordField from "../../Components/Auth/PasswordField";

const getRouteForRole = (role) => {
  if (role === "Admin") return "/admin/dashboard";
  if (role === "Community") return "/feed";
  return "/";
};

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    return email.trim().length >= 5 && password.length >= 6;
  }, [email, password]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data, error: loginError } = await loginProfile({ email, password });
      if (loginError) {
        setError(loginError.message || "Login failed.");
        return;
      }

      if (!data) {
        setError("Invalid email or password.");
        return;
      }

      setSession(data);
      navigate(getRouteForRole(data.role), { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      badge="MDRRMO Portal"
      title="Command Access"
      subtitle="Sign in to monitor incidents and community intelligence."
      footer={
        <>
          No account yet?{" "}
          <Link className={authLinkClass} to="/signup">
            Create account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className={authLabelClass} htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            className={authFieldClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            disabled={loading}
          />
        </div>

        <PasswordField
          id="login-password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          autoComplete="current-password"
          disabled={loading}
        />

        {error ? (
          <div className="rounded-xl border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className={authButtonClass}
        >
          {loading ? "Authenticating…" : "Enter Command Center"}
        </button>
      </form>
    </AuthShell>
  );
};

export default Login;
