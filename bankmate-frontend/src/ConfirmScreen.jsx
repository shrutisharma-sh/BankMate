import { Banknote, Check, Info, Mic, Smartphone } from "lucide-react";
import Header from "./Header";

const T = {
  en: {
    heading: "Here is what I understood",
    question: "Is this correct?",
    yes: "Yes, Continue",
    again: "Speak Again",
    WITHDRAWAL: { title: "Withdraw Cash", desc: "Get cash from your account" },
    MOBILE_UPDATE: {
      title: "Update Mobile Number",
      desc: "Change your registered mobile number",
    },
    unknownTitle: "Sorry, I did not understand",
    unknownDesc:
      "Please try again and speak clearly. For example: \"I want to withdraw money\" or \"Update my mobile number\".",
  },
  hi: {
    heading: "मैंने यह समझा",
    question: "क्या यह सही है?",
    yes: "हाँ, आगे बढ़ें",
    again: "फिर से बोलें",
    WITHDRAWAL: { title: "पैसे निकालें", desc: "अपने खाते से नकद निकालें" },
    MOBILE_UPDATE: {
      title: "मोबाइल नंबर बदलें",
      desc: "अपना रजिस्टर्ड मोबाइल नंबर बदलें",
    },
    unknownTitle: "माफ़ कीजिए, समझ नहीं आया",
    unknownDesc:
      "कृपया साफ़ बोलकर फिर कोशिश करें। जैसे: \"पैसे निकालने हैं\" या \"मोबाइल नंबर बदलना है\"।",
  },
};

export default function ConfirmScreen({
  language,
  intentData,
  onConfirm,
  onSpeakAgain,
  onStaff,
}) {
  const lang = language || "en";
  const t = T[lang] || T.en;
  const intent = intentData?.intent;
  const known = intent === "WITHDRAWAL" || intent === "MOBILE_UPDATE";
  const isMobile = intent === "MOBILE_UPDATE";

  return (
    <>
      <Header lang={lang} onStaff={onStaff} />

      <div className="bm-screen" style={{ justifyContent: "center" }}>
        {known ? (
          <>
            <h1 className="bm-h2">{t.heading}</h1>

            <div className={`bm-service ${isMobile ? "bm-service--green" : ""}`}>
              {isMobile ? (
                <Smartphone className="bm-service-icon" aria-hidden="true" />
              ) : (
                <Banknote className="bm-service-icon" aria-hidden="true" />
              )}
              <div className="bm-service-body">
                <div className="bm-service-title">{t[intent].title}</div>
                <div className="bm-service-desc">{t[intent].desc}</div>
              </div>
            </div>

            <p className="bm-label">{t.question}</p>

            <button className="bm-btn bm-btn-primary" onClick={onConfirm}>
              <Check size={22} aria-hidden="true" /> {t.yes}
            </button>
            <button className="bm-btn bm-btn-outline" onClick={onSpeakAgain}>
              <Mic size={20} aria-hidden="true" /> {t.again}
            </button>
          </>
        ) : (
          <>
            <div className="bm-note bm-note--warn">
              <Info aria-hidden="true" />
              <div>
                <div style={{ fontSize: 17, fontWeight: 800 }}>{t.unknownTitle}</div>
                <div style={{ fontWeight: 500, marginTop: 4 }}>{t.unknownDesc}</div>
              </div>
            </div>

            <button className="bm-btn bm-btn-primary" onClick={onSpeakAgain}>
              <Mic size={20} aria-hidden="true" /> {t.again}
            </button>
          </>
        )}
      </div>
    </>
  );
}