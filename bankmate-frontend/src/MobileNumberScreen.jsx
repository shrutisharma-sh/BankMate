import { useState } from "react";
import { Smartphone, Volume2, Delete } from "lucide-react";
import Header from "./Header";

function MobileNumberScreen({ language, onNumberConfirmed, onBack, onStaff }) {
  const [digits, setDigits] = useState("");
  const [confirming, setConfirming] = useState(false);

  const t = (hi, en) => (language === "hi" ? hi : en);

  function pressDigit(d) {
    if (digits.length < 10) {
      setDigits(digits + d);
    }
  }

  function pressBackspace() {
    setDigits(digits.slice(0, -1));
  }

  function speakNumber(number) {
    const spoken = number.split("").join(", ");
    const utterance = new SpeechSynthesisUtterance(spoken);
    utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
    utterance.rate = 0.8;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function handleReadBack() {
    if (digits.length !== 10) return;
    setConfirming(true);
    speakNumber(digits);
  }

  function handleReEnter() {
    setDigits("");
    setConfirming(false);
    window.speechSynthesis.cancel();
  }

  function handleConfirm() {
    window.speechSynthesis.cancel();
    onNumberConfirmed(digits);
  }

  const displaySlots = Array.from({ length: 10 }, (_, i) => digits[i] || "_");

  return (
    <>
      <Header lang={language} onStaff={onStaff} />
      <div className="bm-screen">
        <Smartphone size={40} className="bm-service-icon" aria-hidden="true" />

        <h1 className="bm-h2">
          {confirming
            ? t("क्या यह सही है?", "Is this correct?")
            : t("नया मोबाइल नंबर डालें", "Enter new mobile number")}
        </h1>

        <div className="bm-display">
          {displaySlots.map((d, i) => (
            <span key={i} className={`bm-display-slot ${d !== "_" ? "filled" : ""}`}>
              {d}
            </span>
          ))}
        </div>

        {!confirming ? (
          <>
            <div className="bm-keypad">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  className="bm-key"
                  onClick={() => pressDigit(num.toString())}
                >
                  {num}
                </button>
              ))}
              <button className="bm-key" onClick={pressBackspace} aria-label="Backspace">
                <Delete size={20} aria-hidden="true" />
              </button>
              <button className="bm-key" onClick={() => pressDigit("0")}>
                0
              </button>
              <button
                className="bm-key"
                onClick={() => speakNumber(digits || "0")}
                aria-label="Speak number"
              >
                <Volume2 size={20} aria-hidden="true" />
              </button>
            </div>

            <button
              className="bm-btn bm-btn-primary"
              disabled={digits.length !== 10}
              onClick={handleReadBack}
            >
              {t("आगे बढ़ें", "Continue")}
            </button>
          </>
        ) : (
          <>
            <button className="bm-btn bm-btn-outline" onClick={() => speakNumber(digits)}>
              <Volume2 size={20} aria-hidden="true" /> {t("फिर से सुनें", "Hear Again")}
            </button>

            <button className="bm-btn bm-btn-primary" onClick={handleConfirm}>
              {t("हाँ, सही है", "Yes, Correct")}
            </button>
            <button className="bm-btn bm-btn-outline" onClick={handleReEnter}>
              {t("फिर से डालें", "Re-enter")}
            </button>
          </>
        )}

        <button className="bm-btn bm-btn-outline" onClick={onBack}>
          {t("← वापस", "← Back")}
        </button>
      </div>
    </>
  );
}

export default MobileNumberScreen;