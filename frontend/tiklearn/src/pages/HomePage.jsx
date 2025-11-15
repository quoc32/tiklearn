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

                {/* Module 3: Ôn tập - link to review page */}
                <Link to="/review" className="module-card module-3">
                    <div className="icon-circle">
                        <div className="module-icon">📚</div>
                    </div>
                    <div className="module-body">
                        <div className="module-head">
                            <h2>Module 3: "Ôn tập Thông minh"</h2>
                            <span className="badge">Ôn tập</span>
                        </div>
                        <p>Ôn lại và củng cố các từ bạn đã học bằng quiz trắc nghiệm ngắn.</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default HomePage;