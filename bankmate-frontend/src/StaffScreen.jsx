import { useState } from "react";
import { X, UserRound, CheckCircle2, Home } from "lucide-react";

function StaffScreen({ language, onBack }) {
  const [requested, setRequested] = useState(false);
  const t = (hi, en) => (language === "hi" ? hi : en);

  if (requested) {
    return (
      <div className="bm-screen" style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <CheckCircle2 className="bm-badge" size={56} aria-hidden="true" />
        <h1 className="bm-h2">{t("मदद का अनुरोध किया गया", "Help requested")}</h1>
        <p className="bm-sub">
          {t(
            "एक बैंक कर्मचारी को सूचित कर दिया गया है।",
            "A bank staff member has been notified."
          )}
        </p>
        <button className="bm-btn bm-btn-primary" onClick={onBack}>
          <Home size={20} aria-hidden="true" /> {t("होम पर वापस जाएं", "Back to Home")}
        </button>
      </div>
    );
  }

  return (
    <div className="bm-overlay">
      <div className="bm-modal">
        <button className="bm-modal-close" onClick={onBack} aria-label="Close">
          <X size={18} aria-hidden="true" />
        </button>

        <UserRound size={48} className="bm-service-icon" aria-hidden="true" />

        <h1 className="bm-h2" style={{ textAlign: "center" }}>
          {t(
            "क्या आप चाहते हैं कि बैंक कर्मचारी आपकी सहायता करें?",
            "Would you like a bank staff member to assist you?"
          )}
        </h1>

        <button className="bm-btn bm-btn-primary" onClick={() => setRequested(true)}>
          {t("मदद माँगें", "Request Help")}
        </button>
        <button className="bm-btn bm-btn-outline" onClick={onBack}>
          {t("रद्द करें", "Cancel")}
        </button>
      </div>
    </div>
  );
}

export default StaffScreen;