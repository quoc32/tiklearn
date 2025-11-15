import React from 'react';

export default function QuizCard({ items }) {
  const pairs = (items || []).map((it) => {
    const parts = it.split('-').map((s) => s.trim());
    return { vi: parts[0] || '', en: parts[1] || '' };
  });

  const [index, setIndex] = React.useState(0);
  const [options, setOptions] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  const [score, setScore] = React.useState(0);

  React.useEffect(() => {
    if (!pairs.length) return;
    const correct = pairs[index].en;
    const others = pairs
      .filter((_, i) => i !== index)
      .map((p) => p.en)
      .filter(Boolean);

    // pick up to 3 random wrong answers
    const shuffledOthers = others.sort(() => Math.random() - 0.5).slice(0, 3);
    const mixed = [...shuffledOthers, correct].sort(() => Math.random() - 0.5);
    setOptions(mixed);
    setSelected(null);
  }, [index, items]); // items kept to regenerate when source changes

  const handleSelect = (opt) => {
    if (selected) return;
    setSelected(opt);
    if (opt === pairs[index].en) setScore((s) => s + 1);
  };

  const handleNext = () => {
    setIndex((i) => (i + 1) % Math.max(1, pairs.length));
  };

  const handleReset = () => {
    setIndex(0);
    setScore(0);
    setSelected(null);
  };

  if (!pairs.length) {
    return (
      <div className="max-w-md w-full mx-auto bg-white rounded-2xl shadow-lg p-6">
        <p className="text-gray-600 text-center">Không có câu hỏi nào.</p>
      </div>
    );
  }

  const progress = Math.round(((index + 1) / pairs.length) * 100);

  return (
    <div className="max-w-md w-full mx-auto bg-linear-to-br from-white to-gray-50 rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.01] transition-all duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm text-indigo-600 font-semibold uppercase tracking-wide">
              Luyện từ vựng
            </h3>
            <h2 className="mt-2 text-2xl font-extrabold text-gray-900">
              {pairs[index].vi}
            </h2>
            <p className="mt-1 text-sm text-gray-500">Chọn nghĩa tiếng Anh đúng</p>
          </div>

          <div className="flex flex-col items-end">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium">
              Điểm: <span className="ml-2 font-semibold">{score}</span>
            </div>
            <div className="mt-2 text-xs text-gray-400">Câu {index + 1} / {pairs.length}</div>
          </div>
        </div>

        <div className="mt-5">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt, i) => {
            const isCorrect = opt === pairs[index].en;
            const isSelected = selected === opt;
            const base =
              'w-full text-left px-4 py-3 rounded-lg border transition-shadow flex items-center justify-between';
            const tone = !selected
              ? 'bg-white border-gray-200 hover:shadow-md hover:translate-y-[-2px] focus:ring-2 focus:ring-indigo-200'
              : isSelected
              ? isCorrect
                ? 'bg-green-50 border-green-300 shadow-inner'
                : 'bg-red-50 border-red-300 shadow-inner'
              : 'bg-gray-50 border-gray-100 opacity-80';
            return (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                disabled={!!selected}
                className={`${base} ${tone}`}
                aria-pressed={isSelected}
              >
                <span className="text-gray-800 font-medium">{opt}</span>
                {/* indicator */}
                <span className="ml-3 w-6 h-6 flex items-center justify-center text-sm">
                  {selected ? (isSelected ? (isCorrect ? '✓' : '✕') : '') : ''}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-gray-600 min-h-6">
            {selected ? (
              selected === pairs[index].en ? (
                <span className="text-green-600 font-medium">Chính xác! 🎉</span>
              ) : (
                <span className="text-red-600 font-medium">
                  Sai — đáp án đúng: <span className="font-semibold">{pairs[index].en}</span>
                </span>
              )
            ) : (
              <span>Chọn 1 đáp án</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="text-sm text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md hover:bg-gray-100 transition"
            >
              Làm lại
            </button>

            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm shadow hover:bg-indigo-700 transition"
            >
              Câu tiếp
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
