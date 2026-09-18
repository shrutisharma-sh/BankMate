function ConfirmScreen({ language, intentData, onConfirm, onSpeakAgain, onBack }) {
  const t = (hi, en) => (language === "hi" ? hi : en);

  const isUnknown = intentData.intent === "UNKNOWN";

  return (
    <div className="kiosk">
      <h2 className="title" style={{ fontSize: "2.2rem" }}>
        {isUnknown
          ? t("समझ नहीं आया", "I couldn't understand")
          : t("मैंने समझा:", "I understood:")}
      </h2>

      {isUnknown ? (
        <p style={{ fontSize: "1.3rem", color: "#f87171", marginBottom: "2em" }}>
          {t(
            "अनुरोध स्पष्ट रूप से समझ नहीं आया।",
            "I couldn't understand the request clearly."
          )}
        </p>
      ) : (
        <div className="info-card">
          <div className="info-row">
            <span className="info-label">{t("कार्य", "Task")}</span>
            <span className="info-value">
              {intentData.intent === "WITHDRAWAL"
                ? t("निकासी", "Withdrawal")
                : t("मोबाइल अपडेट", "Mobile Update")}
            </span>
          </div>
          {intentData.amount && (
            <div className="info-row">
              <span className="info-label">{t("राशि", "Amount")}</span>
              <span className="info-value">
                ₹{intentData.amount.toLocaleString("en-IN")}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="lang-toggle">
        {!isUnknown && (
          <button className="start-btn" onClick={onConfirm}>
            {t("हाँ, आगे बढ़ें", "YES, CONTINUE")}
          </button>
        )}
        <button className="lang-btn" onClick={onSpeakAgain}>
          {t("फिर से बोलें", "SPEAK AGAIN")}
        </button>
      </div>

      <button
        onClick={onBack}
        style={{
          marginTop: "2em",
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

export default ConfirmScreen;