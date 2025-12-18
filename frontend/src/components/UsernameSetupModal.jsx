import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { User, Check, Loader2 } from "lucide-react";

const UsernameSetupModal = () => {
  const { authUser, updateUsername } = useAuthStore();
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If user is not logged in OR doesn't need change, don't render
  const isOpen = authUser && authUser.needsUsernameChange;

  // Pre-fill with the auto-generated name so they can just click "Confirm" if they want
  useEffect(() => {
    if (authUser?.username) {
      setUsername(authUser.username);
    }
  }, [authUser]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await updateUsername(username);
    setIsSubmitting(false);
  };

  return (
    <div className="modal modal-open modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-2">Welcome to Typr!</h3>
        <p className="py-2 text-base-content/70">
          Please confirm or customize your unique username to get started.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <User className="w-4 h-4" /> Choose Username
              </span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              minLength={3}
              required
            />
          </div>

          <div className="modal-action">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Confirm Username <Check className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      {/* No backdrop close button to ensure they complete this step */}
      <div className="modal-backdrop bg-black/50"></div>
    </div>
  );
};

export default UsernameSetupModal;
