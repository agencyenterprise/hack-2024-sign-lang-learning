import React, { useState, useRef, useEffect, useCallback } from "react";
import "./Detect.css";
import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";
import {
  drawConnectors,
  drawLandmarks,
  // HAND_CONNECTIONS,
} from "@mediapipe/drawing_utils";

import { HAND_CONNECTIONS } from "@mediapipe/hands";

import Webcam from "react-webcam";
import { SignImageData } from "../../data/SignImageData";
import { useDispatch, useSelector } from "react-redux";
import ProgressBar from "./ProgressBar/ProgressBar";
// import trainedModel from "../../assests/sign_language_recognizer_25-04-2023.task";
import DisplayImg from "../../assests/displayGif.gif";

// const originalWarn = console.warn;
console.warn = function (message) {
  // if (!message.includes("Feedback manager requires a model with a single signature inference")) {
  //   originalWarn.apply(console, arguments);
  // }
};

const Detect = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [webcamRunning, setWebcamRunning] = useState(false);
  const [gestureOutput, setGestureOutput] = useState("NONE");
  const [gestureRecognizer, setGestureRecognizer] = useState(null);
  const [runningMode, setRunningMode] = useState("IMAGE");
  const [progress, setProgress] = useState(0);

  const requestRef = useRef();
  const prevGestureOutput = useRef("");

  useEffect(() => {
    console.error({ gestureOutput, progress, prev: prevGestureOutput.current });
    // This function will run only once when `gestureOutput` changes
    if (
      gestureOutput &&
      gestureOutput !== prevGestureOutput.current &&
      progress >= 80
    ) {
      // Place the function you want to run only once here
      console.error(
        `Detected new gesture: ${gestureOutput} ${progress} | prev gesture: ${prevGestureOutput.current}`
      );

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

  const enableCam = useCallback(() => {
    // if (!gestureRecognizer) {
    //   alert("Please wait for gestureRecognizer to load");
    //   return;
    // }

    if (webcamRunning === true) {
      setWebcamRunning(false);
      cancelAnimationFrame(requestRef.current);
    } else {
      setWebcamRunning(true);
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
    }
    loadGestureRecognizer();
  }, [runningMode]);

  useEffect(() => {
    if (gestureOutput) {
      // alert(gestureOutput);
    }
  }, [gestureOutput]);

  return (
    <>
      <div className="signlang_detection-container">
        {!accessToken ? (
          <>
            <div style={{ position: "relative" }}>
              <Webcam
                audio={false}
                ref={webcamRef}
                // screenshotFormat="image/jpeg"
                className="signlang_webcam"
              />
              <canvas ref={canvasRef} className="signlang_canvas" />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                {gestureRecognizer ? (
                  <>
                    <button
                      style={{
                        padding: "10px 20px",
                        backgroundColor: !webcamRunning ? "#3498db" : "#e74c3c",
                        color: "white",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontFamily: "sans-serif",
                        fontSize: "14px",
                        fontWeight: "500",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        transition: "all 0.2s ease",
                        userSelect: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: "100px",
                      }}
                      onClick={enableCam}
                    >
                      {webcamRunning ? "Stop" : "Start"}
                    </button>
                    <div
                      style={{
                        color: "white",
                        fontSize: "20px",
                      }}
                    >
                      {gestureOutput && webcamRunning ? (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "20px",
                          }}
                        >
                          <div
                            style={{
                              height: "150px",
                              backgroundColor: "#ffffff",
                              border: "3px solid #3498db",
                              borderRadius: "15px",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                              padding: "10px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "80px",
                                fontWeight: "bold",
                                color: "#2c3e50",
                                fontFamily: "Arial, sans-serif",
                              }}
                            >
                              {gestureOutput}
                            </span>
                            <span
                              style={{
                                fontSize: "14px",
                                color: "#7f8c8d",
                                marginTop: "10px",
                              }}
                            >
                              Detected Letter
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
                  </>
                ) : (
                  <div
                    style={{
                      color: "white",
                      fontSize: "20px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
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
                        position: "relative",
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
                )}
              </div>
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
          </>
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

export default Detect;
