import { useState } from "react";
import "./App.css";
import "./theme.css"; 
import WelcomeScreen from "./WelcomeScreen";
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
  // true for screens already moved to the new UI (they live inside .bm-app)
  let newUI = false;

  if (screen === "camera") {
    newUI = true;
    content = (
      <CameraScreen
        language={language}
        scanError={error}
        onStaff={() => setScreen("staff")}
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
  } else if (screen === "mobileNumber") {
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
    );
  } else if (screen === "staff") {
    content = <StaffScreen language={language} onBack={() => setScreen("welcome")} />;
  } else {
    // welcome (default)
    newUI = true;
    content = (
      <WelcomeScreen
        lang={language}
        setLang={setLanguage}
        onStart={() => setScreen("camera")}
        onStaff={() => setScreen("staff")}
      />
    );
  }

  // The floating staff button is only needed on screens not yet migrated
  // (migrated screens have "Call Staff" in their header).
  const showFloatingStaff = !newUI && screen !== "staff" && language;

  return (
    <>
      {newUI ? <div className="bm-app">{content}</div> : content}
      {showFloatingStaff && (
        <button className="staff-btn" onClick={() => setScreen("staff")}>
          {t("सहायता चाहिए?", "Need Staff Assistance?")}
        </button>
      )}
    </>
  );
}

export default App;