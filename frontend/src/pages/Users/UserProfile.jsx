import { useNavigate } from "react-router-dom";
import { HiArrowLeftOnRectangle } from "react-icons/hi2";
import { clearSession, getSession } from "../../Api/Profiles";

const UserProfile = () => {
  const navigate = useNavigate();
  const user = getSession();

  const onLogout = () => {
    clearSession();
    navigate("/", { replace: true });
  };

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-white">Account</h1>
        <p className="mt-2 text-sm text-slate-400">
          Manage your community profile and settings.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-700/70 bg-slate-900/50 p-4">
        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
          Signed in as
        </p>
        <p className="mt-1 text-sm font-semibold text-white">
          {user?.name ?? "Community User"}
        </p>
        <p className="text-xs text-slate-400">{user?.email ?? "No email"}</p>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20"
      >
        <HiArrowLeftOnRectangle className="h-5 w-5" aria-hidden />
        Logout
      </button>
    </section>
  );
};

export default UserProfile;
