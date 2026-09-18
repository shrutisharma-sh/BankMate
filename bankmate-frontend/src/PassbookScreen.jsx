function PassbookScreen({ language, passbookData, onContinue, onBack }) {
  const t = (hi, en) => (language === "hi" ? hi : en);

  return (
    <div className="kiosk">
      <h2 className="title" style={{ fontSize: "2.2rem" }}>
        {t("पासबुक मिल गई ✓", "Passbook detected ✓")}
      </h2>

      <div className="info-card">
        <div className="info-row">
          <span className="info-label">{t("खाताधारक", "Account Holder")}</span>
          <span className="info-value">{passbookData.accountHolder}</span>
        </div>
        <div className="info-row">
          <span className="info-label">{t("खाता संख्या", "Account Number")}</span>
          <span className="info-value">
            XXXX XXXX {passbookData.accountNumber.slice(-4)}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">{t("शाखा", "Branch")}</span>
          <span className="info-value">{passbookData.branch}</span>
        </div>
      </div>

      <p className="privacy-note">
        🔒 {t(
          "आपका दस्तावेज़ अस्थायी रूप से प्रोसेस किया गया है। यह स्थायी रूप से संग्रहीत नहीं है।",
          "Your document is processed temporarily. It is not permanently stored."
        )}
      </p>

      <button className="start-btn" onClick={onContinue}>
        {t("आगे बढ़ें", "CONTINUE")}
      </button>

      <button
        onClick={onBack}
        style={{
          marginTop: "1.5em",
          background: "none",
          border: "none",
          color: "#94a3b8",
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        {t("← वापस", "← Back")}
      </button>
    </div>
  );
}

export default PassbookScreen;