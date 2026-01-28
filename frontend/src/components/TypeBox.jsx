import { useRef, useEffect } from "react";
import useTypingStore from "../store/useTypingStore";
import useWordStore from "../store/useWordStore";
import { RefreshCcw } from "lucide-react"; // Optional: Icon for restart
import { useAuthStore } from "../store/useAuthStore";
import { useAppStore } from "../store/useAppStore";

const TypeBox = () => {
  const inputRef = useRef(null);
  const redoRef = useRef(null);

  const { words, selectedCount, setCountAndGetWords } = useWordStore();
  const { authUser } = useAuthStore();
  const { setIsLoginOpen } = useAppStore();

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

  // Auto-focus input on mount or reset
  useEffect(() => {
    if (!isFinished) {
      inputRef.current?.focus();
    }
  }, [isFinished]);

  const handleRedo = () => {
    resetGame();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // ========================================
  // --- STATS CALCULATION (Standardized) ---
  // ========================================
  const timeMs = (endTime || Date.now()) - (startTime || Date.now());
  const timeMins = timeMs / 60000;

  // 1. Calculate Total Characters Typed (including spaces)
  // We sum the length of every word typed so far + 1 space for each
  const totalChars =
    typedWords.reduce((sum, item) => sum + item.word.length, 0) +
    typedWords.length;

  // 2. Calculate Correct Characters (for Net WPM)
  // Only count characters from words that were typed correctly
  const correctChars =
    typedWords.reduce(
      (sum, item) => (item.isCorrect ? sum + item.word.length : sum),
      0,
    ) + correctWords; // +correctWords approximates spaces

  // 3. Raw WPM = (TotalChars / 5) / Minutes
  const rawWpm = timeMins > 0 ? Math.round(totalChars / 5 / timeMins) : 0;

  // 4. Net WPM = (CorrectChars / 5) / Minutes
  const wpm = timeMins > 0 ? Math.round(correctChars / 5 / timeMins) : 0;

  // 5. Accuracy
  const totalTypedWords = correctWords + incorrectWords;
  const accuracyPercent =
    totalTypedWords > 0
      ? Math.round((correctWords / totalTypedWords) * 100)
      : 0;

  // Current Target Word Logic
  const targetWord = words[currentWordIndex] || "";
  const hasTypo = !targetWord.startsWith(inputValue);

  // --- RENDER ---

  // 1. GAME OVER SCREEN
  if (isFinished) {
    return (
      <div className="flex flex-col flex-1 gap-10 justify-center items-center animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col gap-6 items-center text-center bg-base-200 p-10 rounded-2xl shadow-xl w-90 md:w-2xl">
          <h2 className="text-3xl font-bold text-primary">Test Completed!</h2>

          <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-100 w-full">
            <div className="stat place-items-center">
              <div className="stat-title">WPM</div>
              <div className="stat-value text-primary">{wpm}</div>
              <div className="stat-desc">Net Speed</div>
            </div>

            <div className="stat place-items-center">
              <div className="stat-title">Raw WPM</div>
              <div className="stat-value text-secondary">{rawWpm}</div>
              <div className="stat-desc">Uncorrected</div>
            </div>

            <div className="stat place-items-center">
              <div className="stat-title">Accuracy</div>
              <div className="stat-value">{accuracyPercent}%</div>
              <div className="stat-desc">{incorrectWords} Errors</div>
            </div>

            <div className="stat place-items-center">
              <div className="stat-title">Type</div>
              <div className="stat-value text-lg">English {selectedCount}</div>
              <div className="stat-desc">Words</div>
            </div>
          </div>

          <button
            onClick={handleRedo}
            className="btn btn-accent btn-lg w-full max-w-xs mt-4"
          >
            <RefreshCcw className="w-5 h-5 mr-2" /> Play Again
          </button>
        </div>
      </div>
    );
  }

  // 2. TYPING SCREEN (Existing UI)
  return (
    <div className="flex flex-col flex-1 gap-10 justify-center items-center">
      <div className="flex flex-col gap-2">
        {/* Top Bar: Word Count & Live Stats */}
        <div className="flex gap-4 justify-between w-90 md:w-2xl lg:w-3xl">
          <div className="flex gap-4">
            {counts.map((num) => (
              <div
                key={num}
                onClick={() => setCountAndGetWords(num)}
                className={`cursor-pointer transition-colors duration-200 ${
                  selectedCount === num
                    ? "text-base-content underline underline-offset-2"
                    : "text-base-content/30 hover:text-base-content"
                }`}
              >
                {num}
              </div>
            ))}
          </div>

          <div className="text-base-content/30 max-h-full">
            {/* Show live stats while typing */}
            {startTime && !isFinished && (
              <span>
                {wpm} WPM / {accuracyPercent}%
              </span>
            )}
          </div>
        </div>

        {/* Word Display Box */}
        <div
          className="w-90 max-h-auto md:w-2xl lg:w-3xl bg-base-300 p-6 rounded-lg shadow-md cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          <p className="text-lg md:text-xl leading-relaxed text-accent select-none">
            {words.map((word, index) => (
              // 1. The outer span handles the "key"
              <span key={index}>
                {/* 2. The inner span applies color/underline ONLY to the word text */}
                <span
                  className={`
                  ${
                    typedWords[index]
                      ? typedWords[index].isCorrect
                        ? "text-accent/30"
                        : "text-error"
                      : index === currentWordIndex
                        ? "text-secondary underline decoration-2 decoration-secondary/50 underline-offset-4"
                        : ""
                  }
                `}
                >
                  {word}
                </span>{" "}
              </span>
            ))}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5 items-center">
        {/* Input & Controls */}
        <div className="flex gap-5 w-90 md:w-2xl lg:w-3xl">
          <input
            ref={inputRef}
            type="text"
            placeholder="type here"
            className={`input input-accent flex-1 transition-colors duration-100 ${
              hasTypo ? "bg-error/20 text-error" : "bg-base-300"
            }`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value, words)} // on every change, we initiate setinputvalue
            onPaste={(e) => e.preventDefault()} // prevent pasting
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                e.preventDefault();
                handleRedo();
              }
            }}
          />
          <button
            className="btn btn-soft btn-accent"
            onClick={handleRedo}
            ref={redoRef}
            title="Restart Test (Tab)"
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
        </div>

        {/* bottom caption */}
        {authUser ? (
          <p className="text-base-content/30">
            view results from your profile!
          </p>
        ) : (
          <p className="text-base-content/30">
            <span
              onClick={() => setIsLoginOpen(true)}
              className="cursor-pointer duration-200 underline text-base-content/50 hover:text-accent"
            >
              login
            </span>{" "}
            to save results
          </p>
        )}
      </div>
    </div>
  );
};

export default TypeBox;
