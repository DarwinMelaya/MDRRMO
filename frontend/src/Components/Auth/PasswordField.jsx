import { useState } from "react";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import { authFieldClass, authLabelClass } from "./AuthShell";

const PasswordField = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  disabled,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label className={authLabelClass} htmlFor={id}>
        {label}
      </label>
      <div className="relative mt-1.5">
        <input
          id={id}
          type={visible ? "text" : "password"}
          className={`${authFieldClass} mt-0 pr-11`}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-cyan-300 disabled:opacity-50"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <HiEyeSlash className="h-5 w-5" aria-hidden />
          ) : (
            <HiEye className="h-5 w-5" aria-hidden />
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordField;
