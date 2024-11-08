import React, { useEffect, useState } from "react";
import logo1 from "../assests/logo1.png";

const FlyingLogo = () => {
  const [position, setPosition] = useState({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    dx: (Math.random() - 0.5) * 4,
    dy: (Math.random() - 0.5) * 4,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => {
        let newX = prev.x + prev.dx;
        let newY = prev.y + prev.dy;
        let newDx = prev.dx;
        let newDy = prev.dy;

        // Bounce off walls
        if (newX <= 0 || newX >= window.innerWidth - 50) {
          newDx = -newDx;
        }
        if (newY <= 0 || newY >= window.innerHeight - 50) {
          newDy = -newDy;
        }

        // Randomly change direction slightly
        if (Math.random() < 0.05) {
          newDx += (Math.random() - 0.5) * 0.5;
          newDy += (Math.random() - 0.5) * 0.5;
        }

        // Keep speed in check
        const speed = Math.sqrt(newDx * newDx + newDy * newDy);
        if (speed > 5) {
          newDx = (newDx / speed) * 5;
          newDy = (newDy / speed) * 5;
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

  return (
    <img
      src={logo1}
      alt="Flying Logo"
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        width: "50px",
        height: "50px",
        pointerEvents: "none",
        zIndex: 1,
        opacity: 0.6,
        transform: `rotate(${
          Math.atan2(position.dy, position.dx) * (180 / Math.PI)
        }deg)`,
        transition: "transform 0.2s ease-out",
      }}
    />
  );
};

export default FlyingLogo;
