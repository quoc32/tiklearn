import React from "react";

export default function Card({
  title,
  description,
  image,
  footer,
  onClick,
  first,
  setActiveFoneground,
  diffculty
}) {
  const [titleState] = React.useState(title);
  const [descriptionState] = React.useState(description);

  const src =
    typeof image === "string"
      ? image.trim().startsWith("data:")
        ? image
        : `data:image/png;base64,${image}`
      : undefined;

  const [descVi = "", descEn = ""] = (descriptionState || "")
    .split(" - ")
    .map((s) => s.trim());
  const [titleVi = "", titleEn = ""] = (titleState || "")
    .split(" - ")
    .map((s) => s.trim());

  // difficulty badge mapping
  const difficultyConfig = {
    easy: { label: "EASY", className: "bg-green-500 text-white" },
    medium: { label: "MEDIUM", className: "bg-yellow-500 text-black" },
    hard: { label: "HARD", className: "bg-red-600 text-white" },
  };
  const diffKey = (diffculty || "").toString().toLowerCase();
  const diff = difficultyConfig[diffKey] || null;

  const speakText = (text) => () => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className="group relative w-80 sm:w-70 md:w-400 bg-black rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/40 hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
      style={{ perspective: 1000 }}
    >
      {/* custom small styles for marquee + pulse + text pop */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .marquee-inner { display: inline-block; padding-right: 2rem; }
        .marquee { white-space: nowrap; overflow: hidden; display: block; }
        .marquee-animation { animation: marquee 8s linear infinite; }

        @keyframes pulseScale {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        .pulse-scale { animation: pulseScale 3s ease-in-out infinite; }

        /* text emphasis styles */
        .txt-pop {
          color: #ffffff;
          font-weight: 700;
          text-shadow: 0 6px 20px rgba(0,0,0,0.7);
        }
        .en-pill {
          display: inline-block;
          padding: 0.18rem 0.5rem;
          border-radius: 9999px;
          font-weight: 700;
          font-size: 0.78rem;
          color: #fff;
          background: linear-gradient(90deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06));
          backdrop-filter: blur(6px);
          box-shadow: 0 6px 18px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.02) inset;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .desc-en {
          color: rgba(255,255,255,0.96);
          font-weight: 600;
          font-size: 0.9rem;
          text-shadow: 0 6px 18px rgba(0,0,0,0.65);
          line-height: 1.1;
        }
        .marquee-strong .marquee-inner {
          color: #fff;
          font-weight: 700;
          text-shadow: 0 4px 12px rgba(0,0,0,0.6);
        }
      `}</style>

      {/* reduced height so card is shorter */}
      <div className="relative h-[300px] sm:h-[485px] bg-linear-to-br from-neutral-900/80 to-black">
        {src ? (
            <>
              <div className="w-full h-full flex items-center justify-center overflow-hidden">
                <img
                  src={src}
                  alt={titleState}
                  className="max-h-[420px] sm:max-h-[520px] w-auto object-contain group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              </>
              ) : (
                <div className="w-full h-full bg-linear-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
                  <div className="px-6 py-10 text-center">
                    <div className="text-lg md:text-xl font-semibold text-gray-200 opacity-80 mb-4">
                      Cuộn xuống để khám phá nhiều từ ngữ mới...
                    </div>

                    <div className="my-6 text-xl md:text-2xl font-bold text-white tracking-wide">
                      Giáo dục đạt đến đỉnh cao của nó khi nó gây 
                      <span className="text-indigo-400"> "Nghiện"</span>
                    </div>

                    <div className="text-gray-300 font-semibold text-sm md:text-base mt-8">
                      — <span className="text-indigo-300 font-bold">TikLearn</span> — Nâng tầm giáo dục —
                    </div>
                  </div>
              {/* arrow slide-up animation */}
                <style>{`
                  @keyframes arrowUp {
                  0% { transform: translate(-50%, 0); opacity: 0; }
                  10% { opacity: 1; }
                  70% { opacity: 1; }
                  100% { transform: translate(-50%, -22px); opacity: 0; }
                  }
                  .arrow-up {
                  position: absolute;
                  left: 50%;
                  bottom: 14px;
                  transform: translateX(-50%);
                  width: 40px;
                  height: 40px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background: rgba(255,255,255,0.06);
                  border-radius: 9999px;
                  box-shadow: 0 6px 18px rgba(0,0,0,0.45);
                  pointer-events: none;
                  animation: arrowUp 1.6s cubic-bezier(.22,.9,.28,1) infinite;
                  }
                  .arrow-up svg { width: 18px; height: 18px; color: #fff; }
                `}</style>

                <div className="arrow-up" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <polyline points="6 15 12 9 18 15" />
                  </svg>
                </div>
                </div>
              )}

          {/* TEXT CONTENT OVERLAY */}
          <div className="absolute left-4 bottom-4 right-28 text-left z-30">
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center gap-2">
                
                {
                  titleEn ?
                  (
                    <button
                      type="button"
                      aria-label="Play speaker"
                      onClick={speakText(titleEn || descEn)}
                      className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition hover:cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5 9v6h4l5 5V4L9 9H5z" />
                      </svg>
                    </button>
                  ) : null
                }
                <div className="text-white text-sm txt-pop">{titleVi}</div>

                {/* difficulty badge */}
                {diff ? (
                  <div
                    aria-hidden="true"
                    className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${diff.className}`}
                    title={`Difficulty: ${diff.label}`}
                  >
                    {diff.label}
                  </div>
                ) : null}

                {
                titleEn ? (
                  <div className="en-pill pulse-scale" onClick={() => {speakText(titleEn), setActiveFoneground(true)}}>
                    {titleEn}
                  </div>
                      ) : null
                }
              </div>
            </div>
                
            <div className="mt-2">
              <div className="text-white/90 text-sm">{descVi}</div>
              {descEn ? (
                <div className="desc-en italic mt-1">{descEn}</div>
              ) : null}
            </div>

            {/* music ticker */}

            {!descEn ? null :
              (<div className="mt-3 flex items-center space-x-3">

                <div className="w-6 h-6 rounded-full bg-linear-to-br from-pink-500 via-red-500 to-yellow-400 flex items-center justify-center shadow-lg"
                  onClick={speakText(descEn)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 h-3 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M9 18V5l11-2v13" />
                    <path d="M6 18a3 3 0 100-6 3 3 0 000 6z" />
                  </svg>
                </div>

                <div className="marquee marquee-strong w-full overflow-hidden text-white/80 text-sm">
                  <div className="marquee-animation">
                    <span className="marquee-inner">{descEn || "Cuộn xuống để thấy sự kì diệu..."}</span>
                    <span className="marquee-inner">{descEn || "Cuộn xuống để thấy sự kì diệu..."}</span>
                  </div>
                </div>
              </div>
              )
          }
        </div>

        {/* optional footer area for actions (kept but styled minimal) */}
        {footer ? (
          <div className="absolute left-0 right-0 bottom-0 px-4 py-3 bg-linear-to-t from-black/60 to-transparent border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-white/70">{footer}</span>
            <div className="flex items-center space-x-2">
              <button
                className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg"
                onClick={(e) => { e.stopPropagation(); }}
              >
                Học ngay
              </button>
              <button
                className="text-sm text-white/60 hover:text-white transition"
                onClick={(e) => { e.stopPropagation(); }}
              >
                Khác
              </button>
            </div>
          </div>
        ) : null}
      </div>

    </div>
  );
}
