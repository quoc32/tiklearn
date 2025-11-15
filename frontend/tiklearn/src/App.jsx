// src/App.jsx (ĐÃ GỘP THEO YÊU CẦU MỚI)

import React, { useEffect, useState } from 'react';
import { Routes, Route, NavLink, Outlet } from 'react-router-dom';
import './App.css'; // File CSS của dự án mới

// Import các trang của DỰ ÁN 1 (Lộ trình)
import HomePage from './pages/HomePage';
import TopicSelectPage from './pages/TopicSelectPage';
import LearnPage from './pages/LearnPage';
import QuizPage from './pages/QuizPage';
import ReviewPage from './pages/ReviewPage';
import ResultPage from './pages/ResultPage';
import ScenarioSelectPage from './pages/ScenarioSelectPage';
import PrepKitPage from './pages/PrepKitPage';
import PracticePage from './pages/PracticePage';
import PracticeCompletePage from './pages/PracticeCompletePage';

// Import các component của DỰ ÁN 2 (Mới)
import LearnWithPic from './components/LearnWithPic.jsx';
import LearnWithVideo from './components/LearnWithVideo.jsx';
import Redeem from './components/redeem.jsx';
import CrudGift from '../../../frontend-2/crud_gift.jsx'; // CẢNH BÁO: Đường dẫn này có thể sai
import BackgroundEffect from './components/BackgroundEffect.jsx';
import ForegroundEffect from './components/ForegroundEffect.jsx';

// --- STYLES (Giữ nguyên từ code của bạn) ---
const navStyle = {
  position: 'sticky',
  top: 0,
  left: 0,
  right: 0,
  display: 'flex',
  gap: '8px',
  padding: '10px 16px',
  alignItems: 'center',
  background: '#ffffff',
  boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
  zIndex: 1000,
};

const buttonBase = {
  border: 'none',
  background: 'transparent',
  padding: '8px 12px',
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: 16,
  textDecoration: 'none',
  color: '#0f172a',
};

const activeButton = {
  background: '#0ea5a4',
  color: '#fff',
  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
};
// --- KẾT THÚC STYLES ---


// Component Layout chính chứa thanh điều hướng
function MainLayout() {
  const [activeForeground, setActiveFoneground] = useState(false);

  useEffect(() => {
    let timer;
    if (activeForeground) {
      timer = setTimeout(() => {
        setActiveFoneground(false);
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [activeForeground]);

  return (
    <>
      <BackgroundEffect />
      {/* {activeForeground ? <ForegroundEffect /> : null} */}

      {/* THANH ĐIỀU HƯỚNG */}
      <nav style={navStyle}>
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', marginRight: 8, textDecoration: 'none' }}>
          <img
            src="./tiklearn-logo.png"
            alt="TikLearn"
            style={{ height: 40, width: 'auto', display: 'block', marginRight: 8 , borderRadius: 8}}
          />
          <span style={{ fontWeight: 700, color: '#0f172a', fontSize: 20 }}>TikLearn</span>
        </NavLink>

        {/* Các nút điều hướng (Tabs) */}
        <NavLink
          to="/"
          end // "end" để đảm bảo NavLink chỉ active khi ở "/"
          style={({ isActive }) => (isActive ? { ...buttonBase, ...activeButton } : buttonBase)}
        >
          Ảnh
        </NavLink>
        <NavLink
          to="/video" // <-- SỬA: "Video" là trang chủ lộ trình
          style={({ isActive }) => (isActive ? { ...buttonBase, ...activeButton } : buttonBase)}
        >
          Video
        </NavLink>
        <NavLink
          to="/redeem"
          style={({ isActive }) => (isActive ? { ...buttonBase, ...activeButton } : buttonBase)}
        >
          Đổi quà
        </NavLink>
        <NavLink
          to="/crud-gift"
          style={({ isActive }) => (isActive ? { ...buttonBase, ...activeButton } : buttonBase)}
        >
          Crud quà
        </NavLink>

        {/* Chúng ta không cần link "Lộ trình" nữa vì nó đã là "Video"
        <NavLink
          to="/roadmap"
          style={({ isActive }) => (isActive ? { ...buttonBase, ...activeButton } : buttonBase)}
        >
          Lộ trình
        </NavLink>
        */}
      </nav>

      {/* NỘI DUNG TRANG */}
      <div
        className="tab-panel"
        style={{
          paddingTop: `${16}px`,
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        {/* Truyền context cho các component con (ví dụ: LearnWithPic) */}
        <Outlet context={{ setActiveFoneground }} />
      </div>
    </>
  );
}


// Component App chính chỉ chứa Routes
function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Trang chủ (index) bây giờ là LearnWithPic */}
        <Route index element={<LearnWithPic />} />

        {/* SỬA: Trang "Video" (HomePage/Lộ trình) */}
        <Route path="video" element={<HomePage />} />

        {/* Các route của DỰ ÁN 2 (Mới) */}
        <Route path="redeem" element={<Redeem />} />
        <Route path="crud-gift" element={<CrudGift />} />

        {/* Các route của DỰ ÁN 1 (Lộ trình) - Chúng vẫn cần thiết
            để khi nhấp vào một lộ trình, chúng ta có thể điều hướng */}
        <Route path="topics" element={<TopicSelectPage />} />
        <Route path="learn/:topicId" element={<LearnPage />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="review" element={<ReviewPage />} />
        <Route path="result" element={<ResultPage />} />
        <Route path="scenarios" element={<ScenarioSelectPage />} />
        <Route path="prep-kit/:scenarioId" element={<PrepKitPage />} />
        <Route path="practice/:scenarioId" element={<PracticePage />} />
        <Route path="practice/complete" element={<PracticeCompletePage />} />
      </Route>
    </Routes>
  );
}

export default App;