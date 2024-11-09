import React, { useState, useRef, useEffect, useCallback } from "react";
import "./Detect.css";
import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";
import {
  drawConnectors,
  drawLandmarks,
  // HAND_CONNECTIONS,
} from "@mediapipe/drawing_utils";
import Header from "../header";
import { HAND_CONNECTIONS } from "@mediapipe/hands";

import Webcam from "react-webcam";
import { SignImageData } from "../../data/SignImageData";
import { useDispatch, useSelector } from "react-redux";
import ProgressBar from "./ProgressBar/ProgressBar";
import ConfigPanel from "../ConfigPanel";
// import trainedModel from "../../assests/sign_language_recognizer_25-04-2023.task";
import DisplayImg from "../../assests/displayGif.gif";
import WordDisplay from "../WordDisplay";
const easyWords = ["hi", "why", "love", ""];
const mediumWords = ["hackathon", "hello", "world", "python", "javascript"];
const hardWords = ["caipirinha", "shenenigans"];
const darkSouls = ["pneumonoultramicroscopicsilicovolcanoconiosis"];

// const originalWarn = console.warn;

console.warn = function (message) {
  // if (!message.includes("Feedback manager requires a model with a single signature inference")) {
  //   originalWarn.apply(console, arguments);
  // }
};

const Difficulty = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
  DARKSOULS: "darkSouls",
};

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
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            color: "white",
          }}
        >
          <span
            style={{
              fontSize: "40px",
              fontWeight: "bold",
              background: "linear-gradient(45deg, #4CAF50, #2196F3)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Loading Model
          </span>
          <span
            style={{
              fontSize: "24px",
              color: "#7f8c8d",
              marginTop: "10px",
            }}
          >
            This may take a minute
          </span>
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

function checkCorrectGesture({ gestureOutput, currentLetter }) {
  if (currentLetter.toLowerCase() === "p") {
    if (
      gestureOutput.toLowerCase() === "yes" ||
      gestureOutput.toLowerCase() === "p" ||
      gestureOutput.toLowerCase() === "u" ||
      gestureOutput.toLowerCase() === "r"
    ) {
      return true;
    }

    return false;
  }
  if (currentLetter.toLowerCase() === "m") {
    if (
      gestureOutput.toLowerCase() === "n" ||
      gestureOutput.toLowerCase() === "m"
    ) {
      return true;
    }

    return false;
  }
  if (currentLetter.toLowerCase() === "g") {
    if (
      gestureOutput.toLowerCase() === "g" ||
      gestureOutput.toLowerCase() === "m"
    ) {
      return true;
    }

    return false;
  }

  if (currentLetter.toLowerCase() === "n") {
    if (
      gestureOutput.toLowerCase() === "n" ||
      gestureOutput.toLowerCase() === "yes"
    ) {
      return true;
    }

    return false;
  }
  return gestureOutput.toLowerCase() === currentLetter.toLowerCase();
}

const Detect = ({ customWord }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [showDynamicOutput, setShowDynamicOutput] = useState(false);
  const [webcamRunning, setWebcamRunning] = useState(false);
  const [gestureOutput, setGestureOutput] = useState("NONE");
  const [gestureRecognizer, setGestureRecognizer] = useState(null);
  const [runningMode, setRunningMode] = useState("IMAGE");
  const [progress, setProgress] = useState(0);
  const [targetWord, setTargetWord] = useState("");
  const [currentWords, setCurrentWords] = useState([]);
  const [difficulty, setDifficulty] = useState(Difficulty.MEDIUM);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [currentLetter, setCurrentLetter] = useState("");
  const [congratulations, setCongratulations] = useState(false);
  const requestRef = useRef();
  const prevGestureOutput = useRef("");
  const [isLoading, setIsLoading] = useState(true);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [alwaysShowSigns, setAlwaysShowSigns] = useState(false);
  const [showHandTracking, setShowHandTracking] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const getWordsBasedOnDifficulty = () => {
    if (difficulty === Difficulty.EASY) {
      return easyWords;
    } else if (difficulty === Difficulty.MEDIUM) {
      return mediumWords;
    } else if (difficulty === Difficulty.HARD) {
      return hardWords;
    } else {
      return darkSouls;
    }
  };

  useEffect(() => {
    if (customWord) {
      setCurrentWords([customWord]);
      setTargetWord(customWord);
      setCurrentLetter(customWord[0]);
      setCurrentLetterIndex(0);
      setCurrentWordIndex(0);
      setCongratulations(false);
    } else {
      const words = getWordsBasedOnDifficulty();
      const initialWord = words[0];
      setCurrentWords(words);
      setTargetWord(initialWord);
      setCurrentLetter(initialWord[0]);
      setCurrentLetterIndex(0);
      setCurrentWordIndex(0);
      setCongratulations(false);
    }
  }, [difficulty, customWord]);

  useEffect(() => {
    console.error({ gestureOutput, progress, currentLetter });
    // This function will run only once when `gestureOutput` changes
    if (
      gestureOutput &&
      // gestureOutput !== prevGestureOutput.current &&
      (progress >= 70 || gestureOutput.toLowerCase() === "g")
    ) {
      if (
        checkCorrectGesture({
          gestureOutput: gestureOutput?.toLowerCase(),
          currentLetter: currentLetter?.toLowerCase(),
        })
      ) {
        if (currentLetterIndex < targetWord.length - 1) {
          setCurrentLetter(targetWord.split("")[currentLetterIndex + 1]);
          setCurrentLetterIndex((prev) => prev + 1);
        } else {
          if (!congratulations) {
            setEndTime(Date.now());
          }
          setCongratulations(true);
        }
      }

      // Update the previous gesture output value
      prevGestureOutput.current = gestureOutput;
    }
  }, [gestureOutput, progress]);

  const [detectedData, setDetectedData] = useState([]);

  const user = useSelector((state) => state.auth?.user);

  const { accessToken } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const [currentImage, setCurrentImage] = useState(null);
  // console.warning(currentImage);
  useEffect(() => {
    let intervalId;
    if (webcamRunning) {
      intervalId = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * SignImageData.length);
        const randomImage = SignImageData[randomIndex];
        setCurrentImage(randomImage);
      }, 5000);
    }
    return () => clearInterval(intervalId);
  }, [webcamRunning]);

  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "production"
  ) {
    console.log = function () {};
  }

  const predictWebcam = useCallback(() => {
    if (runningMode === "IMAGE") {
      setRunningMode("VIDEO");
      gestureRecognizer.setOptions({ runningMode: "VIDEO" });
    }

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

    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    // Set video width
    webcamRef.current.video.width = videoWidth;
    webcamRef.current.video.height = videoHeight;

    // Set canvas height and width
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    // Draw the results on the canvas, if any.
    if (results.landmarks) {
      for (const landmarks of results.landmarks) {
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 5,
        });

        drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 2 });
      }
    }
    if (results.gestures.length > 0) {
      setDetectedData((prevData) => [
        ...prevData,
        {
          SignDetected: results.gestures[0][0].categoryName,
        },
      ]);
      // setResults(results);
      setGestureOutput(results.gestures[0][0].categoryName);
      setProgress(Math.round(parseFloat(results.gestures[0][0].score) * 100));
    } else {
      setGestureOutput(prevGestureOutput.current);
      setProgress(0);
    }

    if (webcamRunning === true) {
      requestRef.current = requestAnimationFrame(predictWebcam);
    }
  }, [webcamRunning, runningMode, gestureRecognizer, setGestureOutput]);

  const animate = useCallback(() => {
    requestRef.current = requestAnimationFrame(animate);
    predictWebcam();
  }, [predictWebcam]);

  const toggleDetection = useCallback(() => {
    if (webcamRunning === true) {
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
      setStartTime(Date.now());
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

  useEffect(() => {
    if (gestureOutput) {
      // alert(gestureOutput);
    }
  }, [gestureOutput]);

  function changeDifficulty(difficulty) {
    setDifficulty(difficulty);
  }

  function changeDetectionVisibility(isVisible) {
    setShowDynamicOutput(isVisible);
  }

  function changeHandTrackingVisibility(isVisible) {
    setShowHandTracking(isVisible);
  }

  useEffect(() => {
    function handleKeyPress(event) {
      if (event.shiftKey && event.key === "S") {
        setAlwaysShowSigns(!alwaysShowSigns);
      }
    }

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [alwaysShowSigns]);

  useEffect(() => {
    return () => {
      // Cleanup function
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
    };
  }, [webcamRunning]);

  const handleUserMedia = () => {
    setIsCameraReady(true);
  };

  const handleCameraError = (error) => {
    console.error("Camera error:", error);
    setIsCameraReady(false);
  };

  return (
    <div style={{ backgroundColor: "#1a1a1a", minHeight: "100vh" }}>
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: "40px",
          height: "40px",
          zIndex: 1001,
        }}
        onClick={() => setAlwaysShowSigns(!alwaysShowSigns)}
      />

      <Header />
      <LoadingModal isOpen={isLoading} />
      <ConfigPanel
        onDifficultyChange={changeDifficulty}
        onDetectionVisibilityChange={changeDetectionVisibility}
        onHandTrackingVisibilityChange={changeHandTrackingVisibility}
        toggleDetection={toggleDetection}
        webcamRunning={webcamRunning}
        isCustomWord={!!customWord}
      />

      <div style={{ padding: "20px 40px" }} className="detect-container">
        <div
          className="detect-grid"
          style={{
            color: "white",
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "10px",
            maxWidth: "1600px",
            margin: "0 auto",
          }}
        >
          {webcamRunning ? (
            <div
              className="word-display-container"
              style={{
                background: "#2a2a2a",
                padding: "15px",
                borderRadius: "15px",
                boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
              }}
            >
              <WordDisplay
                targetWord={targetWord}
                currentLetterIndex={currentLetterIndex}
                congratulations={congratulations}
                alwaysShowSigns={alwaysShowSigns}
                renderBasedOnDifficulty={renderBasedOnDifficulty}
                difficulty={difficulty}
                time={Math.floor(((endTime || Date.now()) - startTime) / 1000)}
              />
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "40px",
                background: "#2a2a2a",
                borderRadius: "15px",
                boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
              }}
            >
              <div
                style={{
                  fontSize: "48px",
                  fontWeight: "800",
                  background: "linear-gradient(45deg, #4CAF50, #2196F3)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: "30px",
                  letterSpacing: "2px",
                  textAlign: "center",
                }}
              >
                Let's Learn <br /> Sign Language!
              </div>
              {!webcamRunning && (
                <>
                  <button
                    style={{
                      padding: "20px 40px",
                      width: "auto",
                      backgroundColor: !isCameraReady ? "#666" : "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "50px",
                      cursor: isCameraReady ? "pointer" : "not-allowed",
                      fontSize: "44px",
                      fontWeight: "800",
                      textTransform: "uppercase",
                      boxShadow: isCameraReady
                        ? "0 10px 20px rgba(0,0,0,0.2)"
                        : "none",
                      transition: "all 0.3s ease",
                      transform: "scale(1)",
                      opacity: isCameraReady ? 1 : 0.7,
                    }}
                    onMouseEnter={(e) => {
                      if (isCameraReady) {
                        e.target.style.transform = "scale(1.05)";
                        e.target.style.boxShadow =
                          "0 15px 25px rgba(0,0,0,0.3)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (isCameraReady) {
                        e.target.style.transform = "scale(1)";
                        e.target.style.boxShadow =
                          "0 10px 20px rgba(0,0,0,0.2)";
                      }
                    }}
                    onClick={() => isCameraReady && toggleDetection()}
                    disabled={!isCameraReady}
                  >
                    {isCameraReady ? "Start" : "Connecting..."}
                  </button>
                  {!isCameraReady && (
                    <div
                      style={{
                        marginTop: "20px",
                        color: "#999",
                        fontSize: "16px",
                        textAlign: "center",
                      }}
                    >
                      Please allow camera access to continue
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          <div
            className="webcam-section"
            style={{
              background: "#2a2a2a",
              padding: "30px",
              borderRadius: "15px",
              boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
            }}
          >
            {gestureRecognizer ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                {showDynamicOutput && (
                  <div
                    className="gesture-output"
                    style={{
                      minHeight: "140px",
                      padding: "20px",
                      background: "#1a1a1a",
                      borderRadius: "15px",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "80px",
                        fontWeight: "800",
                        background: "linear-gradient(45deg, #4CAF50, #2196F3)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {gestureOutput}
                    </span>
                  </div>
                )}

                <div
                  style={{ position: "relative" }}
                  className="webcam-container"
                >
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    onUserMedia={handleUserMedia}
                    onUserMediaError={handleCameraError}
                    style={{
                      width: "100%",
                      borderRadius: "15px",
                      boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                    }}
                  />
                  <canvas
                    style={{
                      display: showHandTracking ? "block" : "none",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      borderRadius: "15px",
                    }}
                    ref={canvasRef}
                    className="hand-tracking-canvas"
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

function renderBasedOnDifficulty({
  letter,
  index,
  difficulty,
  currentLetterIndex,
  congratulations,
  alwaysShowSigns,
}) {
  if (difficulty === Difficulty.EASY || congratulations) {
    return (
      <div
        style={{
          display: "flex",
          fontSize: congratulations ? "100px" : "175px",
          fontWeight: "500",
          backgroundColor: "white",
          color: "black",
          height: congratulations ? "100px" : "200px",
        }}
        className="sign-text"
      >
        {letter.toUpperCase()}
      </div>
    );
  }
  // console.error("index", index, "currentLetterIndex", currentLetterIndex);
  if (
    (difficulty === Difficulty.MEDIUM || alwaysShowSigns) &&
    index === currentLetterIndex
  ) {
    return (
      <div
        style={{
          display: "flex",
          fontSize: "175px",
          fontWeight: "500",
          backgroundColor: "white",
          color: "black",
          height: "200px",
        }}
        className="sign-text"
      >
        {letter.toUpperCase()}
      </div>
    );
  }

  return null;
}

export default Detect;
