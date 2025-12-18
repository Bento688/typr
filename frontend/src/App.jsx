import { Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import TypeBox from "./components/TypeBox";
import Footer from "./components/Footer";
import ProfilePage from "./pages/ProfilePage";

import { useWordStore } from "./store/useWordStore";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import UsernameSetupModal from "./components/UsernameSetupModal";

const App = () => {
  const { getWords } = useWordStore();
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    getWords();
  }, [getWords]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <UsernameSetupModal />
      <Routes>
        {/* Existing Home Route */}
        <Route
          path="/"
          element={
            <div className="flex flex-col flex-grow">
              {/* Your existing TypeBox and other Home components go here 
                 OR if you have a HomePage component, use that.
                 Based on your previous code, you might need to wrap TypeBox in a fragment
             */}
              <div className="flex flex-grow justify-center container mx-auto px-4 py-4">
                {/* Whatever was previously in your main render return */}
                <TypeBox />
              </div>
              <Footer />
            </div>
          }
        />
        {/* New Profile Route */}
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
};

export default App;
