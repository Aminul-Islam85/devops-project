import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const profilePic = form.profilePic.value;
    const password = form.password.value;
    const role = form.role.value;

    if (!email.includes("@") || password.length < 6) {
      return setError("Please enter a valid email and password (min 6 characters).");
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, profilePic, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        return setError(data.message || "Registration failed.");
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
        <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>

        {error && <div className="alert alert-error mb-4">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input type="text" name="name" placeholder="Name" className="input input-bordered w-full" required />
          <input type="email" name="email" placeholder="Email" className="input input-bordered w-full" required />
          <input type="text" name="profilePic" placeholder="Profile Picture URL" className="input input-bordered w-full" />
          <input type="password" name="password" placeholder="Password" className="input input-bordered w-full" required />

          <select name="role" className="select select-bordered w-full" required>
            <option value="">Select Role</option>
            <option value="worker">Worker</option>
            <option value="buyer">Buyer</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" className="btn btn-primary w-full">Register</button>
        </form>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
