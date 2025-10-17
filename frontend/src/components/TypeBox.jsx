import { useRef, useEffect } from "react";
import useTypingStore from "../store/useTypingStore";
import useWordStore from "../store/useWordStore";

const TypeBox = () => {
  const inputRef = useRef(null);
  const redoRef = useRef(null);
  const { words, selectedCount, setCountAndGetWords } = useWordStore();
  const {
    inputValue,
    setInputValue,
    currentWordIndex,
    isFinished,
    resetGame,
    typedWords,
    startTime,
    endTime,
    correctWords,
    incorrectWords,
  } = useTypingStore();
  const counts = [10, 25, 50, 100, 250];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleRedo = () => {
    resetGame();

    setTimeout(() => {
      // Focus to input after reset
      inputRef.current?.focus();
    }, 0);
  };

  const totalWords = correctWords + incorrectWords;
  const elapsedTime =
    ((endTime || Date.now()) - (startTime || Date.now())) / 1000 / 60;
  const rawWpm = elapsedTime > 0 ? totalWords / elapsedTime : 0;
  const accuracy = totalWords > 0 ? correctWords / totalWords : 1; // fraction
  const effectiveWpm = Math.round(rawWpm * accuracy); // final WPM considering accuracy
  const accuracyPercent = Math.round(accuracy * 100);

  // Get the target word
  const targetWord = words[currentWordIndex] || "";

  // Check if typed word is correct so far
  const hasTypo = !targetWord.startsWith(inputValue);

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

          <div className="text-base-content/30">
            WPM: {effectiveWpm} / ACC%: {accuracyPercent}
          </div>
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
          className={`input input-accent flex-1 ${
            hasTypo ? "bg-error text-neutral-900" : "bg-base-300"
          }`}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value, words)}
          disabled={isFinished}
          onPaste={(e) => e.preventDefault()}
          onKeyDown={(e) => {
            if (e.key === "Tab") {
              e.preventDefault(); // prevent default tab behavior
              redoRef.current?.focus(); // focus redo button
            }
          }}
        />
        <button
          className="btn btn-soft btn-accent"
          onClick={handleRedo}
          ref={redoRef}
        >
          Redo
        </button>
      </div>
    </div>
  );
};

export default TypeBox;
