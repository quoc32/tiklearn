import React, { useCallback } from "react";

export default function ForegroundEffect() {
  const bubbleCount = 24;
  const bubbles = React.useMemo(
    () =>
      Array.from({ length: bubbleCount }, (_, i) => {
        const hue = Math.floor(Math.random() * 360);
        const sat = 70 + Math.random() * 20; // saturation
        const light = 45 + Math.random() * 20; // lightness
        return {
          id: i,
          left: Math.random() * 100,
          size: 10 + Math.random() * 60,
          // duration no longer controls rise time (fixed 3s). keep for other uses if needed
          duration: 6 + Math.random() * 8,
          delay: Math.random() * 3, // delay up to 3s
          opacity: 0.4 + Math.random() * 0.6,
          hue,
          sat: Math.round(sat),
          light: Math.round(light),
        };
      }),
    [bubbleCount]
  );

  const renderBubble = useCallback(
    (b) => {
      const bg = `radial-gradient(circle at 30% 30%,
        hsla(${b.hue}, 100%, 97%, 0.98) 0%,
        hsla(${b.hue}, ${b.sat}%, ${Math.max(b.light, 40)}%, ${Math.min(
        0.95,
        b.opacity + 0.05
      )}) 20%,
        hsla(${b.hue}, ${Math.max(b.sat - 10, 40)}%, ${Math.max(
        b.light - 8,
        30
      )}%, ${Math.min(0.7, b.opacity)}) 60%,
        hsla(${b.hue}, ${Math.max(b.sat - 30, 25)}%, ${Math.max(
        b.light - 20,
        20
      )}%, ${Math.min(0.45, b.opacity - 0.1)}) 100%)`;

      const boxShadow = `
        0 12px 40px rgba(0,0,0,0.22),
        0 3px 10px rgba(0,0,0,0.12),
        inset 0 -6px 18px rgba(255,255,255,0.45)
      `;

      // Rise animation fixed to 3s; sway runs alongside also 3s for coherent movement
      const animation = `fg-bubble-rise 3s linear ${b.delay}s infinite, fg-bubble-sway 3s ease-in-out ${b.delay}s infinite`;

      return (
        <div
          key={b.id}
          className="fg-bubble"
          style={{
            left: `${b.left}%`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            animation,
            opacity: b.opacity,
            background: bg,
            boxShadow,
            border: "1px solid rgba(255,255,255,0.55)",
            filter: "saturate(1.55) contrast(1.05)",
          }}
        />
      );
    },
    []
  );

  return (
    <div className="fg-bubbles-root" aria-hidden="true">
      <style>{`
        .fg-bubbles-root{
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          overflow: visible;
          z-index: 999;
          height: 60vh;
        }
        .fg-bubble{
          position: absolute;
          bottom: 0;
          border-radius: 50%;
          transform: translateY(0) translateX(0);
          mix-blend-mode: screen;
        }
        @keyframes fg-bubble-rise {
          0% { transform: translateY(0); opacity: 1; }
          90% { opacity: 0.9; }
          100% { transform: translateY(-100px); opacity: 0; }
        }
        @keyframes fg-bubble-sway {
          0% { transform: translateX(0); }
          25% { transform: translateX(8px); }
          50% { transform: translateX(-6px); }
          75% { transform: translateX(4px); }
          100% { transform: translateX(0); }
        }
      `}</style>

      {bubbles.map(renderBubble)}
    </div>
  );
}
