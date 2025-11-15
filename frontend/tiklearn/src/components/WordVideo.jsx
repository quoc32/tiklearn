import React, { useState, useEffect, useRef } from 'react';
import './WordVideo.css';

const WordVideo = ({ vocab, currentIndex, totalWords, isActive }) => {
    const [isInfoHidden, setIsInfoHidden] = useState(false);
    const videoRef = useRef(null);

    // Tự động play/pause video khi slide
    useEffect(() => {
        if (videoRef.current) {
            if (isActive) {
                videoRef.current.play().catch(error => {
                    // Tắt lỗi nếu trình duyệt chặn autoplay
                });
            } else {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
            }
        }
    }, [isActive]);

    const toggleInfoPanel = () => {
        setIsInfoHidden(!isInfoHidden);
    };

    const progressPercent = totalWords > 0 ? ((currentIndex + 1) / totalWords) * 100 : 0;
    const statusText = vocab.status === 'NOT_LEARNED' ? '[Chưa học]' : '[Đã học]';

    return (
        // .video-slide-container nằm trong LearnPage.css
        <div className="video-slide-container">
            {/* .video-section là container chính của component này */}
            <div className="video-section">

                <div className={`video-content-container ${isInfoHidden ? 'info-hidden' : ''}`}>
                    {/* KHU VỰC VIDEO */}
                    <video
                        ref={videoRef}
                        className="video-player"
                        src={vocab.videoUrl} // Từ DTO
                        loop
                        muted
                        playsInline // Quan trọng cho Safari
                        key={vocab.id}
                    />

                    {/* KHU VỰC INFO PANEL (BÊN PHẢI) */}
                    <div className={`video-info-panel ${isInfoHidden ? 'hidden' : ''}`}>

                        {/* Progress */}
                        <div className="progress-indicator">
                            <div className="progress-text">TIẾN ĐỘ: {currentIndex + 1} / {totalWords}</div>
                            <div className="progress-bar-mini">
                                <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="status-label">{statusText}</div>

                        {/* Word Info */}
                        <div className="word-info">
                            <h2>{vocab.word}</h2>
                            <div className="pronunciation">{vocab.pronunciation}</div>
                            <div className="part-of-speech">{vocab.partOfSpeech}</div>
                            <div className="meaning">{vocab.meaning}</div>
                        </div>

                        {/* Example */}
                        <div className="example-info">
                            <h3>VÍ DỤ</h3>
                            <p>{vocab.exampleSentence}</p>
                        </div>

                    </div>
                </div>

                {/* NÚT TOGGLE */}
                <button
                    className={`info-toggle-button ${isInfoHidden ? 'info-hidden' : ''}`}
                    onClick={toggleInfoPanel}
                >
                    <span className="toggle-icon">{isInfoHidden ? '‹' : '›'}</span>
                </button>

            </div>
        </div>
    );
};

export default WordVideo;