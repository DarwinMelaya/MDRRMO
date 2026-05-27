import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createProfile } from "../../Api/Profiles";

const ROLE_OPTIONS = [
  { value: "Admin", label: "Admin" },
  { value: "Community", label: "Community" },
  { value: "Agencies", label: "Agencies" },
];

const SignUp = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(ROLE_OPTIONS[1].value);

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
        // Common Supabase/Postgres unique violation error shape
        const msg =
          insertError?.code === "23505"
            ? "Email already exists. Please use another email."
            : insertError.message || "Failed to create account.";
        setError(msg);
        return;
      }

      setSuccess("Account created. You can now log in.");
      setName("");
      setEmail("");
      setPassword("");
      setRole(ROLE_OPTIONS[1].value);
      setTimeout(() => navigate("/login"), 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Create account
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Store user info in Supabase DB (no Supabase Auth).
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              autoComplete="name"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              type="email"
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              type="password"
              autoComplete="new-password"
              disabled={loading}
            />
            <p className="mt-1 text-xs text-slate-500">
              Note: this stores the password as plain text in DB (per your
              request). Consider hashing later.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Role
            </label>
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-400"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {success}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          Already have an account?{" "}
          <Link className="font-medium text-slate-900 underline" to="/">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
