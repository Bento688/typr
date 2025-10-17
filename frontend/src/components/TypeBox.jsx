import { useRef, useEffect } from "react";
import useTypingStore from "../store/useTypingStore";
import useWordStore from "../store/useWordStore";

const TypeBox = () => {
  const inputRef = useRef(null);
  const { words, selectedCount, setCountAndGetWords } = useWordStore();
  const {
    inputValue,
    setInputValue,
    currentWordIndex,
    isFinished,
    resetGame,
    typedWords,
  } = useTypingStore();
  const counts = [10, 25, 50, 100, 250];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleRedo = () => {
    resetGame();

    // Focus to input after reset
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col flex-1 gap-10 justify-center items-center mt-10">
      <div className="flex flex-col gap-2">
        <div className="flex gap-4 justify-between w-90 md:w-2xl lg:w-3xl">
          <div className="flex gap-4">
            {counts.map((num) => (
              <div
                key={num}
                onClick={() => setCountAndGetWords(num)} // ✅ correct number
                className={`cursor-pointer transition-colors duration-200 ${
                  selectedCount === num
                    ? "text-base-content underline underline-offset-2" // ✅ highlighted
                    : "text-base-content/30 hover:text-base-content"
                }`}
              >
                {num}
              </div>
            ))}
          </div>

          <div className="text-base-content/30">WPM: / ACC%:</div>
        </div>
        <div className="w-90 max-h-auto md:w-2xl lg:w-3xl bg-base-300 p-6 rounded-lg shadow-md">
          <p className="text-lg md:text-xl leading-relaxed text-accent">
            {words.map((word, index) => (
              <span
                key={index}
                className={`
                  ${
                    typedWords[index]
                      ? typedWords[index].isCorrect
                        ? "text-success"
                        : "text-error"
                      : index === currentWordIndex
                      ? "text-primary"
                      : ""
                  }
                `}
              >
                {word}{" "}
              </span>
            ))}
          </p>
        </div>
      </div>

      <div className="flex gap-5 w-90 md:w-2xl lg:w-3xl">
        <input
          ref={inputRef}
          type="text"
          placeholder="type here"
          className="bg-base-300 input input-accent flex-1"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value, words)}
          disabled={isFinished}
        />
        <button className="btn btn-soft btn-accent" onClick={handleRedo}>
          Redo
        </button>
      </div>
    </div>
  );
};

export default TypeBox;
