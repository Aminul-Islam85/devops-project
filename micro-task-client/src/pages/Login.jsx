import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return setError(data.message || "Login failed.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");

    } catch {
      setError("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="w-full max-w-md p-8 shadow-lg bg-white rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {error && <div className="alert alert-error mb-4">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" name="email" placeholder="Email" className="input input-bordered w-full" required />
          <input type="password" name="password" placeholder="Password" className="input input-bordered w-full" required />

          <button type="submit" className="btn btn-primary w-full">Login</button>
        </form>

        <p className="mt-4 text-center">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
