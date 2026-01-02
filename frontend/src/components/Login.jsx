import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/bg_image.jpg')",
        }}
      />
      <div className="absolute inset-0 backdrop-blur-md bg-black/30" />

      {/* Login card */}
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md p-8 z-10">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/agri.png"
            alt="Agriscope Logo"
            className="h-20 w-20 object-contain mb-2"
          />
          <h1 className="text-2xl font-bold text-green-700">
            Agriscope
          </h1>
          <p className="text-sm text-gray-500">
            Agriculture Officer Login
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <Input label="Username" placeholder="Enter your username" />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
          />
        </div>
        <button onClick={() => navigate("/harvest")} className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition">
          <LogIn size={18} />
          Login
        </button>

        {/* Info */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Access restricted to authorized agriculture officers only
        </p>
      </div>
    </div>
  );
}

function Input({ label, type = "text", placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-gray-700">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  );
}