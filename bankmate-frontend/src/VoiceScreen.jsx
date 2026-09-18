import { useState, useRef } from "react";

function VoiceScreen({ language, onIntentDetected, onBack }) {
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const t = (hi, en) => (language === "hi" ? hi : en);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorder.onstop = handleRecordingStop;

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      alert(t("माइक्रोफ़ोन एक्सेस आवश्यक है", "Microphone access is required"));
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
    }
    setRecording(false);
  }

  async function handleRecordingStop() {
    setProcessing(true);
    const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });

    const reader = new FileReader();
    reader.onloadend = async () => {

      // just to check mobile ipdate featurw 
      
            setTimeout(() => {
        setProcessing(false);
        onIntentDetected({
          intent: "MOBILE_UPDATE",
          amount: null,
          language: language,
        });
      }, 1200);
    };
    reader.readAsDataURL(audioBlob);
  }

  return (
    <div className="kiosk">
      <h2 className="title" style={{ fontSize: "2.2rem" }}>
        {t("आप क्या करना चाहते हैं?", "What would you like to do?")}
      </h2>

      {processing ? (
        <p className="loading-text">{t("समझ रहे हैं...", "Understanding...")}</p>
      ) : (
        <>
          <button
            className={`mic-btn ${recording ? "recording" : ""}`}
            onClick={recording ? stopRecording : startRecording}
          >
            🎤
          </button>
          <p className="mic-hint">
            {recording
              ? t("सुन रहे हैं... रोकने के लिए दबाएं", "Listening... tap to stop")
              : t("बोलने के लिए दबाएं", "Tap to speak")}
          </p>
          <p className="example-text">
            {t(
              'उदाहरण: "मुझे बीस हज़ार रुपये निकालने हैं।"',
              'Example: "I want to withdraw 20 thousand rupees."'
            )}
          </p>
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

export default VoiceScreen;