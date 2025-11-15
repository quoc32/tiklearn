const BackgroundEffect = () => {
  return (
          <div
        className="fg-effect"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <style>{`
          .fg-effect { will-change: transform, opacity; }
          .fg-effect .blob {
            position: absolute;
            width: 48vmax;
            height: 48vmax;
            border-radius: 50%;
            filter: blur(64px);
            opacity: 0.55;
            transform: translate3d(0,0,0);
            mix-blend-mode: screen;
          }

          .fg-effect .b1 {
            background: radial-gradient(circle at 30% 30%, rgba(14,165,164,0.95) 0%, rgba(14,165,164,0.5) 30%, transparent 60%);
            left: -10%;
            top: -20%;
            animation: float1 20s ease-in-out infinite both;
          }
          .fg-effect .b2 {
            background: radial-gradient(circle at 70% 60%, rgba(124,58,237,0.92) 0%, rgba(124,58,237,0.45) 30%, transparent 60%);
            right: -18%;
            top: 8%;
            animation: float2 24s ease-in-out infinite both;
          }
          .fg-effect .b3 {
            background: radial-gradient(circle at 50% 50%, rgba(6,182,212,0.9) 0%, rgba(6,182,212,0.4) 30%, transparent 60%);
            left: 12%;
            bottom: -28%;
            animation: float3 28s ease-in-out infinite both;
          }

          @keyframes float1 {
            0% { transform: translate3d(0,0,0) scale(1); }
            50% { transform: translate3d(6%, -8%, 0) scale(1.05); }
            100% { transform: translate3d(0,0,0) scale(1); }
          }
          @keyframes float2 {
            0% { transform: translate3d(0,0,0) scale(1); }
            50% { transform: translate3d(-8%, 6%, 0) scale(1.06); }
            100% { transform: translate3d(0,0,0) scale(1); }
          }
          @keyframes float3 {
            0% { transform: translate3d(0,0,0) scale(1); }
            50% { transform: translate3d(4%, -6%, 0) scale(1.04); }
            100% { transform: translate3d(0,0,0) scale(1); }
          }

          /* subtle grain / texture */
          .fg-effect .grain {
            position: absolute;
            inset: 0;
            background-image: radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px);
            background-size: 3px 3px;
            mix-blend-mode: overlay;
            opacity: 0.6;
            pointer-events: none;
          }

          /* keep effect subtle on small screens */
          @media (max-width: 640px) {
            .fg-effect .blob { width: 64vmax; height: 64vmax; filter: blur(80px); opacity: 0.45; }
          }
        `}</style>

        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
        <div className="grain" />
      </div>
  );
}
 
export default BackgroundEffect;