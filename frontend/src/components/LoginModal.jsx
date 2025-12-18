import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { X, Mail, Lock, User, Loader2, KeyRound } from "lucide-react";

const LoginModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showVerification, setShowVerification] = useState(false); // [!code ++]

  const { login, signup, verifyEmail, isLoggingIn, isSigningUp, isVerifying } =
    useAuthStore();

  const [formData, setFormData] = useState({
    username: "",
    email: "", // [!code ++]
    password: "",
  });

  const [verificationCode, setVerificationCode] = useState(""); // [!code ++]
  const [tempUserId, setTempUserId] = useState(null); // [!code ++] To track who we are verifying

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- 1. LOGIN FLOW ---
    if (isLogin) {
      const success = await login({
        username: formData.username,
        password: formData.password,
      });
      if (success) onClose();
      return;
    }

    // --- 2. SIGNUP FLOW ---
    const result = await signup(formData);
    if (result.success && result.requiresVerification) {
      setTempUserId(result.userId);
      setShowVerification(true); // Switch to Verify View
    } else if (result.success) {
      onClose(); // Fallback if verification disabled
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    const success = await verifyEmail({
      userId: tempUserId,
      code: verificationCode,
    });
    if (success) onClose();
  };

  const handleGoogleLogin = () => {
    // If we are in dev, go to localhost:3000. If prod, go to /api/auth/google relative path.
    const baseURL =
      import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

    window.location.href = `${baseURL}/api/auth/google`;
  };

  // --- RENDER: VERIFICATION VIEW ---
  if (showVerification) {
    return (
      <div className="modal modal-open modal-bottom sm:modal-middle">
        <div className="modal-box relative">
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-2xl font-bold text-center mb-2">Verify Email</h3>
          <p className="text-center text-sm text-base-content/60 mb-6">
            We sent a code to{" "}
            <span className="font-semibold text-primary">{formData.email}</span>
          </p>

          <form onSubmit={handleVerification} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <KeyRound className="w-4 h-4" /> Verification Code
                </span>
              </label>
              <input
                type="text"
                placeholder="123456"
                className="input input-bordered w-full text-center text-2xl tracking-widest"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mt-4"
              disabled={isVerifying}
            >
              {isVerifying ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Verify & Login"
              )}
            </button>
          </form>
        </div>
        <div className="modal-backdrop bg-black/50"></div>
      </div>
    );
  }

  // --- RENDER: LOGIN / SIGNUP VIEW ---
  return (
    <div className="modal modal-open modal-bottom sm:modal-middle">
      <div className="modal-box relative">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <User className="w-4 h-4" /> Username
              </span>
            </label>
            <input
              type="text"
              placeholder="johndoe"
              className="input input-bordered w-full"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
          </div>

          {/* Email (Only for Signup) */}
          {!isLogin && (
            <div className="form-control animate-in fade-in zoom-in duration-300">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email
                </span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
          )}

          {/* Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <Lock className="w-4 h-4" /> Password
              </span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="input input-bordered w-full"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary w-full mt-4"
            disabled={isLoggingIn || isSigningUp}
          >
            {isLoggingIn || isSigningUp ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isLogin ? (
              "Login"
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="divider">OR</div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="btn btn-outline w-full flex items-center gap-2"
        >
          {/* ... (SVG Icon remains the same) ... */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        <p className="text-center mt-4 text-sm text-base-content/60">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="link link-primary no-underline hover:underline font-semibold"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </div>
  );
};

export default LoginModal;
