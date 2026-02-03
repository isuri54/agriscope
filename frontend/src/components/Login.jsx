import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });

      // Save token
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.user.username);
      localStorage.setItem("officerId", response.data.user.id);

      // Go to harvest page
      navigate("/harvest");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg_image.jpg')" }}
      />
      <div className="absolute inset-0 backdrop-blur-md bg-black/30" />

      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md p-8 z-10">
        <div className="flex flex-col items-center mb-6">
          <img src="/agri.png" alt="Agriscope Logo" className="h-20 w-20 object-contain mb-2" />
          <h1 className="text-2xl font-bold text-green-700">Agriscope</h1>
          <p className="text-sm text-gray-500">Agriculture Officer Login</p>
        </div>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <LogIn size={18} />
            Login
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          Access restricted to authorized agriculture officers only
        </p>
      </div>
    </div>
  );
}