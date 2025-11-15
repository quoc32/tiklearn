import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { countLearned, getLearnedWithLimit, getAllLearned } from '../services/api';
import './ReviewPage.css';

const ReviewPage = () => {
    const navigate = useNavigate();
    const [count, setCount] = useState(null);
    const [limit, setLimit] = useState(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [previewWords, setPreviewWords] = useState([]);

    const userId = 2; // default test user (changed to 2 for testing)

    useEffect(() => {
        setLoading(true);
        countLearned(userId)
            .then(res => {
                setCount(res.data.count ?? 0);
                // adjust default limit
                setLimit(Math.min(10, res.data.count ?? 0));
            })
            .catch(err => {
                console.error('Error fetching learned count', err);
                setError('Không thể lấy số lượng từ đã học');
            })
            .finally(() => setLoading(false));
    }, []);

    const handleStartWithLimit = () => {
        if (!limit || limit <= 0) return;
        setLoading(true);
        getLearnedWithLimit(userId, limit)
            .then(res => {
                const words = res.data;
                navigate('/quiz', { state: { quizWords: words } });
            })
            .catch(err => {
                console.error('Error fetching learned words with limit', err);
                setError('Không thể tải từ đã học');
            })
            .finally(() => setLoading(false));
    };

    const handlePreview = () => {
        if (!limit || limit <= 0) return;
        setLoading(true);
        getLearnedWithLimit(userId, limit)
            .then(res => {
                setPreviewWords(res.data || []);
            })
            .catch(err => {
                console.error('Preview error', err);
                setError('Không thể tải xem trước');
            })
            .finally(() => setLoading(false));
    };

    const handleStartAll = () => {
        setLoading(true);
        getAllLearned(userId)
            .then(res => {
                const words = res.data;
                navigate('/quiz', { state: { quizWords: words } });
            })
            .catch(err => {
                console.error('Error fetching all learned words', err);
                setError('Không thể tải từ đã học');
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="learn-container">
            <header className="learn-header">
                <h1>Module 3 — Ôn tập Thông minh</h1>
                <p>Ôn lại các từ bạn đã học trước đó bằng bài quiz trắc nghiệm.</p>
            </header>

            <div className="review-controls">
                <div className="hero">
                    <div className="hero-left">
                        <h1>Ôn tập Thông minh</h1>
                        <p>Ôn lại các từ đã học bằng bài quiz ngắn, tối ưu thời gian.</p>
                        <div className="stats">
                            <div className="stat">
                                <div className="stat-number">{count === null ? '—' : count}</div>
                                <div className="stat-label">Từ đã học</div>
                            </div>
                            <div className="stat">
                                <div className="stat-number">{limit}</div>
                                <div className="stat-label">Số chọn</div>
                            </div>
                        </div>
                    </div>
                    <div className="hero-right">
                        <div className="limit-controls">
                            <label>Chọn số lượng</label>
                            <div className="limit-input">
                                <button onClick={() => setLimit(Math.max(1, (limit || 1) - 1))}>−</button>
                                <input type="number" min="1" max={count || 100} value={limit} onChange={e => setLimit(Number(e.target.value))} />
                                <button onClick={() => setLimit((limit || 0) + 1)}>+</button>
                            </div>

                            <div className="preset">
                                <button onClick={() => setLimit(5)}>5</button>
                                <button onClick={() => setLimit(10)}>10</button>
                                <button onClick={() => setLimit(20)}>20</button>
                                <button onClick={() => setLimit(count || 0)}>Tất cả</button>
                            </div>

                            <div className="actions">
                                <button className="btn-primary" onClick={handleStartWithLimit} disabled={loading || !count}>Bắt đầu ({limit} từ)</button>
                                <button className="btn-outline" onClick={handleStartAll} disabled={loading || !count}>Bắt đầu tất cả</button>
                                <button className="btn-link" onClick={handlePreview} disabled={loading || !count}>Xem trước</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="preview">
                    <h3>Xem trước các từ</h3>
                    {loading && <div className="small">Đang tải...</div>}
                    {error && <div className="error-text">{error}</div>}
                    {!loading && previewWords && previewWords.length === 0 && <div className="small muted">Nhấn "Xem trước" để tải ví dụ từ</div>}
                    {previewWords && previewWords.length > 0 && (
                        <div className="preview-list">
                            {previewWords.map(w => (
                                <div key={w.id} className="preview-item">
                                    <div className="pv-word">{w.word}</div>
                                    <div className="pv-meaning">{w.meaning}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="back-row">
                    <button className="btn-link" onClick={() => navigate(-1)}>Quay lại</button>
                </div>
            </div>
        </div>
    );
};

export default ReviewPage;
