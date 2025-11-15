// src/pages/ResultPage.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResultPage.css';

const ResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { resultData } = location.state || {};

    console.log('ResultPage - Received data:', resultData);

    if (!resultData) {
        return (
            <div className="result-page">
                <div className="result-container">
                    <div className="error-container">
                        <h1>Lỗi</h1>
                        <p>Không có dữ liệu kết quả.</p>
                        <button className="button-secondary" onClick={() => navigate('/')}>
                            Về trang chủ
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const { correct, total, missedWordIds } = resultData;
    const missedCount = missedWordIds ? missedWordIds.length : 0;
    const score = total > 0 ? (correct / total) * 100 : 0;

    console.log(`Result calculations: correct=${correct}, total=${total}, score=${score}%`);

    const getPerformanceClass = (score) => {
        if (score >= 90) return 'performance-excellent';
        if (score >= 70) return 'performance-good';
        if (score >= 50) return 'performance-fair';
        return 'performance-poor';
    };

    const getPerformanceText = (score) => {
        if (score >= 90) return 'Xuất sắc! 🎉';
        if (score >= 70) return 'Tốt! 👍';
        if (score >= 50) return 'Khá ổn! 👌';
        return 'Cần cố gắng thêm! 💪';
    };

    const scoreStyle = { "--score-percent": score };

    const handleReview = () => {
        console.log('Review requested for missed words:', missedWordIds);
        alert(`Đang phát triển! Sẽ học lại ${missedCount} từ sai.`);
    };

    return (
        <div className="result-page">
            <div className="result-container">
                <div className="score-section">
                    <div className={`performance-indicator ${getPerformanceClass(score)}`}>
                        {getPerformanceText(score)}
                    </div>
                    <div className="score-chart" style={scoreStyle}>
                        <div className="score-text">
                            <span className="score-number">{correct}</span>
                            <span className="score-total">/ {total}</span>
                        </div>
                    </div>
                </div>

                <h1 className="result-title">Kết quả học tập</h1>
                <p className="result-summary">
                    Bạn đã trả lời đúng {correct} trên {total} câu hỏi với tỷ lệ {Math.round(score)}%.
                </p>

                <div className="button-group">
                    <button className="button-secondary" onClick={() => navigate('/')}>
                        Thoát
                    </button>
                    {missedCount > 0 && (
                        <button className="button-primary" onClick={handleReview}>
                            Xem lại ({missedCount} từ sai)
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResultPage;