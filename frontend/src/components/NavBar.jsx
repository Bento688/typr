import { useState } from "react";
import { DAISYUI_THEMES } from "../constants/themes";
import useThemeStore from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";
import LoginModal from "./LoginModal";
import { LogOut, User as UserIcon } from "lucide-react"; // Optional icons
import { Link } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";

const NavBar = () => {
  const { selectedTheme, setTheme } = useThemeStore();
  const { authUser, logout } = useAuthStore(); // Access auth state
  const { isLoginOpen, setIsLoginOpen } = useAppStore();

  const [hoverTheme, setHoverTheme] = useState(null);

  const currentTheme = hoverTheme || selectedTheme;
  document.documentElement.setAttribute("data-theme", currentTheme);

  return (
    <nav className="w-full bg-base text-base-content px-4 py-10 flex items-center justify-between relative">
      <div className="flex-1 flex justify-start"></div>

      {/* Centered title */}
      <h1 className="text-2xl font-bold text-center absolute left-1/2 transform -translate-x-1/2">
        typr.space
      </h1>

      {/* Right Side: Themes + Login */}
      <div className="flex-1 flex items-center justify-end mr-6">
        {/* Theme Dropdown */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost m-1">
            Themes
            <svg
              width="12px"
              height="12px"
              className="inline-block h-2 w-2 fill-current opacity-60 ml-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 2048 2048"
            >
              <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-2xl max-h-64 overflow-y-auto"
          >
            {DAISYUI_THEMES.map((theme) => (
              <li key={theme}>
                <button
                  className={`w-full btn btn-sm btn-block btn-ghost justify-start ${
                    selectedTheme === theme ? "underline" : ""
                  }`}
                  onMouseEnter={() => setHoverTheme(theme)}
                  onMouseLeave={() => setHoverTheme(null)}
                  onClick={() => setTheme(theme)}
                >
                  {theme}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Auth Button */}
        {authUser ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost flex items-center gap-2"
            >
              {/* Avatar or Default Icon */}
              {authUser.avatar ? (
                <img
                  src={authUser.avatar}
                  alt="avatar"
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <UserIcon className="w-5 h-5" />
              )}
              <span className="hidden md:inline">{authUser.username}</span>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-300 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  {" "}
                  {/* [!code ++] */}
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <button onClick={logout} className="text-error">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <button
            onClick={() => setIsLoginOpen(true)}
            className="btn btn-primary btn-sm"
          >
            Login
          </button>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </nav>
  );
};

export default NavBar;
