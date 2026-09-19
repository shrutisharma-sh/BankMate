
import { Landmark, Phone } from "lucide-react";

export default function Header({ onStaff, lang = "en", large = false, hideStaff = false }) {
  return (
    <header className={`bm-header ${large ? "bm-header--large" : ""}`}>
      <div className="bm-brand">
        <Landmark className="bm-brand-icon" aria-hidden="true" />
        <span className="bm-brand-name">BankMate</span>
      </div>

      {!hideStaff && (
        <button className="bm-staff-btn" onClick={onStaff}>
          <Phone size={14} aria-hidden="true" />
          {lang === "hi" ? "स्टाफ बुलाएं" : "Call Staff"}
        </button>
      )}
    </header>
  );
}