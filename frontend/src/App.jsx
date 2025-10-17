import NavBar from "./components/NavBar";
import TypeBox from "./components/TypeBox";
import Footer from "./components/Footer";

import { useWordStore } from "./store/useWordStore";
import { useEffect } from "react";

const App = () => {
  const { getWords } = useWordStore();

  useEffect(() => {
    getWords();
  }, [getWords]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <TypeBox />
      <Footer />
    </div>
  );
};

export default App;
