import { useState, useCallback } from "react";
import { useLaserSound } from "../hooks/useLaserSound";
import LaserEffect from "./LaserEffect";

interface Laser {
  id: number;
  targetX: number;
  targetY: number;
  color: string;
}

// Interpolate between two hex colors
function lerpColor(color1: string, color2: string, t: number): string {
  const r1 = parseInt(color1.slice(1, 3), 16)
  const g1 = parseInt(color1.slice(3, 5), 16)
  const b1 = parseInt(color1.slice(5, 7), 16)
  const r2 = parseInt(color2.slice(1, 3), 16)
  const g2 = parseInt(color2.slice(3, 5), 16)
  const b2 = parseInt(color2.slice(5, 7), 16)

  const r = Math.round(r1 + (r2 - r1) * t)
  const g = Math.round(g1 + (g2 - g1) * t)
  const b = Math.round(b1 + (b2 - b1) * t)

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
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

      // Cycle through colors over time (full cycle every 4 seconds)
      const t = (Math.sin(Date.now() / 2000 * Math.PI) + 1) / 2
      const color = lerpColor('#bd93bd', '#f2edeb', t)

      setLasers((prev) => [...prev, { id, targetX, targetY, color }]);
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
          color={laser.color}
          onHit={() => {}}
          onComplete={() => handleLaserComplete(laser.id)}
        />
      ))}
    </div>
  );
}
