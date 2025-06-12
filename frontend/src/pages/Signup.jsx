import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/api";
import ride from "../assets/images/ride-hailing.png";
import LoadingButton from "../components/LoadingButton";

export default function Signup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    role: "passenger",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await auth.register(formData);
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      setError(
        error.response?.data?.error ||
          error.response?.data?.details ||
          error.message ||
          "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Navbar */}
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

      {/* Page Layout */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-white px-4 py-12">
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Left panel */}
          <div className="hidden md:flex flex-col justify-center items-center bg-yellow-100 p-8">
            <h2 className="text-4xl font-bold text-yellow-600 text-center leading-tight">
              Join Our Ride Community
            </h2>
            <p className="text-gray-700 mt-4 text-center">
              Get started by creating your account.
            </p>
            <img src={ride} alt="Signup Illustration" className="w-3/4 mt-8" />
          </div>

          {/* Form Panel */}
          <div className="p-10 sm:p-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Create Your Account
            </h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <input
                  type="text"
                  name="full_name"
                  placeholder="Full Name"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-yellow-500 focus:border-yellow-500 text-gray-800"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-yellow-500 focus:border-yellow-500 text-gray-800"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-yellow-500 focus:border-yellow-500 text-gray-800"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-yellow-500 focus:border-yellow-500 text-gray-800"
                />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-yellow-500 focus:border-yellow-500 text-gray-800"
                >
                  <option value="passenger">Passenger</option>
                  <option value="driver">Driver</option>
                </select>
              </div>

              <LoadingButton
                type="submit"
                loading={isLoading}
                loadingText="Creating account..."
                className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white text-lg font-semibold rounded-md transition duration-300"
              >
                Sign up
              </LoadingButton>
            </form>

            <div className="text-center mt-6 text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-yellow-500 hover:underline font-medium"
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
