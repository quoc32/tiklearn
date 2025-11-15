import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TopicSelectPage from './pages/TopicSelectPage';
import LearnPage from './pages/LearnPage';
import QuizPage from './pages/QuizPage';
import ReviewPage from './pages/ReviewPage';
import ResultPage from './pages/ResultPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/topics" element={<TopicSelectPage />} />
      <Route path="/learn/:topicId" element={<LearnPage />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/review" element={<ReviewPage />} />
      <Route path="/result" element={<ResultPage />} />
    </Routes>
  );
}

export default App;