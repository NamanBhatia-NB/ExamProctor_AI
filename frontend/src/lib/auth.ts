const API = "http://localhost:8080/api";

export const auth = {
  async login(email: string, password: string) {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error("Invalid email or password");
    }

    const data = await res.json();

    // Save token (if backend sends it)
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    // Save user
    localStorage.setItem("user", JSON.stringify(data.user));

    return data; // { user, token }
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem("token");
  }
};