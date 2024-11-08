import React, { useEffect, useState } from "react";
import logo1 from "../assests/logo1.png";

const FlyingLogo = () => {
  const getInitialPosition = () => ({
    x: Math.min(
      Math.max(50, Math.random() * window.innerWidth - 50),
      window.innerWidth - 50
    ),
    y: Math.min(
      Math.max(50, Math.random() * window.innerHeight - 50),
      window.innerHeight - 50
    ),
    dx: (Math.random() - 0.5) * 6,
    dy: (Math.random() - 0.5) * 6,
  });

  const [position, setPosition] = useState(getInitialPosition());
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => {
        let newX = prev.x + prev.dx;
        let newY = prev.y + prev.dy;
        let newDx = prev.dx;
        let newDy = prev.dy;

        // Ensure logo stays within bounds
        if (newX <= 0) {
          newX = 0;
          newDx = Math.abs(newDx);
        } else if (newX >= window.innerWidth - 50) {
          newX = window.innerWidth - 50;
          newDx = -Math.abs(newDx);
        }

        if (newY <= 0) {
          newY = 0;
          newDy = Math.abs(newDy);
        } else if (newY >= window.innerHeight - 50) {
          newY = window.innerHeight - 50;
          newDy = -Math.abs(newDy);
        }

        // Randomly change direction slightly
        if (Math.random() < 0.05) {
          newDx += (Math.random() - 0.5) * 0.5;
          newDy += (Math.random() - 0.5) * 0.5;
        }

        // Keep speed in check but with higher minimum
        const speed = Math.sqrt(newDx * newDx + newDy * newDy);
        if (speed > 5) {
          newDx = (newDx / speed) * 5;
          newDy = (newDy / speed) * 5;
        } else if (speed < 2) {
          newDx = (newDx / speed) * 2;
          newDy = (newDy / speed) * 2;
        }

        return {
          x: newX,
          y: newY,
          dx: newDx,
          dy: newDy,
        };
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleMouseEnter = () => {
    setPosition(getInitialPosition());
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 1000);
  };

  return (
    <>
      <img
        src={logo1}
        alt="Flying Logo"
        onMouseEnter={handleMouseEnter}
        style={{
          position: "fixed",
          left: position.x,
          top: position.y,
          width: "50px",
          height: "50px",
          pointerEvents: "auto",
          zIndex: 1,
          opacity: 0.6,
          transform: `rotate(${
            Math.atan2(position.dy, position.dx) * (180 / Math.PI)
          }deg)`,
          transition: "transform 0.2s ease-out",
          cursor: "pointer",
        }}
      />
      {showMessage && (
        <div
          style={{
            position: "fixed",
            left: position.x,
            top: position.y - 30,
            color: "white",
            fontSize: "14px",
            zIndex: 2,
            whiteSpace: "nowrap",
          }}
        >
          no touching!
        </div>
      )}
    </>
  );
};

export default FlyingLogo;
