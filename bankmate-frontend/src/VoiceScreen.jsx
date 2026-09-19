import { useState, useRef } from "react";

function VoiceScreen({ language, onIntentDetected, onBack }) {
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const recognitionRef = useRef(null);

  const t = (hi, en) => (language === "hi" ? hi : en);

  function speakConfirmation(intent) {
    const message =
      language === "hi"
        ? intent === "WITHDRAWAL"
          ? "निकासी फॉर्म बनाया जा रहा है"
          : intent === "MOBILE_UPDATE"
          ? "मोबाइल नंबर अपडेट फॉर्म बनाया जा रहा है"
          : "समझ नहीं आया, कृपया फिर से बोलें"
        : intent === "WITHDRAWAL"
        ? "Generating withdrawal form"
        : intent === "MOBILE_UPDATE"
        ? "Generating mobile update form"
        : "I did not understand, please try again";

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
    utterance.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function detectIntent(transcript) {
    const text = transcript.toLowerCase();

    const withdrawalWords = ["withdraw", "nikal", "nikalne", "nikalna", "cash", "paisa", "paise", "rupee", "rupaye"];
    const mobileWords = ["mobile", "number", "nambar", "phone", "update"];

    const hasWithdrawal = withdrawalWords.some(function (w) {
      return text.includes(w);
    });
    const hasMobile = mobileWords.some(function (w) {
      return text.includes(w);
    });

    if (hasWithdrawal && !hasMobile) {
      const numberMatch = text.match(/(\d+)/);
      let amount = numberMatch ? parseInt(numberMatch[1]) : 20000;
      if (text.includes("hazaar") || text.includes("thousand")) {
        if (numberMatch && amount < 1000) amount = amount * 1000;
      }
      return { intent: "WITHDRAWAL", amount: amount, language: language };
    }

    if (hasMobile && !hasWithdrawal) {
      return { intent: "MOBILE_UPDATE", amount: null, language: language };
    }

    return { intent: "UNKNOWN", amount: null, language: language };
  }

  function startRecording() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        t(
          "यह ब्राउज़र वॉयस पहचान का समर्थन नहीं करता। कृपया Chrome का उपयोग करें।",
          "This browser doesn't support voice recognition. Please use Chrome."
        )
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === "hi" ? "hi-IN" : "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = function () {
      setRecording(true);
    };

    recognition.onresult = function (event) {
      const transcript = event.results[0][0].transcript;
      setRecording(false);
      setProcessing(true);

      const intent = detectIntent(transcript);

      setTimeout(function () {
        setProcessing(false);
        speakConfirmation(intent.intent);
        onIntentDetected(intent);
      }, 800);
    };

    recognition.onerror = function () {
      setRecording(false);
      alert(t("सुन नहीं पाया, फिर कोशिश करें", "Couldn't hear you, please try again"));
    };

    recognition.onend = function () {
      setRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }

  function stopRecording() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setRecording(false);
  }

  return (
    <div className="kiosk">
      <h2 className="title" style={{ fontSize: "2.2rem" }}>
        {t("आप क्या करना चाहते हैं?", "What would you like to do?")}
      </h2>

      {processing ? (
        <p className="loading-text">{t("समझ रहे हैं...", "Understanding...")}</p>
      ) : (
        <div>
          <button
            className={"mic-btn" + (recording ? " recording" : "")}
            onClick={recording ? stopRecording : startRecording}
          >
            🎤
          </button>
          <p className="mic-hint">
            {recording
              ? t("सुन रहे हैं...", "Listening...")
              : t("बोलने के लिए दबाएं", "Tap to speak")}
          </p>
          <p className="example-text">
            {t(
              'उदाहरण: "मुझे बीस हज़ार रुपये निकालने हैं" या "मोबाइल नंबर अपडेट करना है"',
              'Example: "Withdraw 20000 rupees" or "Update mobile number"'
            )}
          </p>
        </div>
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

export default VoiceScreen;