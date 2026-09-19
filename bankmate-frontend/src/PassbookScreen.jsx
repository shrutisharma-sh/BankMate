import { CheckCircle2, User, CreditCard, Building2, Smartphone, AlertTriangle } from "lucide-react";
import Header from "./Header";

const T = {
  en: {
    title: "Passbook Details Extracted",
    holder: "Account Holder",
    number: "Account Number",
    branch: "Branch",
    mobile: "Mobile Number",
    confirm: "Is this information correct?",
    yes: "Yes, Continue",
    again: "Scan Again",
  },
  hi: {
    title: "पासबुक विवरण निकाला गया",
    holder: "खाताधारक",
    number: "खाता संख्या",
    branch: "शाखा",
    mobile: "मोबाइल नंबर",
    confirm: "क्या यह जानकारी सही है?",
    yes: "हाँ, आगे बढ़ें",
    again: "फिर से स्कैन करें",
  },
};

export default function PassbookScreen({ language, passbookData, onContinue, onBack, onStaff }) {
  const lang = language || "en";
  const t = T[lang] || T.en;

  const maskedAccount = passbookData.accountNumber
    ? `XXXX XXXX ${passbookData.accountNumber.slice(-4)}`
    : "";

  return (
    <>
      <Header lang={lang} onStaff={onStaff} />
      <div className="bm-screen">
        <div className="bm-status">
          <CheckCircle2 className="bm-badge" aria-hidden="true" />
          <h1 className="bm-h2">{t.title}</h1>
        </div>

        <div className="bm-card">
          <div className="bm-row">
            <User className="bm-row-icon" aria-hidden="true" />
            <span className="bm-row-key">{t.holder}</span>
            <span className="bm-row-val">{passbookData.accountHolder}</span>
          </div>
          <div className="bm-row">
            <CreditCard className="bm-row-icon" aria-hidden="true" />
            <span className="bm-row-key">{t.number}</span>
            <span className="bm-row-val">{maskedAccount}</span>
          </div>
          <div className="bm-row">
            <Building2 className="bm-row-icon" aria-hidden="true" />
            <span className="bm-row-key">{t.branch}</span>
            <span className="bm-row-val">{passbookData.branch}</span>
          </div>
          {passbookData.mobileNumber && (
            <div className="bm-row">
              <Smartphone className="bm-row-icon" aria-hidden="true" />
              <span className="bm-row-key">{t.mobile}</span>
              <span className="bm-row-val">{passbookData.mobileNumber}</span>
            </div>
          )}
        </div>

        <div className="bm-note bm-note--warn">
          <AlertTriangle aria-hidden="true" />
          <span>{t.confirm}</span>
        </div>

        <button className="bm-btn bm-btn-primary" onClick={onContinue}>
          {t.yes}
        </button>
        <button className="bm-btn bm-btn-outline" onClick={onBack}>
          {t.again}
        </button>
      </div>
    </>
  );
}