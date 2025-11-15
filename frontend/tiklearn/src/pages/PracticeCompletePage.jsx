// src/pages/PracticeCompletePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ResultPage.css'; // Tái sử dụng CSS của ResultPage

const PracticeCompletePage = () => {
    const navigate = useNavigate();

    return (
        <div className="result-page" style={{background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'}}>
            <div className="result-container">
                <div className="score-section">
                    <div className="performance-indicator performance-excellent">
                        Hoàn thành! 🎉
                    </div>
                </div>

                <h1 className="result-title">Kết thúc Tình huống</h1>
                <p className="result-summary">
                    Bạn đã hoàn thành kịch bản thực hành.
                </p>

                <div className="button-group" style={{flexDirection: 'column'}}>
                    <button className="button-primary" onClick={() => navigate('/scenarios')}>
                        Chọn tình huống khác
                    </button>
                    <button className="button-secondary" onClick={() => navigate('/')}>
                        Về trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PracticeCompletePage;