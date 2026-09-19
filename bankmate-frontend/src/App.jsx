import { useState } from "react";

import "./theme.css";
import WelcomeScreen from "./WelcomeScreen";
import CameraScreen from "./CameraScreen";
import PassbookScreen from "./PassbookScreen";
import VoiceScreen from "./VoiceScreen";
import ConfirmScreen from "./ConfirmScreen";
import FormScreen from "./FormScreen";
import StaffScreen from "./StaffScreen";
import Header from "./Header";
import { scanPassbook } from "./api";
import MobileNumberScreen from "./MobileNumberScreen";
import MobileFormScreen from "./MobileFormScreen";

//crazyy shit
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
    newUI = true;
    content = (
      <>
        <Header lang={language} onStaff={() => setScreen("staff")} />
        <div className="bm-screen">
          <h1 className="bm-h1">
            {t("आपकी जानकारी निकाली जा रही है...", "Extracting your details...")}
          </h1>
          <div className="bm-progress">
            <div className="bm-progress-bar" />
          </div>
          <div className="bm-note">
            {t(
              "आपकी पासबुक सुरक्षित रूप से प्रोसेस की जाती है और सेव नहीं की जाती।",
              "Your passbook is processed securely and is not stored."
            )}
          </div>
        </div>
      </>
    );
  } else if (screen === "passbook" && passbookData) {
    newUI = true;
    content = (
      <PassbookScreen
        language={language}
        passbookData={passbookData}
        onBack={() => setScreen("camera")}
        onContinue={() => setScreen("voice")}
        onStaff={() => setScreen("staff")}
      />
    );
  } else if (screen === "voice") {
    newUI = true;
    content = (
      <VoiceScreen
        language={language}
        onIntentDetected={handleIntentDetected}
        onBack={() => setScreen("passbook")}
        onStaff={() => setScreen("staff")}
      />
    );
  } else if (screen === "confirm" && intentData) {
    newUI = true;
    content = (
      <ConfirmScreen
        language={language}
        intentData={intentData}
        onConfirm={() =>
          setScreen(intentData.intent === "MOBILE_UPDATE" ? "mobileNumber" : "form")
        }
        onSpeakAgain={() => setScreen("voice")}
        onStaff={() => setScreen("staff")}
      />
    );
  } else if (screen === "form" && passbookData && intentData) {
    newUI = true;
    content = (
      <FormScreen
        language={language}
        passbookData={passbookData}
        intentData={intentData}
        onStartOver={resetToStart}
        onBack={() => setScreen("confirm")}
        onStaff={() => setScreen("staff")}
      />
    );
  } else if (screen === "mobileNumber") {
    newUI = true;
    content = (
      <MobileNumberScreen
        language={language}
        onNumberConfirmed={(number) => {
          setNewMobileNumber(number);
          setScreen("mobileForm");
        }}
        onBack={() => setScreen("confirm")}
        onStaff={() => setScreen("staff")}
      />
    );
  } else if (screen === "mobileForm" && passbookData && newMobileNumber) {
    newUI = true;
    content = (
      <MobileFormScreen
        language={language}
        passbookData={passbookData}
        newMobileNumber={newMobileNumber}
        onStartOver={resetToStart}
        onBack={() => setScreen("mobileNumber")}
        onStaff={() => setScreen("staff")}
      />
    );
    } else if (screen === "staff") {
    newUI = true;
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

  
  

  return (
    <>
      {newUI ? <div className="bm-app">{content}</div> : content}
      
    </>
  );
}

export default App;