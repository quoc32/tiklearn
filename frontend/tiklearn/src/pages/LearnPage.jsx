// src/pages/LearnPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getLearningBatch } from '../services/api';
import WordVideo from '../components/WordVideo'; // Import component WordVideo

import './LearnPage.css';

const LearnPage = () => {
    const [words, setWords] =useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showQuizButton, setShowQuizButton] = useState(false);
    const [isThrottled, setIsThrottled] = useState(false);
    const navigate = useNavigate();
    const pageRef = useRef(null);

    const { topicId } = useParams(); // Lấy topicId từ URL

    // Xử lý nút Back
    const handleBackClick = () => {
        navigate('/topics'); // Quay lại trang chọn chủ đề
    };

    useEffect(() => {
        if (!topicId) return;
        setIsLoading(true);
        getLearningBatch(topicId) // Gọi API với topicId
            .then(response => {
                setWords(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Lỗi khi tải từ vựng:", error);
                setIsLoading(false);
            });
    }, [topicId]);

    useEffect(() => {
        const handleWheel = (event) => {
            const infoPanel = event.target.closest('.video-info-panel');
            if (infoPanel) {
                return;
            }
            event.preventDefault();

            if (isThrottled) {
                return;
            }

            const delta = event.deltaY;
            let direction = 0;

            if (delta > 20) { // Cuộn xuống
                direction = 1;
            } else if (delta < -20) { // Cuộn lên
                direction = -1;
            }

            if (direction !== 0) {
                setIsThrottled(true);
                setCurrentIndex(prevIndex => {
                    const newIndex = prevIndex + direction;
                    if (newIndex >= 0 && newIndex < words.length) {
                        return newIndex;
                    }
                    return prevIndex;
                });
                setTimeout(() => {
                    setIsThrottled(false);
                }, 700);
            }
        };

        const container = pageRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
        }
        return () => {
            if (container) {
                container.removeEventListener('wheel', handleWheel);
            }
        };
    }, [isThrottled, words.length]);

    useEffect(() => {
        if (words.length > 0 && currentIndex === words.length - 1) {
            setShowQuizButton(true);
        } else {
            setShowQuizButton(false);
        }
    }, [currentIndex, words.length]);

    const handleQuizClick = () => {
        navigate('/quiz', { state: { quizWords: words } });
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <div className="loading-text">Đang tải bộ từ vựng...</div>
            </div>
        );
    }

    if (!words || words.length === 0) {
        return (
            <div className="error-container">
                <h2>Không tìm thấy từ vựng</h2>
                <p>Không có từ vựng nào cho chủ đề này.</p>
                <button
                    className="back-button"
                    onClick={handleBackClick}
                    style={{position: 'static', marginTop: '20px', fontSize: '1rem', fontWeight: 600}}>
                    Quay lại
                </button>
            </div>
        );
    }

    return (
        <div className="learn-page-container" ref={pageRef}>
            <div className="tiktok-layout">
                <div className="left-sidebar">
                    <button className="back-button" onClick={handleBackClick}>
                        ←
                    </button>
                </div>

                <div className="video-section-viewport">
                    <div
                      className="video-list-wrapper"
                      style={{
                          transform: `translateY(-${currentIndex * 100}vh)`,
                      }}
                    >
                        {words.map((word, index) => (
                            <WordVideo
                                key={word.id}
                                vocab={word}
                                currentIndex={index}
                                totalWords={words.length}
                                isActive={index === currentIndex}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {showQuizButton && (
                <div className="quiz-button-container">
                    <button
                        className="quiz-button"
                        onClick={handleQuizClick}
                    >
                        <span className="quiz-button-icon">🧠</span>
                        <span className="quiz-button-text">Làm Quiz</span>
                        <span className="quiz-button-arrow">→</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default LearnPage;