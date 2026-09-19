import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Camera, Check, RotateCcw } from "lucide-react";
import Header from "./Header";

const T = {
  en: {
    hint: "Place your passbook inside the frame",
    captured: "Is your passbook clear and inside the frame?",
    retake: "Retake",
    use: "Use this photo",
    error: "Camera not available. Please allow camera access and try again.",
    retry: "Try again",
    scanError: "Could not read the passbook. Please try again.",
  },
  hi: {
    hint: "पासबुक को फ्रेम के अंदर रखें",
    captured: "क्या पासबुक साफ़ दिख रही है?",
    retake: "दोबारा लें",
    use: "आगे बढ़ें",
    error: "कैमरा उपलब्ध नहीं है। कृपया कैमरा की अनुमति दें और फिर कोशिश करें।",
    retry: "फिर कोशिश करें",
    scanError: "पासबुक पढ़ी नहीं जा सकी। कृपया फिर कोशिश करें।",
  },
};

export default function CameraScreen({ language, onStaff, onBack, onCaptured, scanError }) {
  const lang = language || "en";
  const t = T[lang] || T.en;
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [shot, setShot] = useState(null); // data URL of captured frame
  const [error, setError] = useState(false);
  const [flash, setFlash] = useState(false);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async () => {
    setError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (e) {
      console.error("Camera error:", e);
      setError(true);
    }
  };

  useEffect(() => {
    startCamera();
    return stopCamera; // cleanup on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

    setShot(canvas.toDataURL("image/jpeg", 0.85));
    setFlash(true);
    setTimeout(() => setFlash(false), 350);
    // Stream keeps running behind the frozen photo, so Retake just clears `shot`.
  };

  const retake = () => setShot(null);

  const useShot = () => {
    stopCamera();
    onCaptured(shot);
  };

  return (
    <div className="bm-cam">
      <video ref={videoRef} autoPlay playsInline muted />
      {shot && <img className="bm-cam-shot" src={shot} alt="Captured passbook" />}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div className="bm-cam-top">
        <Header lang={lang} onStaff={onStaff} />
      </div>

      {scanError && !shot && (
        <div className="bm-cam-toast">
          <div className="bm-note bm-note--warn">{t.scanError}</div>
        </div>
      )}

      {error ? (
        <div className="bm-cam-error">
          <p className="bm-h2" style={{ color: "#fff" }}>{t.error}</p>
          <button className="bm-btn bm-btn-primary" onClick={startCamera}>
            {t.retry}
          </button>
        </div>
      ) : (
        <>
          <div className={`bm-cam-frame ${shot ? "captured" : ""}`}>
            <span className="bm-cam-line v v1" />
            <span className="bm-cam-line v v2" />
            <span className="bm-cam-line h h1" />
            <span className="bm-cam-line h h2" />
            <i /><i /><i /><i />
          </div>

          <div className={`bm-cam-flash ${flash ? "on" : ""}`} />

          <div className="bm-cam-bottom">
            <div className="bm-cam-hint">{shot ? t.captured : t.hint}</div>

            {!shot ? (
              <div className="bm-cam-row">
                <button className="bm-cam-back" onClick={onBack} aria-label="Back">
                  <ArrowLeft size={22} aria-hidden="true" />
                </button>
                <button className="bm-cam-shutter" onClick={capture} aria-label="Capture">
                  <span><Camera size={32} aria-hidden="true" /></span>
                </button>
              </div>
            ) : (
              <div className="bm-cam-actions">
                <button className="bm-btn bm-btn-light" onClick={retake}>
                  <RotateCcw size={20} aria-hidden="true" /> {t.retake}
                </button>
                <button className="bm-btn bm-btn-primary" onClick={useShot}>
                  <Check size={20} aria-hidden="true" /> {t.use}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}