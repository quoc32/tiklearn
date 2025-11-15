import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTopics } from '../services/api';
import './TopicSelectPage.css';

const TopicSelectPage = () => {
    const [topics, setTopics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getTopics()
            .then(response => {
                setTopics(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Lỗi khi tải chủ đề:", error);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <div className="loading-container" style={{textAlign: 'center', paddingTop: '50px', fontSize: '1.2rem'}}>Đang tải chủ đề...</div>;
    }

    return (
        <div className="topic-select-container">
            <button className="back-button" onClick={() => navigate('/')}>
                ← Quay lại
            </button>
            <h1 className="topic-select-title">Chọn một Chủ đề</h1>
            <div className="topic-grid">
                {topics.map(topic => (
                    <Link
                        to={`/learn/${topic.id}`}
                        key={topic.id}
                        className="topic-card"
                    >
                        <div className="topic-icon">{topic.icon}</div>
                        <h2>{topic.name}</h2>
                        <p>{topic.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default TopicSelectPage;