import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  // Initialize state for form data, errors, and messages
  const [formData, setFormData] = useState({
    emailOrMobile: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Mock user data saved in localStorage
  useEffect(() => {
    const mockUser = {
      emailOrMobile: "user@example.com",
      password: "password123",
    };
    localStorage.setItem("mockUser", JSON.stringify(mockUser));
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear field-specific errors and general errors
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setError("");
  };

  // Validate form fields
  const validateForm = () => {
    let tempErrors = {};
    if (!formData.emailOrMobile) {
      tempErrors.emailOrMobile = "Email or mobile number is required";
    } else if (
      formData.emailOrMobile.includes("@") &&
      !/\S+@\S+\.\S+/.test(formData.emailOrMobile)
    ) {
      tempErrors.emailOrMobile = "Email is invalid";
    }
    if (!formData.password) {
      tempErrors.password = "Password is required";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const savedUser = JSON.parse(localStorage.getItem("mockUser"));
      console.log("Form Data:", formData);
      console.log("Saved User:", savedUser);

      if (
        formData.emailOrMobile === savedUser.emailOrMobile &&
        formData.password === savedUser.password
      ) {
        setSuccessMessage("Login successfully!");
        localStorage.setItem("isAuthenticated", "true");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setError("Invalid email, mobile number, or password.");
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | Food Delivery</title>
      </Helmet>

      <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto space-y-8">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl font-serif">Login</h2>
            <p className="mt-2 text-sm text-gray-600">
              Welcome back to Food Delivery
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded">
              {successMessage}
            </div>
          )}

          {/* Login Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
            onSubmit={handleSubmit}
          >
            <div>
              <input
                type="text"
                name="emailOrMobile"
                value={formData.emailOrMobile}
                onChange={handleChange}
                placeholder="Email Address or Mobile *"
                className="w-full border-b border-gray-300 py-2 px-1 focus:outline-none focus:border-[#8b6d3f] transition-colors"
              />
              {errors.emailOrMobile && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.emailOrMobile}
                </p>
              )}
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password *"
                className="w-full border-b border-gray-300 py-2 px-1 focus:outline-none focus:border-[#8b6d3f] transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-gray-500 hover:text-[#8b6d3f] transition-colors"
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5" />
                ) : (
                  <FiEye className="h-5 w-5" />
                )}
              </button>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#8b6d3f] focus:ring-[#8b6d3f] border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-[#8b6d3f] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-black text-white py-3 px-4 hover:bg-gray-800 transition-colors"
              >
                Login
              </button>
            </div>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#8b6d3f] hover:underline">
                Sign up
              </Link>
            </p>
          </motion.form>
        </div>
      </div>
    </>
  );
};

export default Login;
