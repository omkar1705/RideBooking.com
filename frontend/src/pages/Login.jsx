import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/api";
import { useAuth } from "../context/AuthContext";
import ride from "../assets/images/ride-hailing.png";
import LoadingButton from "../components/LoadingButton";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { user } = await auth.login(formData);
      if (user?.user_metadata?.role) {
        // Use AuthContext login function to update state and navigate
        login(user);
      } else {
        throw new Error("User role not found");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.error || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Navigation */}
      <nav className="bg-white shadow-md py-4 px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1
            onClick={() => navigate("/")}
            className="text-3xl font-extrabold text-gray-900 cursor-pointer hover:opacity-80 transition-opacity"
          >
            Ride Booking<span className="text-yellow-500">.com</span>
          </h1>
        </div>
      </nav>

      {/* Background layout */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-white px-4 py-12">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Left Banner */}
          <div className="hidden md:flex flex-col justify-center items-center bg-yellow-100 p-8">
            <h2 className="text-4xl font-bold text-yellow-600 text-center leading-tight">
              Welcome Back!
            </h2>
            <p className="text-gray-700 mt-4 text-center">
              Book your ride in seconds. Safe, fast, and reliable.
            </p>
            <img src={ride} alt="Ride Illustration" className="w-3/4 mt-8" />
          </div>

          {/* Right Form */}
          <div className="p-10 sm:p-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Sign in to your account
            </h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-gray-800"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-gray-800"
                />
              </div>

              <LoadingButton
                type="submit"
                loading={isLoading}
                loadingText="Signing in..."
                className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white text-lg font-semibold rounded-md transition duration-300"
              >
                Sign in
              </LoadingButton>
            </form>

            <div className="text-center mt-6 text-gray-600">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-yellow-500 hover:underline font-medium"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
