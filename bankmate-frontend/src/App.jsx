import { useState } from "react";
import "./App.css";
import CameraScreen from "./CameraScreen";

function App() {
  const [language, setLanguage] = useState(null);
  const [screen, setScreen] = useState("welcome"); // "welcome" | "camera"
  const [passbookImage, setPassbookImage] = useState(null);

  if (screen === "camera") {
    return (
      <CameraScreen
        language={language}
        onBack={() => setScreen("welcome")}
        onCaptured={(imageDataUrl) => {
          setPassbookImage(imageDataUrl);
          alert("Next: send this to Textract (Phase 3/4)");
        }}
      />
    );
  }

  return (
    <div className="kiosk">
      <h1 className="title">BANKMATE</h1>
      <p className="subtitle">
        {language === "hi"
          ? "बिना पढ़े-लिखे भी आसान बैंकिंग"
          : "Banking without the literacy barrier"}
      </p>

      <div className="lang-toggle">
        <button
          className={`lang-btn ${language === "hi" ? "active" : ""}`}
          onClick={() => setLanguage("hi")}
        >
          हिन्दी
        </button>
        <button
          className={`lang-btn ${language === "en" ? "active" : ""}`}
          onClick={() => setLanguage("en")}
        >
          English
        </button>
      </div>

      <button
        className="start-btn"
        disabled={!language}
        onClick={() => setScreen("camera")}
      >
        {language === "hi" ? "शुरू करें" : "START"}
      </button>
    </div>
  );
}

export default App;