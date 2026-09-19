import { Landmark, Printer, Download, RotateCcw, PenLine } from "lucide-react";
import Header from "./Header";
import { generateMobileUpdatePDF } from "./formEngine";

function MobileFormScreen({ language, passbookData, newMobileNumber, onStartOver, onBack, onStaff }) {
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
    <>
      <Header lang={language} onStaff={onStaff} />
      <div className="bm-screen">
        <h1 className="bm-h2">{t("फ़ॉर्म प्रीव्यू", "Form Preview")}</h1>

        <div className="bm-paper">
          <div className="bm-paper-title">
            <Landmark size={18} aria-hidden="true" /> {t("बैंक फॉर्म", "BANK FORM")}
          </div>

          <div className="bm-row">
            <span className="bm-row-key">{t("खाताधारक", "Account Holder")}</span>
            <span className="bm-row-val">{passbookData.accountHolder}</span>
          </div>
          <div className="bm-row">
            <span className="bm-row-key">{t("नया नंबर", "New Number")}</span>
            <span className="bm-row-val">{newMobileNumber}</span>
          </div>
          <div className="bm-row">
            <span className="bm-row-key">{t("अनुरोध प्रकार", "Transaction Type")}</span>
            <span className="bm-row-val">{t("मोबाइल अपडेट", "Mobile Update")}</span>
          </div>

          <div className="bm-label" style={{ marginTop: 16 }}>
            {t("ग्राहक हस्ताक्षर", "Customer Signature")}
          </div>
          <div className="bm-sign-box">
            <PenLine size={18} aria-hidden="true" />
            <span>{t("कृपया यहाँ हस्ताक्षर करें", "Please sign here")}</span>
          </div>
        </div>

        <button className="bm-btn bm-btn-primary" onClick={handlePrint}>
          <Printer size={20} aria-hidden="true" /> {t("फ़ॉर्म प्रिंट करें", "Print Form")}
        </button>
        <button className="bm-btn bm-btn-outline" onClick={handleDownload}>
          <Download size={20} aria-hidden="true" /> {t("डाउनलोड करें", "Download PDF")}
        </button>
        <button className="bm-btn bm-btn-outline" onClick={onStartOver}>
          <RotateCcw size={20} aria-hidden="true" /> {t("शुरू से शुरू करें", "Start Over")}
        </button>
      </div>
    </>
  );
}

export default MobileFormScreen;