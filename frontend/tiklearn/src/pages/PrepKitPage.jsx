// src/pages/PrepKitPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPrepKit } from '../services/api';
import './PrepKitPage.css'; // CSS mới cho flashcard

// Component Flashcard (định nghĩa bên trong)
const Flashcard = ({ word }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    return (
        <div className="flashcard" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`flashcard-inner ${isFlipped ? 'is-flipped' : ''}`}>
                <div className="flashcard-front">
                    <h2>{word.word}</h2>
                    <p>({word.partOfSpeech})</p>
                    <small>(Nhấp để xem nghĩa)</small>
                </div>
                <div className="flashcard-back">
                    <h3>{word.meaning}</h3>
                    <p className="example-sentence">"{word.exampleSentence}"</p>
                </div>
            </div>
        </div>
    );
};

const PrepKitPage = () => {
    const { scenarioId } = useParams();
    const navigate = useNavigate();
    const [flashcards, setFlashcards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        getPrepKit(scenarioId)
            .then(response => {
                setFlashcards(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Lỗi khi tải Prep-Kit:", error);
                setIsLoading(false);
            });
    }, [scenarioId]);

    const handleStart = () => {
        navigate(`/practice/${scenarioId}`); // Chuyển đến trang thực hành
    };

    if (isLoading) {
        return <div className="loading-container">Đang tải bộ từ vựng...</div>;
    }

    return (
        <div className="prep-kit-container">
            <h1 className="prep-kit-title">Bộ từ vựng Chuẩn bị</h1>
            <p className="prep-kit-subtitle">Nắm vững các từ này trước khi bắt đầu.</p>

            <div className="flashcard-grid">
                {flashcards.map(word => (
                    <Flashcard key={word.id} word={word} />
                ))}
            </div>

            <div className="prep-kit-actions">
                <button className="button-secondary" onClick={() => navigate('/scenarios')}>
                    Quay lại
                </button>
                <button className="button-primary" onClick={handleStart}>
                    Bắt đầu Thực hành
                </button>
            </div>
        </div>
    );
};

export default PrepKitPage;