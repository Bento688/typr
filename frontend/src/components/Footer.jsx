import useTypingStore from "../store/useTypingStore";
import useWordStore from "../store/useWordStore";

const Footer = () => {
  const {
    selectedLanguage,
    setSelectedLanguage,
    setCountAndGetWords,
    selectedCount,
  } = useWordStore();
  const { resetGame } = useTypingStore();

  const toggleLanguage = () => {
    const newLang = selectedLanguage === "english" ? "zhuyin" : "english";
    setSelectedLanguage(newLang);
    setCountAndGetWords(selectedCount); // fetch new words with the updated
    resetGame();
  };

  return (
    <div className="mt-auto py-5 px-4">
      <div className="flex justify-center gap-4 ml-auto">
        <a
          href="https://www.linkedin.com/in/benedictestefan/"
          target="_blank"
          rel="noopener noreferrer"
          className=" text-base-content/30 hover:text-base-content transition-colors"
        >
          LinkedIn
        </a>
        <a
          href="https://github.com/Bento688"
          target="_blank"
          rel="noopener noreferrer"
          className="text-base-content/30 hover:text-base-content transition-colors"
        >
          GitHub
        </a>

        <span className="text-base-content/30">
          Language :{" "}
          <span
            className="text-base-content/30 hover:text-base-content cursor-pointer"
            onClick={toggleLanguage}
          >
            {selectedLanguage}
          </span>
        </span>
      </div>
    </div>
  );
};

export default Footer;
