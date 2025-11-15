// src/pages/ScenarioSelectPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllScenarios } from '../services/api';
import './TopicSelectPage.css'; // Tái sử dụng CSS của trang chọn chủ đề

const ScenarioSelectPage = () => {
    const [scenarios, setScenarios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        getAllScenarios()
            .then(response => {
                setScenarios(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Lỗi khi tải kịch bản:", error);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <div className="loading-container" style={{textAlign: 'center', paddingTop: '50px', fontSize: '1.2rem'}}>Đang tải các tình huống...</div>;
    }

    return (
        <div className="topic-select-container">
            <button className="back-button" onClick={() => navigate('/video')}>
                ← Quay lại
            </button>
            <h1 className="topic-select-title">Chọn Tình huống Thực chiến</h1>
            <div className="topic-grid">
                {scenarios.map(scenario => (
                    <Link
                        to={`/prep-kit/${scenario.id}`} // Đi đến trang Prep-Kit
                        key={scenario.id}
                        className="topic-card"
                    >
                        <div className="topic-icon">{scenario.icon}</div>
                        <h2>{scenario.name}</h2>
                        <p>{scenario.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ScenarioSelectPage;