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
const hardWords = ["paodequeijo", "shenenigans"];
const darkSouls = ["pneumonoultramicroscopicsilicovolcanoconiosis"];

// const originalWarn = console.warn;

console.warn = function (message) {
  // if (!message.includes("Feedback manager requires a model with a single signature inference")) {
  //   originalWarn.apply(console, arguments);
  // }
};

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

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
        backgroundColor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#1a1a1a",
          padding: "2rem",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "40px",
            fontWeight: "bold",
            flexDirection: "column",
            color: "white",
          }}
        >
          Loading Model...
          <span style={{ fontSize: "24px", color: "#7f8c8d" }}>
            This may take a minute
          </span>
        </div>
        <div
          style={{
            border: "2px solid #f3f3f3",
            borderTop: "2px solid #3498db",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
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
      progress >= 70
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
    // if (!gestureRecognizer) {
    //   alert("Please wait for gestureRecognizer to load");
    //   return;
    // }

    if (webcamRunning === true) {
      setWebcamRunning(false);
      cancelAnimationFrame(requestRef.current);
    } else {
      setWebcamRunning(true);
      setStartTime(Date.now());
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [
    webcamRunning,
    gestureRecognizer,
    animate,
    detectedData,
    user?.name,
    user?.userId,
    dispatch,
  ]);

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

  return (
    <>
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
      <div style={{ height: "20px" }} />
      <div
        style={{
          color: "white",
          display: "grid",
          gridTemplateColumns: "2fr 1fr", // Changed from 1fr 1fr to 2fr 1fr
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {webcamRunning ? (
          <>
            <WordDisplay
              targetWord={targetWord}
              currentLetterIndex={currentLetterIndex}
              congratulations={congratulations}
              alwaysShowSigns={alwaysShowSigns}
              renderBasedOnDifficulty={renderBasedOnDifficulty}
              difficulty={difficulty}
              time={Math.floor(((endTime || Date.now()) - startTime) / 1000)}
            />
          </>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            <div
              style={{
                fontSize: "48px",
                fontWeight: "800",
                color: "#fff",
                textShadow: "3px 3px 0 rgba(0,0,0,0.2)",
                marginBottom: "30px",
                letterSpacing: "2px",
                textAlign: "center",
              }}
            >
              Let's Learn <br /> Sign Language!
            </div>
            <button
              style={{
                padding: "20px 40px",
                width: "300px",
                backgroundColor: !webcamRunning ? "#4CAF50" : "#f44336",
                color: "white",
                border: "none",
                borderRadius: "50px",
                cursor: "pointer",
                fontSize: "44px",
                fontWeight: "800",
                textTransform: "uppercase",
                boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease",
                transform: "scale(1)",
                ":hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 15px 25px rgba(0,0,0,0.3)",
                },
              }}
              onClick={toggleDetection}
            >
              {webcamRunning ? "Stop" : "Start"}
            </button>
          </div>
        )}
        {!accessToken ? (
          <div style={{ width: "600px", position: "relative" }}>
            {gestureRecognizer ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-end",
                }}
              >
                <div
                  style={{
                    color: "white",
                    fontSize: "20px",
                  }}
                >
                  {showDynamicOutput ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "20px",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          width: "600px",
                          height: "100px",
                          border: "2px solid #fff",
                          background: "#000",
                          borderRadius: "30px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "80px",
                            fontWeight: "800",
                            color: "#fff",
                            textShadow: "3px 3px 0 rgba(0,0,0,0.2)",
                            letterSpacing: "4px",
                            animation: "float 3s ease-in-out infinite",
                          }}
                        >
                          {gestureOutput}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        height: "20px",
                      }}
                    />
                  )}

                  {/* {progress ? (
                        <ProgressBar progress={progress} />
                      ) : (
                        <div
                          style={{
                            height: "20px",
                          }}
                        />
                      )} */}
                </div>
              </div>
            ) : null}
            <div style={{ position: "relative" }}>
              <Webcam
                audio={false}
                ref={webcamRef}
                // screenshotFormat="image/jpeg"
                className="signlang_webcam"
              />
              <canvas
                style={{
                  display: showHandTracking ? "block" : "none",
                }}
                ref={canvasRef}
                className="signlang_canvas"
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              ></div>
            </div>
            {/* <div className="signlang_imagelist-container">
              <h2 className="gradient__text">Image</h2>

              <div className="signlang_image-div">
                {currentImage ? (
                  <img src={currentImage.url} alt={`img ${currentImage.id}`} />
                ) : (
                  <h3 className="gradient__text">
                    Click on the Start Button <br /> to practice with Images
                  </h3>
                )}
              </div>
            </div> */}
          </div>
        ) : (
          <div className="signlang_detection_notLoggedIn">
            <h1 className="gradient__text">Please Login !</h1>
            <img src={DisplayImg} alt="diplay-img" />
            <p>
              We Save Your Detection Data to show your progress and learning in
              dashboard, So please Login to Test this Detection Feature.
            </p>
          </div>
        )}
      </div>
    </>
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
