import { useState } from "react";

function MobileNumberScreen({ language, onNumberConfirmed, onBack }) {
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
    <div className="kiosk">
      <div style={{ fontSize: "3.5rem", marginBottom: "0.2em" }}>📱</div>

      <h2 className="title" style={{ fontSize: "2rem" }}>
        {confirming
          ? t("क्या यह सही है?", "Is this correct?")
          : t("नया मोबाइल नंबर डालें", "Enter new mobile number")}
      </h2>

      <div className="number-display">
        {displaySlots.map((d, i) => (
          <span key={i} className={`digit-slot ${d !== "_" ? "filled" : ""}`}>
            {d}
          </span>
        ))}
      </div>

      {!confirming ? (
        <>
          <div className="keypad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                className="key-btn"
                onClick={() => pressDigit(num.toString())}
              >
                {num}
              </button>
            ))}
            <button className="key-btn key-btn-action" onClick={pressBackspace}>
              ⌫
            </button>
            <button className="key-btn" onClick={() => pressDigit("0")}>
              0
            </button>
            <button
              className="key-btn key-btn-action"
              onClick={() => speakNumber(digits || "0")}
            >
              🔊
            </button>
          </div>

          <button
            className="start-btn"
            disabled={digits.length !== 10}
            onClick={handleReadBack}
            style={{ marginTop: "1.5em" }}
          >
            {t("आगे बढ़ें", "CONTINUE")}
          </button>
        </>
      ) : (
        <>
          <button
            className="start-btn"
            style={{ marginBottom: "1em" }}
            onClick={() => speakNumber(digits)}
          >
            🔊 {t("फिर से सुनें", "HEAR AGAIN")}
          </button>

          <div className="lang-toggle">
            <button className="lang-btn" onClick={handleReEnter}>
              {t("फिर से डालें", "RE-ENTER")}
            </button>
            <button className="start-btn" onClick={handleConfirm}>
              {t("हाँ, सही है", "YES, CORRECT")}
            </button>
          </div>
        </>
      )}

      <button
        onClick={onBack}
        style={{
          marginTop: "2em",
          background: "none",
          border: "none",
          color: "#94a3b8",
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        {t("← वापस", "← Back")}
      </button>
    </div>
  );
}

export default MobileNumberScreen;