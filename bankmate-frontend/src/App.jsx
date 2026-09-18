import { useState } from "react";
import "./App.css";
import CameraScreen from "./CameraScreen";
import PassbookScreen from "./PassbookScreen";
import VoiceScreen from "./VoiceScreen";
import ConfirmScreen from "./ConfirmScreen";
import FormScreen from "./FormScreen";
import StaffScreen from "./StaffScreen";
import { scanPassbook } from "./api";
import MobileNumberScreen from "./MobileNumberScreen";
import MobileFormScreen from "./MobileFormScreen";

function App() {
  const [language, setLanguage] = useState(null);
  const [screen, setScreen] = useState("welcome");
  const [passbookData, setPassbookData] = useState(null);
  const [intentData, setIntentData] = useState(null);
  const [error, setError] = useState(null);
  const [newMobileNumber, setNewMobileNumber] = useState(null);

  const t = (hi, en) => (language === "hi" ? hi : en);

  async function handleCaptured(imageDataUrl) {
    setScreen("scanning");
    setError(null);
    try {
      const data = await scanPassbook(imageDataUrl);
      setPassbookData(data);
      setScreen("passbook");
    } catch (err) {
      setError(err.message);
      setScreen("camera");
    }
  }

  function handleIntentDetected(intent) {
    setIntentData(intent);
    setScreen("confirm");
  }

  function resetToStart() {
    setScreen("welcome");
    setPassbookData(null);
    setIntentData(null);
    setError(null);
  }

  let content;

  if (screen === "camera") {
    content = (
      <CameraScreen
        language={language}
        onBack={() => setScreen("welcome")}
        onCaptured={handleCaptured}
      />
    );
  } else if (screen === "scanning") {
    content = (
      <div className="kiosk">
        <h2 className="title" style={{ fontSize: "2rem" }}>
          {t("प्रोसेस हो रहा है...", "Processing...")}
        </h2>
        <p className="loading-text">{t("कृपया प्रतीक्षा करें", "Please wait")}</p>
      </div>
    );
  } else if (screen === "passbook" && passbookData) {
    content = (
      <PassbookScreen
        language={language}
        passbookData={passbookData}
        onBack={() => setScreen("camera")}
        onContinue={() => setScreen("voice")}
      />
    );
  } else if (screen === "voice") {
    content = (
      <VoiceScreen
        language={language}
        onIntentDetected={handleIntentDetected}
        onBack={() => setScreen("passbook")}
      />
    );
  } else if (screen === "confirm" && intentData) {
    content = (
      <ConfirmScreen
        language={language}
        intentData={intentData}
        onConfirm={() =>
  setScreen(intentData.intent === "MOBILE_UPDATE" ? "mobileNumber" : "form")
}
        onSpeakAgain={() => setScreen("voice")}
        onBack={() => setScreen("voice")}
      />
    );
  } else if (screen === "form" && passbookData && intentData) {
    content = (
      <FormScreen
        language={language}
        passbookData={passbookData}
        intentData={intentData}
        onStartOver={resetToStart}
        onBack={() => setScreen("confirm")}
      />
    );
  }
  else if (screen === "mobileNumber") {
    content = (
      <MobileNumberScreen
        language={language}
        onNumberConfirmed={(number) => {
          setNewMobileNumber(number);
          setScreen("mobileForm");
        }}
        onBack={() => setScreen("confirm")}
      />
    );
  } else if (screen === "mobileForm" && passbookData && newMobileNumber) {
    content = (
      <MobileFormScreen
        language={language}
        passbookData={passbookData}
        newMobileNumber={newMobileNumber}
        onStartOver={resetToStart}
        onBack={() => setScreen("mobileNumber")}
      />
    );}

  
   else if (screen === "staff") {
    content = <StaffScreen language={language} onBack={() => setScreen("welcome")} />;
  } else {
    content = (
      <div className="kiosk">
        <h1 className="title">BANKMATE</h1>
        <p className="subtitle">
          {language === "hi"
            ? "बिना पढ़े-लिखे भी आसान बैंकिंग"
            : "Banking without the literacy barrier"}
        </p>

        {error && (
          <p style={{ color: "#f87171", marginBottom: "1em" }}>
            {t("कुछ गलत हो गया, फिर कोशिश करें", "Something went wrong, please try again")}
          </p>
        )}

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

  return (
    <>
      {content}
      {screen !== "staff" && language && (
        <button className="staff-btn" onClick={() => setScreen("staff")}>
           {t("सहायता चाहिए?", "Need Staff Assistance?")}
        </button>
      )}
    </>
  );
}

export default App;