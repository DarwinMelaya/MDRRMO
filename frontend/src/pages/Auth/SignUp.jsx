import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createProfile } from "../../Api/Profiles";
import AuthShell, {
  authButtonClass,
  authFieldClass,
  authLabelClass,
  authLinkClass,
} from "../../Components/Auth/AuthShell";
import PasswordField from "../../Components/Auth/PasswordField";

const ROLE_OPTIONS = [
  { value: "Community", label: "Community" },
  { value: "Agencies", label: "Agencies" },
];

const SignUp = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(ROLE_OPTIONS[0].value);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const canSubmit = useMemo(() => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    return (
      trimmedName.length >= 2 &&
      trimmedEmail.length >= 5 &&
      password.length >= 6 &&
      !!role
    );
  }, [name, email, password, role]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail || !password || !role) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const { error: insertError } = await createProfile({
        name: trimmedName,
        email: trimmedEmail,
        password,
        role,
      });

      if (insertError) {
        const msg =
          insertError?.code === "23505"
            ? "Email already exists. Please use another email."
            : insertError.message || "Failed to create account.";
        setError(msg);
        return;
      }

      setSuccess("Account created. Redirecting to login…");
      setName("");
      setEmail("");
      setPassword("");
      setRole(ROLE_OPTIONS[0].value);
      setTimeout(() => navigate("/"), 800);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      badge="MDRRMO Portal"
      title="Register Operator"
      subtitle="Create a profile to access the incident command network."
      footer={
        <>
          Already have an account?{" "}
          <Link className={authLinkClass} to="/">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className={authLabelClass} htmlFor="signup-name">
            Full name
          </label>
          <input
            id="signup-name"
            className={authFieldClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            autoComplete="name"
            disabled={loading}
          />
        </div>

        <div>
          <label className={authLabelClass} htmlFor="signup-email">
            Email
          </label>
          <input
            id="signup-email"
            className={authFieldClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            type="email"
            autoComplete="email"
            disabled={loading}
          />
        </div>

        <PasswordField
          id="signup-password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          autoComplete="new-password"
          disabled={loading}
        />

        <div>
          <label className={authLabelClass} htmlFor="signup-role">
            Role
          </label>
          <select
            id="signup-role"
            className={authFieldClass}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={loading}
          >
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-slate-900">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-300">
            {success}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className={authButtonClass}
        >
          {loading ? "Creating profile…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
};

export default SignUp;
