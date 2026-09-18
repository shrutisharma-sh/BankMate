import { useRef, useState, useEffect } from "react";

function CameraScreen({ language, onCaptured, onBack }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  
  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }, 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        setError(err.message);
      }
    }
    startCamera();

    
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
    
  }, []);

  function handleScan() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedImage(imageDataUrl);
  }

  function handleRetake() {
    setCapturedImage(null);
  }

  function handleUsePhoto() {
    onCaptured(capturedImage); 
  }

  const t = (hi, en) => (language === "hi" ? hi : en);

  return (
    <div className="kiosk">
      <h2 className="title" style={{ fontSize: "2.5rem" }}>
        {t("पासबुक दिखाएं", "Show your passbook")}
      </h2>

      {error && (
        <p style={{ color: "#f87171", fontSize: "1.2rem" }}>
          {t(
            "कैमरा एक्सेस की अनुमति चाहिए।",
            "Camera access is required to scan your passbook."
          )}
        </p>
      )}

      {!capturedImage ? (
        <>
          <div className="camera-frame">
            <video ref={videoRef} autoPlay playsInline muted />
          </div>
          <button className="start-btn" onClick={handleScan} disabled={!stream}>
            {t("स्कैन करें", "SCAN PASSBOOK")}
          </button>
        </>
      ) : (
        <>
          <div className="camera-frame">
            <img src={capturedImage} alt="Captured passbook" />
          </div>
          <div className="lang-toggle">
            <button className="lang-btn" onClick={handleRetake}>
              {t("फिर से लें", "Retake")}
            </button>
            <button className="start-btn" onClick={handleUsePhoto}>
              {t("आगे बढ़ें", "CONTINUE")}
            </button>
          </div>
        </>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />

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

export default CameraScreen;