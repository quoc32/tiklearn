// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Chào mừng bạn!</h1>
                <p>Chọn một module để bắt đầu hành trình học của bạn.</p>
            </header>
            <div className="module-list">
                {/* Module 1: Lướt Học */}
                <Link to="/topics" className="module-card module-1">
                    <div className="module-icon">🧠</div>
                    <h2>Module 1: "Lướt Học"</h2>
                    <p>Tiếp thu từ vựng nhanh qua video.</p>
                </Link>

                {/* Module 2: SỬA LẠI */}
                <Link to="/scenarios" className="module-card module-2">
                    <div className="module-icon">🗣️</div>
                    <h2>Module 2: "Thực chiến Tình huống"</h2>
                    <p>Áp dụng nhập vai POV.</p>
                </Link>

                {/* Module 3: Ôn tập (Vẫn vô hiệu hóa) */}
                <div className="module-card disabled">
                    <div className="module-icon">📚</div>
                    <h2>Module 3: "Ôn tập Thông minh"</h2>
                    <p>Ghi nhớ dài hạn (Sắp ra mắt)</p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;