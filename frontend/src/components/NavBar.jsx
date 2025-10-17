import { useState } from "react";
import { DAISYUI_THEMES } from "../constants/themes";
import useThemeStore from "../store/useThemeStore";

const NavBar = () => {
  const { selectedTheme, setTheme } = useThemeStore();
  const [hoverTheme, setHoverTheme] = useState(null);

  const currentTheme = hoverTheme || selectedTheme;
  document.documentElement.setAttribute("data-theme", currentTheme);

  return (
    <nav className="w-full bg-base text-base-content px-4 py-10 flex items-center justify-between relative">
      {/* Empty div to balance the center */}
      <div className="flex-1"></div>

      {/* Centered title */}
      <h1 className="text-2xl font-bold text-center absolute left-1/2 transform -translate-x-1/2">
        typr.space
      </h1>

      <div className="dropdown mr-10">
        <div tabIndex={0} role="button" className="btn m-1">
          Themes
          <svg
            width="12px"
            height="12px"
            className="inline-block h-2 w-2 fill-current opacity-60"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 2048 2048"
          >
            <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
          </svg>
        </div>
        <ul
          tabIndex="-1"
          className="dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-2xl max-h-64 overflow-y-auto right-0 translate-x-[-5%]"
        >
          {DAISYUI_THEMES.map((theme) => (
            <li key={theme}>
              <button
                className={`w-full btn btn-sm btn-block btn-ghost justify-start ${
                  selectedTheme === theme ? "underline" : ""
                }`}
                onMouseEnter={() => setHoverTheme(theme)} // live preview
                onMouseLeave={() => setHoverTheme(null)} // revert preview
                onClick={() => setTheme(theme)} // permanent selection
              >
                {theme}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
