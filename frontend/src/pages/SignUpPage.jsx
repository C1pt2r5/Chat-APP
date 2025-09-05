import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  // validation for each step
  const validateStep = () => {
    if (step === 1) {
      if (!formData.fullName.trim()) return toast.error("Full name is required");
      if (!formData.email.trim()) return toast.error("Email is required");
      if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    }
    if (step === 2) {
      if (!formData.password) return toast.error("Password is required");
      if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
      if (formData.password !== formData.confirmPassword) return toast.error("Passwords do not match");
    }
    return true;
  };

  const handleNext = () => {
    const valid = validateStep();
    if (valid === true) setStep(step + 1);
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valid = validateStep();
    if (valid === true) {
      try {
        await signup(formData);
        toast.success("Account created successfully!");
      } catch (err) {
        toast.error(err.message || "Signup failed");
      }
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">Step {step} of 3</p>
            </div>
          </div>

          {/* PROGRESS BAR */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div className={`h-2 rounded-full bg-primary transition-all duration-500`} style={{ width: `${(step / 3) * 100}%` }}></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Full Name + Email */}
            {step === 1 && (
              <>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Full Name</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 size-5 text-base-content/40" />
                    <input
                      type="text"
                      className="input input-bordered w-full pl-10"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 size-5 text-base-content/40" />
                    <input
                      type="email"
                      className="input input-bordered w-full pl-10"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Password */}
            {step === 2 && (
              <>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Password</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 size-5 text-base-content/40" />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="input input-bordered w-full pl-10"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="size-5 text-base-content/40" /> : <Eye className="size-5 text-base-content/40" />}
                    </button>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Confirm Password</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 size-5 text-base-content/40" />
                    <input
                      type="password"
                      className="input input-bordered w-full pl-10"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Review & Submit */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-base-200">
                  <h2 className="font-semibold mb-2 flex items-center gap-2"><CheckCircle className="text-green-500 size-5"/> Review Your Details</h2>
                  <p><strong>Name:</strong> {formData.fullName}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                </div>
                <p className="text-sm text-base-content/60">Click "Create Account" to finish.</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              {step > 1 && (
                <button type="button" className="btn btn-outline" onClick={handlePrev}>
                  <ArrowLeft className="size-4 mr-1" /> Back
                </button>
              )}
              {step < 3 && (
                <button type="button" className="btn btn-primary ml-auto" onClick={handleNext}>
                  Next <ArrowRight className="size-4 ml-1" />
                </button>
              )}
              {step === 3 && (
                <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
                  {isSigningUp ? (
                    <>
                      <Loader2 className="size-5 animate-spin" /> Loading...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};

export default SignUpPage;
