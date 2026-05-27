import supabase from "../utils/supabaseClient";

const SESSION_KEY = "mdrrmo_user_session";

export const createProfile = async ({ name, email, password, role }) => {
  const payload = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    role,
  };

  const { data, error } = await supabase
    .from("profiles")
    .insert([payload])
    .select("id, name, email, role, created_at")
    .single();

  return { data, error };
};

export const loginProfile = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, email, role, created_at")
    .eq("email", normalizedEmail)
    .eq("password", password)
    .maybeSingle();

  return { data, error };
};

export const setSession = (user) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

export const getSession = () => {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};
