import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    return (
        <main className="home-container">
            <header className="home-header">
                <h1>TikLearn — Học nhanh, nhớ lâu</h1>
                <p className="lead">Chọn module phù hợp để bắt đầu: video ngắn, tình huống thực hành, ôn tập thông minh hoặc cuộn từ vựng.</p>
            </header>

            <nav className="module-list" aria-label="Danh sách module">
                <Link to="/topics" className="module-card module-1" aria-label="Lướt Học — video từ vựng ngắn">
                    <div className="module-icon">🎬</div>
                    <div className="module-content">
                        <h2>Lướt Học</h2>
                        <p>Tiếp thu từ vựng nhanh qua video ngắn và ví dụ thực tế.</p>
                        <span className="cta">Bắt đầu →</span>
                    </div>
                </Link>

                <Link to="/scenarios" className="module-card module-2" aria-label="Thực chiến Tình huống — nhập vai POV">
                    <div className="module-icon">🗣️</div>
                    <div className="module-content">
                        <h2>Thực chiến Tình huống</h2>
                        <p>Thực hành nhập vai theo tình huống để cải thiện phản xạ giao tiếp.</p>
                        <span className="badge">Tương tác</span>
                    </div>
                </Link>

                <Link to="/review" className="module-card module-3" aria-label="Ôn tập Thông minh — quiz trắc nghiệm">
                    <div className="module-icon">🧠</div>
                    <div className="module-content">
                        <h2>Ôn tập Thông minh</h2>
                        <p>Ôn lại từ đã học với quiz ngắn, ghi nhớ lâu hơn bằng thuật toán ôn tập lặp lại.</p>
                        <span className="badge">Ôn tập</span>
                    </div>
                </Link>

                <a href="/scroll" className="module-card module-4" aria-label="Cuộn Từ vựng — học bằng cuộn">
                    <div className="module-icon">📚</div>
                    <div className="module-content">
                        <h2>Cuộn Từ vựng</h2>
                        <p>Duyệt và học từ mới theo thẻ, phù hợp cho ôn lại nhẹ nhàng.</p>
                        <span className="cta">Khám phá →</span>
                    </div>
                </a>
            </nav>
        </main>
    );
};

export default HomePage;