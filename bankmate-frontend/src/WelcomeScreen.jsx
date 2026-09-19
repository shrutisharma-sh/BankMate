import { ArrowRight, Globe, HelpCircle, Phone } from "lucide-react";
import heroImg from "./assets/bankmate-hero.png";

const T = {
  en: {
    start: "Get Started",
    help: "Need Help?",
    helpSub: "Get assistance from our bank staff",
    staff: "Call Staff",
  },
  hi: {
    start: "शुरू करें",
    help: "मदद चाहिए?",
    helpSub: "बैंक स्टाफ से सहायता लें",
    staff: "स्टाफ बुलाएं",
  },
};

export default function WelcomeScreen({ lang, setLang, onStart, onStaff }) {
  const t = T[lang] || T.en;

  return (
    <div className="bm-welcome">
      <div className="bm-hero">
        <img
          src={heroImg}
          alt="BankMate: an elderly woman holding a passbook in front of a bank"
        />
        <button className="bm-staff-btn bm-staff-float" onClick={onStaff}>
          <Phone size={14} aria-hidden="true" />
          {t.staff}
        </button>
      </div>

      <div className="bm-screen">
        <div className="bm-lang-row" role="group" aria-label="Language">
          <button
            className={`bm-lang-btn ${lang === "en" ? "active" : ""}`}
            onClick={() => setLang("en")}
          >
            <Globe size={18} aria-hidden="true" /> English
          </button>
          <button
            className={`bm-lang-btn ${lang === "hi" ? "active" : ""}`}
            onClick={() => setLang("hi")}
          >
            <Globe size={18} aria-hidden="true" /> हिंदी
          </button>
        </div>

        <button className="bm-btn bm-btn-primary" onClick={onStart}>
          <ArrowRight size={22} aria-hidden="true" />
          {t.start}
        </button>

        <button className="bm-btn bm-btn-help" onClick={onStaff}>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <HelpCircle size={24} aria-hidden="true" />
            {t.help}
          </span>
          <small>{t.helpSub}</small>
        </button>
      </div>
    </div>
  );
}