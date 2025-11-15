// src/pages/QuizPage.jsx
import React, { useState, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { submitQuizResults } from '../services/api';
import './QuizPage.css';

const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
};

const QuizPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { quizWords } = location.state || { quizWords: [] };

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [feedback, setFeedback] = useState(null);

    // Sử dụng useRef để lưu trữ answers - tránh async issues
    const answersRef = useRef({});

    const quizData = useMemo(() => {
        if (!Array.isArray(quizWords) || quizWords.length === 0) return [];

        console.log('Creating quiz data from words:', quizWords);

        return quizWords.map(currentWord => {
            const correctAnswer = currentWord.meaning;
            const wrongAnswers = quizWords
                .filter(word => word.id !== currentWord.id)
                .map(word => word.meaning)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3);
            const options = shuffleArray([correctAnswer, ...wrongAnswers]);

            const questionData = {
                id: currentWord.id,
                word: currentWord.word,
                options: options,
                correctAnswer: correctAnswer
            };

            console.log(`Question for word "${currentWord.word}":`, questionData);
            return questionData;
        });
    }, [quizWords]);

    const handleAnswerSelect = (vocabId, selectedMeaning) => {
        if (feedback) return;

        const currentQuestion = quizData[currentQuestionIndex];
        const isCorrect = selectedMeaning === currentQuestion.correctAnswer;

        console.log(`=== ANSWER SELECTED ===`);
        console.log(`Question #${currentQuestionIndex + 1}`);
        console.log(`Vocab ID: ${vocabId}`);
        console.log(`Word: ${currentQuestion.word}`);
        console.log(`Selected: "${selectedMeaning}"`);
        console.log(`Correct Answer: "${currentQuestion.correctAnswer}"`);
        console.log(`Is Correct: ${isCorrect}`);

        // Lưu câu trả lời vào ref ngay lập tức
        answersRef.current[vocabId] = {
            selectedMeaning: selectedMeaning,
            isCorrect: isCorrect,
            word: currentQuestion.word,
            correctAnswer: currentQuestion.correctAnswer
        };

        console.log('Current answers state:', answersRef.current);

        setFeedback(isCorrect ? 'correct' : 'incorrect');

        setTimeout(() => {
            setFeedback(null);
            if (currentQuestionIndex < quizData.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                // Nộp bài khi xong câu cuối
                handleSubmit();
            }
        }, 1200);
    };

    const handleSubmit = () => {
        console.log('=== SUBMITTING QUIZ ===');
        console.log('All answers collected:', answersRef.current);

        // Tạo payload từ answersRef
        const resultsPayload = quizData.map(question => {
            const answer = answersRef.current[question.id];
            const isCorrect = answer ? answer.isCorrect : false;

            console.log(`Processing question ID ${question.id}:`);
            console.log(`  - Word: ${question.word}`);
            console.log(`  - Answer found:`, answer);
            console.log(`  - Is Correct: ${isCorrect}`);

            return {
                vocabularyId: question.id,
                correct: isCorrect  // Sử dụng field name 'correct' thay vì 'isCorrect'
            };
        });

        console.log('Final payload to send to server:', resultsPayload);
        console.log('Payload summary:');
        resultsPayload.forEach((result, index) => {
            console.log(`  ${index + 1}. ID: ${result.vocabularyId}, Correct: ${result.correct}`);
        });

        submitQuizResults(resultsPayload)
            .then(response => {
                console.log('=== SERVER RESPONSE ===');
                console.log('Full response:', response);
                console.log('Response data:', response.data);
                console.log('Correct count:', response.data.correct);
                console.log('Total questions:', response.data.total);
                console.log('Missed word IDs:', response.data.missedWordIds);

                navigate('/result', { state: { resultData: response.data } });
            })
            .catch(error => {
                console.error("=== QUIZ SUBMISSION ERROR ===");
                console.error("Error:", error);
                console.error("Error response:", error.response?.data);
                console.error("Error status:", error.response?.status);
            });
    };

    if (quizData.length === 0) {
        return (
            <div className="quiz-container centered">
                <div className="error-message">
                    <h1>Lỗi</h1>
                    <p>Không tìm thấy từ vựng. Vui lòng quay lại.</p>
                    <button className="button-primary" onClick={() => navigate('/topics')}>
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = quizData[currentQuestionIndex];
    const progressPercent = ((currentQuestionIndex + 1) / quizData.length) * 100;

    return (
        <div className="quiz-container">
            <div className="quiz-content">
                <div className="progress-section">
                    <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <p className="progress-text">Câu hỏi {currentQuestionIndex + 1} / {quizData.length}</p>
                </div>

                <div className="quiz-card">
                    <h2 className="quiz-question">
                        Từ <strong>"{currentQuestion.word}"</strong> có nghĩa là gì?
                    </h2>

                    <div className="quiz-options">
                        {currentQuestion.options.map((option, index) => {
                            let buttonClass = 'option-button';
                            if (feedback) {
                                if (option === currentQuestion.correctAnswer) {
                                    buttonClass += ' correct';
                                } else if (answersRef.current[currentQuestion.id]?.selectedMeaning === option) {
                                    buttonClass += ' incorrect';
                                } else {
                                    buttonClass += ' faded';
                                }
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                                    className={buttonClass}
                                    disabled={!!feedback}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizPage;