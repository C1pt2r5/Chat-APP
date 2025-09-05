import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, ArrowRight, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  // Step-wise validation
  const validateStep = () => {
    if (step === 1) {
      if (!formData.email.trim()) return toast.error("Email is required");
      if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    }
    if (step === 2) {
      if (!formData.password) return toast.error("Password is required");
      if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep() === true) setStep(step + 1);
  };

  const handlePrev = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep() === true) {
      try {
        await login(formData);
        toast.success("Login successful!");
      } catch (err) {
        toast.error(err.message || "Login failed");
      }
    }
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content/60">Step {step} of 2</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className={`h-2 rounded-full bg-primary transition-all duration-500`}
              style={{ width: `${(step / 2) * 100}%` }}
            ></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Email */}
            {step === 1 && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-base-content/40" />
                  <input
                    type="email"
                    className="input input-bordered w-full pl-10"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Password */}
            {step === 2 && (
              <>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Password</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-base-content/40" />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="input input-bordered w-full pl-10"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-base-content/40" />
                      ) : (
                        <Eye className="h-5 w-5 text-base-content/40" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me + Forgot Password */}
                <div className="flex justify-between items-center mt-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="checkbox checkbox-sm"
                    />
                    Remember me
                  </label>
                  <Link to="/forgot-password" className="link text-sm link-primary">
                    Forgot password?
                  </Link>
                </div>
              </>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              {step > 1 && (
                <button type="button" className="btn btn-outline" onClick={handlePrev}>
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </button>
              )}
              {step < 2 && (
                <button type="button" className="btn btn-primary ml-auto" onClick={handleNext}>
                  Next <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              )}
              {step === 2 && (
                <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Bottom Link */}
          <div className="text-center mt-4">
            <p className="text-base-content/60">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="link link-primary">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <AuthImagePattern
        title="Welcome back!"
        subtitle="Sign in to continue your conversations and catch up with your messages."
      />
    </div>
  );
};
export default LoginPage;
