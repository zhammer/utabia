import { useState, useCallback } from "react";
import { useLaserSound } from "../hooks/useLaserSound";
import LaserEffect from "./LaserEffect";

interface Laser {
  id: number;
  targetX: number;
  targetY: number;
}

let laserId = 0;

export default function LandingPage() {
  const [lasers, setLasers] = useState<Laser[]>([]);
  const { playPew } = useLaserSound();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      playPew();
      const id = laserId++;
      const targetX = e.clientX;
      const targetY = e.clientY;

      setLasers((prev) => [...prev, { id, targetX, targetY }]);
    },
    [playPew]
  );

  const handleLaserComplete = useCallback((id: number) => {
    setLasers((prev) => prev.filter((l) => l.id !== id));
  }, []);

  return (
    <div className="landing-page" onClick={handleClick}>
      {/* Waves background video */}
      <div className="waves-background">
        <video src="./waves-background.mp4" autoPlay muted loop playsInline />
      </div>

      {/* Main content */}
      <div className="landing-content">
        <h1 className="landing-title">Utabia</h1>
        <p className="landing-tagline">The modern way to clear tabs.</p>
        <a
          href="https://chromewebstore.google.com/detail/utabia/mjoooboiicdfdckjkdlcnofjdodciamb"
          className="landing-cta"
          onClick={(e) => e.stopPropagation()}
        >
          Add to Chrome
        </a>
      </div>

      {/* Lasers */}
      {lasers.map((laser) => (
        <LaserEffect
          key={laser.id}
          targetX={laser.targetX}
          targetY={laser.targetY}
          color="#bd93bd"
          onHit={() => {}}
          onComplete={() => handleLaserComplete(laser.id)}
        />
      ))}
    </div>
  );
}
