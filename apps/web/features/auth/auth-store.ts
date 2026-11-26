"use client";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  token: string;
}

const AUTH_STORAGE_KEY = "nclex_auth_user_v1";
const USERS_DB_KEY = "nclex_registered_users_v1";
const RESET_CODES_KEY = "nclex_reset_codes_v1";

interface RegisteredUser {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  createdAt: string;
}

const getRegisteredUsers = (): RegisteredUser[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveRegisteredUsers = (users: RegisteredUser[]): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  } catch {
    // ignore
  }
};

export const getCurrentAuthUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setCurrentAuthUser = (user: AuthUser | null): void => {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      // Also sync student token so tests and schedule bind to this user
      localStorage.setItem("nclex_question_student_token_v1", user.token);
      localStorage.setItem("nclex_question_student_id_v1", user.id);
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    window.dispatchEvent(new CustomEvent("nclex_auth_state_changed", { detail: user }));
  } catch {
    // ignore
  }
};

export const registerUser = async (email: string, password: string): Promise<AuthUser> => {
  const cleanEmail = email.trim().toLowerCase();
  const username = cleanEmail.split("@")[0] || "nurse";

  if (!cleanEmail || !cleanEmail.includes("@")) {
    throw new Error("Please enter a valid email address.");
  }
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long.");
  }

  const users = getRegisteredUsers();
  const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    throw new Error("An account with this email already exists. Please log in.");
  }

  const newUser: RegisteredUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    email: cleanEmail,
    username,
    passwordHash: btoa(password), // simple client-side mock hash
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveRegisteredUsers(users);

  const authUser: AuthUser = {
    id: newUser.id,
    email: newUser.email,
    username: newUser.username,
    createdAt: newUser.createdAt,
    token: `token_${newUser.id}_${Date.now()}`
  };

  setCurrentAuthUser(authUser);
  return authUser;
};

export const loginUser = async (emailOrUsername: string, password: string): Promise<AuthUser> => {
  const query = emailOrUsername.trim();
  if (!query) throw new Error("Please enter your email or username.");
  if (!password) throw new Error("Please enter your password.");

  const users = getRegisteredUsers();
  const matched = users.find(
    (u) =>
      u.email.toLowerCase() === query.toLowerCase() ||
      u.username.toLowerCase() === query.toLowerCase()
  );

  // If matched registered user, check password
  if (matched) {
    if (matched.passwordHash !== btoa(password)) {
      throw new Error("Incorrect password. Please try again or reset your password.");
    }
    const authUser: AuthUser = {
      id: matched.id,
      email: matched.email,
      username: matched.username,
      createdAt: matched.createdAt,
      token: `token_${matched.id}_${Date.now()}`
    };
    setCurrentAuthUser(authUser);
    return authUser;
  }

  // If no user exists yet in local mock database, auto-provision user on valid credentials
  // so any test user can log in without friction
  const newUser: RegisteredUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    email: query.includes("@") ? query.toLowerCase() : `${query.toLowerCase()}@nclexlab.com`,
    username: query.includes("@") ? (query.split("@")[0] || "nurse") : query,
    passwordHash: btoa(password),
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveRegisteredUsers(users);

  const authUser: AuthUser = {
    id: newUser.id,
    email: newUser.email,
    username: newUser.username,
    createdAt: newUser.createdAt,
    token: `token_${newUser.id}_${Date.now()}`
  };

  setCurrentAuthUser(authUser);
  return authUser;
};

export const sendPasswordResetCode = async (email: string): Promise<{ code: string }> => {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes("@")) {
    throw new Error("Please enter a valid email address.");
  }

  // Generate simulated 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    const raw = localStorage.getItem(RESET_CODES_KEY);
    const map = raw ? JSON.parse(raw) : {};
    map[cleanEmail] = { code, expires: Date.now() + 15 * 60 * 1000 };
    localStorage.setItem(RESET_CODES_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }

  return { code };
};

export const resetPasswordWithCode = async (
  email: string,
  code: string,
  newPassword: string
): Promise<void> => {
  const cleanEmail = email.trim().toLowerCase();
  if (newPassword.length < 8) {
    throw new Error("New password must be at least 8 characters long.");
  }

  let valid = false;
  try {
    const raw = localStorage.getItem(RESET_CODES_KEY);
    const map = raw ? JSON.parse(raw) : {};
    const item = map[cleanEmail];
    if (item && item.code === code.trim() && Date.now() < item.expires) {
      valid = true;
    }
  } catch {
    valid = true; // fallback
  }

  // Allow test master code 123456 as well
  if (!valid && code.trim() !== "123456") {
    throw new Error("Invalid or expired verification code. Use the code shown or 123456.");
  }

  const users = getRegisteredUsers();
  const user = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (user) {
    user.passwordHash = btoa(newPassword);
    saveRegisteredUsers(users);
  }
};

export const logoutUser = (): void => {
  setCurrentAuthUser(null);
};
