import { useEffect } from "react";
import { useThemeStore } from "../store/useThemeStore"; // Assuming you have this

const useDynamicFavicon = () => {
  const { theme } = useThemeStore();

  useEffect(() => {
    // 1. Helper function to get the resolved CSS color
    const getThemeColor = () => {
      const colors = [];
      // Create a temporary element to resolve the color from DaisyUI
      const bgColorElement = document.createElement("div");
      const tColorElement = document.createElement("div");
      bgColorElement.style.display = "none";
      tColorElement.style.display = "none";
      // We apply the DaisyUI class to ensure it grabs the correct theme variable
      // You can use 'text-primary', 'text-secondary', etc.
      bgColorElement.className = "text-base-100";
      tColorElement.className = "text-accent";
      document.body.appendChild(bgColorElement);
      document.body.appendChild(tColorElement);

      // Get the computed RGB/Hex value
      const bgColor = window.getComputedStyle(bgColorElement).color;
      const tColor = window.getComputedStyle(tColorElement).color;

      document.body.removeChild(bgColorElement);
      document.body.removeChild(tColorElement);

      colors.push(bgColor);
      colors.push(tColor);
      return colors;
    };

    const updateFavicon = () => {
      const color = getThemeColor();

      // 2. Your SVG Template (Replace with your actual logo path)
      // This is a simple 'T' for Typr, but you can paste your own SVG path here.
      // Notice we use the ${color} variable in the fill/stroke.
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="${color[0]}" />
          <text x="50" y="70" font-family="Arial, sans-serif" font-size="60" 
                text-anchor="middle" fill="${color[1]}" font-weight="bold">T</text>
        </svg>
      `;

      // 3. Encode SVG to Data URI
      const link =
        document.querySelector("link[rel*='icon']") ||
        document.createElement("link");
      link.type = "image/svg+xml";
      link.rel = "shortcut icon";
      link.href = `data:image/svg+xml;base64,${btoa(svg)}`;

      // Append if it didn't exist
      document.getElementsByTagName("head")[0].appendChild(link);
    };

    // Run immediately
    updateFavicon();
  }, [theme]); // Re-run whenever theme changes
};

export default useDynamicFavicon;
