// src/pages/PracticePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStartingPracticeNode, getNextNode } from '../services/api';
import './PracticePage.css'; // CSS mới

const PracticePage = () => {
    const { scenarioId } = useParams();
    const navigate = useNavigate();
    const videoRef = useRef(null);

    const [currentNode, setCurrentNode] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showChoices, setShowChoices] = useState(false);

    // 1. Tải node (video) bắt đầu
    useEffect(() => {
        setIsLoading(true);
        setShowChoices(false);
        getStartingPracticeNode(scenarioId)
            .then(response => {
                setCurrentNode(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Lỗi tải node bắt đầu:", error);
                setIsLoading(false);
            });
    }, [scenarioId]);

    // 2. Tự động phát video khi node thay đổi
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play();
        }
    }, [currentNode]);

    // 3. Xử lý khi video kết thúc (dừng lại)
    const handleVideoEnd = () => {
        if (currentNode && currentNode.choices && currentNode.choices.length > 0) {
            setShowChoices(true); // Hiển thị các lựa chọn [cite: 37]
        } else {
            // Nếu video không có lựa chọn (video nhánh), kết thúc
            navigate('/practice/complete');
        }
    };

    // 4. Xử lý khi chọn một lựa chọn [cite: 38]
    const handleChoiceClick = (choiceId) => {
        setIsLoading(true); // Hiển thị loading
        setShowChoices(false); // Ẩn lựa chọn

        getNextNode(choiceId)
            .then(response => {
                if (response.data) {
                    // Chuyển sang node (video) tiếp theo
                    setCurrentNode(response.data);
                    setIsLoading(false);
                } else {
                    // Kết thúc tình huống
                    navigate('/practice/complete');
                }
            })
            .catch(error => {
                console.error("Lỗi tải node tiếp theo:", error);
                setIsLoading(false);
            });
    };

    if (isLoading && !currentNode) {
        return <div className="practice-loading">Đang tải tình huống...</div>;
    }

    return (
        <div className="practice-container">
            <div className="pov-video-wrapper">
                {isLoading ? (
                    <div className="practice-loading">Đang tải video tiếp theo...</div>
                ) : (
                    currentNode && (
                        <video
                            ref={videoRef}
                            src={currentNode.videoPath}
                            onEnded={handleVideoEnd}
                            key={currentNode.id}
                            className="pov-video"
                            playsInline
                            // Thêm 'controls' nếu muốn user tự play/pause
                        />
                    )
                )}
            </div>

            {showChoices && (
                <div className="choices-overlay animate-in">
                    <div className="choices-prompt">
                        {currentNode.promptText}
                    </div>
                    <div className="choices-list">
                        {currentNode.choices.map(choice => (
                            <button
                                key={choice.id}
                                className="choice-button"
                                onClick={() => handleChoiceClick(choice.id)}
                            >
                                {choice.choiceText}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PracticePage;