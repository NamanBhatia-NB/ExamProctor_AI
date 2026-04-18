// ✅ Use NEXT_PUBLIC_ so Next.js doesn't hide it
const API = `${process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost:8080'}/api`;

export const auth = {
  async login(email: string, password: string) {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    // Read the stream EXACTLY ONCE as plain text
    const responseText = await res.text();

    // Handle Errors safely
    if (!res.ok) {
      let errorMessage = "Invalid email or password";
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = responseText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    // Handle Success
    const data = JSON.parse(responseText);

    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    const userData = data.user ? data.user : data;
    localStorage.setItem("user", JSON.stringify(userData));

    return data;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser() {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    }
    
    // If we are on the server, return null
    return null;
  },

  getToken() {
    return localStorage.getItem("token");
  },

  async register(name: string, email: string, password: string) {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    // ✅ APPLIED THE SAME STREAM FIX HERE!
    const responseText = await res.text();

    if (!res.ok) {
      let errorMessage = "Registration failed";
      try {
        const data = JSON.parse(responseText);
        errorMessage = data.message || errorMessage;
      } catch (e) {
        errorMessage = responseText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return JSON.parse(responseText);
  },
};