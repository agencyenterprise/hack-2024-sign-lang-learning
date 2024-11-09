import React, { useState, useRef, useEffect, useCallback } from "react";
import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { HAND_CONNECTIONS } from "@mediapipe/hands";
import Webcam from "react-webcam";
import Header from "./header";
import debounce from "lodash/debounce";

const LoadingModal = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#1a1a1a",
          padding: "3rem",
          borderRadius: "15px",
          textAlign: "center",
          border: "2px solid #333",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            fontSize: "40px",
            fontWeight: "bold",
            background: "linear-gradient(45deg, #4CAF50, #2196F3)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "20px",
          }}
        >
          Loading Model
        </div>
        <div
          style={{
            border: "3px solid #333",
            borderTop: "3px solid #4CAF50",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            animation: "spin 1s linear infinite",
            margin: "0 auto",
          }}
        >
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </div>
    </div>
  );
};

const ConfidenceMeter = React.memo(({ progress }) => {
  const threshold = 70;
  const isAboveThreshold = progress >= threshold;
  const clampedProgress = Math.min(Math.max(Math.round(progress), 0), 100);

  return (
    <div
      style={{
        fontSize: "24px",
        color: "#fff",
        height: "40px",
        opacity: clampedProgress > 0 ? 1 : 0,
        transition: "opacity 0.3s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          color: isAboveThreshold ? "#4CAF50" : "#ff9800",
          fontWeight: "600",
          transition: "color 0.3s ease",
        }}
      >
        {clampedProgress}% {isAboveThreshold ? "✓" : ""}
      </span>
    </div>
  );
});

const Freestyle = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [gestureOutput, setGestureOutput] = useState("Ready to detect...");
  const [gestureRecognizer, setGestureRecognizer] = useState(null);
  const [runningMode, setRunningMode] = useState("IMAGE");
  const [isLoading, setIsLoading] = useState(true);
  const [webcamRunning, setWebcamRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const requestRef = useRef();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [lastSpokenGesture, setLastSpokenGesture] = useState("");

  const debouncedSpeak = useCallback(
    debounce(async (text) => {
      try {
        const response = await fetch("http://localhost:3000/api/tts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            voice: "en-US-AriaNeural",
            rate: 1.5,
            pitch: 1.0,
          }),
        });

        if (!response.ok) {
          throw new Error("TTS request failed");
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.playbackRate = 1.2;
        await audio.play();

        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
        };
      } catch (error) {
        console.error("TTS Error:", error);
      }
    }, 300),
    []
  );

  const predictWebcam = useCallback(() => {
    if (!webcamRef.current?.video?.readyState === 4) {
      return;
    }

    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    if (!videoWidth || !videoHeight) {
      console.error("Invalid video dimensions");
      return;
    }

    if (runningMode === "IMAGE") {
      setRunningMode("VIDEO");
      gestureRecognizer.setOptions({ runningMode: "VIDEO" });
    }

    try {
      let nowInMs = Date.now();
      const results = gestureRecognizer.recognizeForVideo(
        webcamRef.current.video,
        nowInMs
      );

      const canvasCtx = canvasRef.current.getContext("2d");
      canvasCtx.save();
      canvasCtx.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      if (results.landmarks) {
        for (const landmarks of results.landmarks) {
          drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
            color: "#00FF00",
            lineWidth: 5,
          });
          drawLandmarks(canvasCtx, landmarks, {
            color: "#FF0000",
            lineWidth: 2,
          });
        }
      }

      if (results.gestures.length > 0) {
        const newGesture = results.gestures[0][0].categoryName;
        setGestureOutput(newGesture);
        setProgress(Math.round(parseFloat(results.gestures[0][0].score) * 100));

        if (
          newGesture !== lastSpokenGesture &&
          results.gestures[0][0].score > 0.7
        ) {
          setLastSpokenGesture(newGesture);
          debouncedSpeak(newGesture);
        }
      } else {
        setProgress(0);
      }
    } catch (error) {
      console.error("Error in prediction:", error);
    }

    if (webcamRunning) {
      requestRef.current = requestAnimationFrame(predictWebcam);
    }
  }, [
    webcamRunning,
    runningMode,
    gestureRecognizer,
    lastSpokenGesture,
    debouncedSpeak,
  ]);

  useEffect(() => {
    return () => {
      debouncedSpeak.cancel();
    };
  }, [debouncedSpeak]);

  const animate = useCallback(() => {
    requestRef.current = requestAnimationFrame(animate);
    predictWebcam();
  }, [predictWebcam]);

  const toggleDetection = useCallback(() => {
    if (webcamRunning) {
      setWebcamRunning(false);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      if (webcamRef.current && webcamRef.current.video) {
        const stream = webcamRef.current.video.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
        }
        webcamRef.current.video.srcObject = null;
      }
    } else {
      setWebcamRunning(true);
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [webcamRunning, animate]);

  useEffect(() => {
    async function loadGestureRecognizer() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      const recognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://cdn.jsdelivr.net/gh/agencyenterprise/hack-2024-sign-lang-learning@main/src/assests/sign_language_recognizer_25-04-2023.task",
        },
        numHands: 2,
        runningMode: runningMode,
      });
      setGestureRecognizer(recognizer);
      setIsLoading(false);
    }
    loadGestureRecognizer();
  }, [runningMode]);

  const handleUserMedia = useCallback((stream) => {
    setIsCameraReady(true);
    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      const settings = videoTrack.getSettings();
      if (!settings.width || !settings.height) {
        console.error("Invalid video track settings");
        setIsCameraReady(false);
      }
    }
  }, []);

  const handleCameraError = (error) => {
    console.error("Camera error:", error);
    setIsCameraReady(false);
  };

  useEffect(() => {
    if (!webcamRunning && webcamRef.current) {
      const initializeCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          if (webcamRef.current) {
            webcamRef.current.video.srcObject = stream;
          }
        } catch (error) {
          console.error("Error initializing camera:", error);
          setIsCameraReady(false);
        }
      };
      initializeCamera();
    }

    return () => {
      if (webcamRef.current && webcamRef.current.video) {
        const stream = webcamRef.current.video.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
        }
        webcamRef.current.video.srcObject = null;
      }
    };
  }, [webcamRunning]);

  useEffect(() => {
    return () => {
      if (webcamRunning) {
        setWebcamRunning(false);
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
        if (webcamRef.current && webcamRef.current.video) {
          const stream = webcamRef.current.video.srcObject;
          if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop());
          }
          webcamRef.current.video.srcObject = null;
        }
      }
      setGestureRecognizer(null);
    };
  }, [webcamRunning]);

  return (
    <div style={{ backgroundColor: "#1a1a1a", minHeight: "100vh" }}>
      <Header />
      <LoadingModal isOpen={isLoading} />

      <div
        style={{
          padding: "90px 20px 20px 20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "#2a2a2a",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
            minHeight: "600px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ height: 0, overflow: "hidden", position: "absolute" }}>
            <Webcam
              audio={false}
              ref={webcamRef}
              onUserMedia={handleUserMedia}
              onUserMediaError={handleCameraError}
              videoConstraints={{
                width: 640,
                height: 480,
                facingMode: "user",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
              width: "100%",
            }}
          >
            {!webcamRunning ? (
              <>
                <div
                  style={{
                    fontSize: "48px",
                    fontWeight: "800",
                    background: "linear-gradient(45deg, #4CAF50, #2196F3)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textAlign: "center",
                    marginBottom: "20px",
                    height: "60px",
                  }}
                >
                  Practice Sign Language Freely
                </div>
                <div
                  style={{
                    height: "400px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <button
                    style={{
                      padding: "20px 40px",
                      backgroundColor: !isCameraReady ? "#666" : "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "50px",
                      cursor: isCameraReady ? "pointer" : "not-allowed",
                      fontSize: "24px",
                      fontWeight: "600",
                      opacity: isCameraReady ? 1 : 0.7,
                    }}
                    onClick={() => isCameraReady && toggleDetection()}
                    disabled={!isCameraReady}
                  >
                    {isCameraReady ? "Start Practice" : "Connecting Camera..."}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                    minHeight: "140px",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "80px",
                      fontWeight: "800",
                      background: "linear-gradient(45deg, #4CAF50, #2196F3)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      textAlign: "center",
                      height: "100px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {gestureOutput}
                  </div>
                  <ConfidenceMeter progress={progress} />
                </div>
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "600px",
                    aspectRatio: "4/3",
                    margin: "20px 0",
                  }}
                >
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    onUserMedia={handleUserMedia}
                    onUserMediaError={handleCameraError}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "15px",
                      objectFit: "cover",
                    }}
                  />
                  <canvas
                    ref={canvasRef}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      borderRadius: "15px",
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Freestyle;
