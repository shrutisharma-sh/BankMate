import { generateMobileUpdatePDF } from "./formEngine";

function MobileFormScreen({ language, passbookData, newMobileNumber, onStartOver, onBack }) {
  const t = (hi, en) => (language === "hi" ? hi : en);

  function handlePrint() {
    const doc = generateMobileUpdatePDF(passbookData, newMobileNumber);
    doc.autoPrint();
    window.open(doc.output("bloburl"), "_blank");
  }

  function handleDownload() {
    const doc = generateMobileUpdatePDF(passbookData, newMobileNumber);
    doc.save("bankmate-mobile-update-form.pdf");
  }

  return (
    <div className="kiosk">
      <h2 className="title" style={{ fontSize: "2.2rem" }}>
        {t("आपका फ़ॉर्म तैयार है", "Your form is ready")}
      </h2>

      <div className="info-card">
        <div className="info-row">
          <span className="info-label">{t("खाताधारक", "Account Holder")}</span>
          <span className="info-value">{passbookData.accountHolder}</span>
        </div>
        <div className="info-row">
          <span className="info-label">{t("नया नंबर", "New Number")}</span>
          <span className="info-value">{newMobileNumber}</span>
        </div>
        <div className="info-row">
          <span className="info-label">{t("हस्ताक्षर", "Signature")}</span>
          <span className="info-value" style={{ color: "#f87171" }}>
            {t("खाली (आप हस्ताक्षर करेंगे)", "Blank (you will sign)")}
          </span>
        </div>
      </div>

      <button className="start-btn" onClick={handlePrint}>
        🖨 {t("फ़ॉर्म प्रिंट करें", "PRINT FORM")}
      </button>

      <button className="lang-btn" style={{ marginTop: "1em" }} onClick={handleDownload}>
        {t("डाउनलोड करें", "Download PDF")}
      </button>

      <button
        onClick={onStartOver}
        style={{
          marginTop: "2em",
          background: "none",
          border: "none",
          color: "#94a3b8",
          fontSize: "1.1rem",
          cursor: "pointer",
        }}
      >
        {t("शुरू से शुरू करें", "START OVER")}
      </button>
    </div>
  );
}

export default MobileFormScreen;