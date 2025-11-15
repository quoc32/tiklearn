// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TopicSelectPage from './pages/TopicSelectPage';
import LearnPage from './pages/LearnPage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';

// IMPORT CÁC TRANG MỚI CỦA MODULE 2
import ScenarioSelectPage from './pages/ScenarioSelectPage';
import PrepKitPage from './pages/PrepKitPage';
import PracticePage from './pages/PracticePage';
import PracticeCompletePage from './pages/PracticeCompletePage'; // Trang hoàn thành

function App() {
  return (
    <Routes>
      {/* Trang chủ */}
      <Route path="/" element={<HomePage />} />

      {/* Module 1 Routes */}
      <Route path="/topics" element={<TopicSelectPage />} />
      <Route path="/learn/:topicId" element={<LearnPage />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/result" element={<ResultPage />} />

      {/* Module 2 Routes (MỚI) */}
      <Route path="/scenarios" element={<ScenarioSelectPage />} />
      <Route path="/prep-kit/:scenarioId" element={<PrepKitPage />} />
      <Route path="/practice/:scenarioId" element={<PracticePage />} />
      <Route path="/practice/complete" element={<PracticeCompletePage />} />

    </Routes>
  );
}

export default App;