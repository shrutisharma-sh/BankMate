import { generateWithdrawalPDF } from "./formEngine";

function FormScreen({ language, passbookData, intentData, onStartOver, onBack }) {
  const t = (hi, en) => (language === "hi" ? hi : en);

  function handlePrint() {
    const doc = generateWithdrawalPDF(passbookData, intentData);
    doc.autoPrint();
    window.open(doc.output("bloburl"), "_blank");
  }

  function handleDownload() {
    const doc = generateWithdrawalPDF(passbookData, intentData);
    doc.save("bankmate-withdrawal-form.pdf");
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
          <span className="info-label">{t("राशि", "Amount")}</span>
          <span className="info-value">
            ₹{intentData.amount.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">{t("हस्ताक्षर", "Signature")}</span>
          <span className="info-value" style={{ color: "#f87171" }}>
            {t("खाली (आप हस्ताक्षर करेंगे)", "Blank (you will sign)")}
          </span>
        </div>
      </div>

      <p className="privacy-note">
        {t(
          "1. विवरण जांचें 2. जहां बताया गया है वहां हस्ताक्षर करें 3. फ़ॉर्म बैंक कर्मचारी को जमा करें",
          "1. Check the details 2. Sign where indicated 3. Submit the form to bank staff"
        )}
      </p>

      <button className="start-btn" onClick={handlePrint}>
        🖨 {t("फ़ॉर्म प्रिंट करें", "PRINT FORM")}
      </button>

      <button
        className="lang-btn"
        style={{ marginTop: "1em" }}
        onClick={handleDownload}
      >
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

export default FormScreen;