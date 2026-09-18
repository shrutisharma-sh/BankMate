function StaffScreen({ language, onBack }) {
  const t = (hi, en) => (language === "hi" ? hi : en);

  return (
    <div className="kiosk">
      <div style={{ fontSize: "4rem", marginBottom: "0.3em" }}>🧑‍💼</div>

      <h2 className="title" style={{ fontSize: "2.2rem" }}>
        {t("बैंक कर्मचारी सहायता करेंगे", "A bank staff member can assist you")}
      </h2>

      <p style={{ fontSize: "1.3rem", color: "#cbd5e0", marginBottom: "2.5em" }}>
        {t("कृपया सहायता की प्रतीक्षा करें", "Please wait for assistance")}
      </p>

      <button className="start-btn" onClick={onBack}>
        {t("होम पर वापस जाएं", "RETURN TO HOME")}
      </button>
    </div>
  );
}

export default StaffScreen;