
// import { useEffect, useState } from 'react'
// import './App.css'
// import LearnWithPic from './components/LearnWithPic.jsx'
// import LearnWithVideo from './components/LearnWithVideo.jsx'
// import Redeem from './components/redeem.jsx'
// import CrudGift from '../../../frontend-2/crud_gift.jsx'
// import BackgroundEffect from './components/BackgroundEffect.jsx'
// import ForegroundEffect from './components/ForegroundEffect.jsx'

// function App() {
//   const [activeTab, setActiveTab] = useState('pic')
//   const [activeForeground, setActiveFoneground] = useState(false)

//   const navStyle = {
//     // position: 'fixed',
//     position: 'sticky',
//     top: 0,
//     left: 0,
//     right: 0,
//     display: 'flex',
//     gap: '8px',
//     padding: '10px 16px',
//     alignItems: 'center',
//     background: '#ffffff',
//     boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
//     zIndex: 1000,
//   };

//   const buttonBase = {
//     border: 'none',
//     background: 'transparent',
//     padding: '8px 12px',
//     borderRadius: 6,
//     cursor: 'pointer',
//     fontSize: 16,
//   };

//   const activeButton = {
//     background: '#0ea5a4',
//     color: '#fff',
//     boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
//   };

//   // height of the fixed nav (used to offset content)
//   const navHeight = 54;

//   useEffect(() => {
//     let timer;
//     if (activeForeground) {
//       timer = setTimeout(() => {
//         setActiveFoneground(false);
//       }, 3000);
//     }
//     return () => {
//       if (timer) clearTimeout(timer);
//     };
//   }, [activeForeground])

//   return (
//     <>
//       <BackgroundEffect />
//       {/* {activeForeground ? <ForegroundEffect /> : null} */}

//       <div role="tablist" aria-label="Main navigation" style={navStyle}>
//         {/* Logo */}
//         <a
//           href="#"
//           onClick={(e) => { e.preventDefault(); setActiveTab('pic'); }}
//           aria-label="TikLearn Home"
//           style={{ display: 'flex', alignItems: 'center', marginRight: 8, textDecoration: 'none' }}
//         >
//           <img
//             src="./tiklearn-logo.png"
//             alt="TikLearn"
//             style={{ height: 40, width: 'auto', display: 'block', marginRight: 8 , borderRadius: 8}}
//           />
//           <span style={{ fontWeight: 700, color: '#0f172a', fontSize: 20 }}>TikLearn</span>
//         </a>

//         <button
//           role="tab"
//           aria-selected={activeTab === 'pic'}
//           style={activeTab === 'pic' ? { ...buttonBase, ...activeButton } : buttonBase}
//           onClick={() => setActiveTab('pic')}
//         >
//           Ảnh
//         </button>
//         <button
//           role="tab"
//           aria-selected={activeTab === 'video'}
//           style={activeTab === 'video' ? { ...buttonBase, ...activeButton } : buttonBase}
//           onClick={() => setActiveTab('video')}
//         >
//           Video
//         </button>
//         <button
//           role="tab"
//           aria-selected={activeTab === 'redeem'}
//           style={activeTab === 'redeem' ? { ...buttonBase, ...activeButton } : buttonBase}
//           onClick={() => setActiveTab('redeem')}
//         >
//           Đổi quà
//         </button>
//         <button
//           role="tab"
//           aria-selected={activeTab === 'crud'}
//           style={activeTab === 'crud' ? { ...buttonBase, ...activeButton } : buttonBase}
//           onClick={() => setActiveTab('crud')}
//         >
//           Crud quà
//         </button>
//       </div>

//       <div
//         className="tab-panel"
//         style={{
//           paddingTop: `${16}px`, // offset content so it's not hidden under the fixed nav
//           paddingLeft: 16,
//           paddingRight: 16,
//         }}
//       >
//         {activeTab === 'pic' ? (
//           <LearnWithPic setActiveFoneground={setActiveFoneground}/>
//         ) : activeTab === 'video' ? (
//           <LearnWithVideo />
//         ) : activeTab === 'redeem' ? (
//           <Redeem />
//         ) : activeTab === 'crud' ? (
//           <CrudGift />
//         ) : null}
//       </div>

//     </>
//   ) 
// }

// export default App

// src/App.jsx
import React from 'react';
import { useEffect, useState } from 'react'
import { Routes, Route, redirect } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TopicSelectPage from './pages/TopicSelectPage';
import LearnPage from './pages/LearnPage';
import QuizPage from './pages/QuizPage';
import ReviewPage from './pages/ReviewPage';
import ResultPage from './pages/ResultPage';

// IMPORT CÁC TRANG MỚI CỦA MODULE 2
import ScenarioSelectPage from './pages/ScenarioSelectPage';
import PrepKitPage from './pages/PrepKitPage';
import PracticePage from './pages/PracticePage';
import PracticeCompletePage from './pages/PracticeCompletePage'; // Trang hoàn thành

import BackgroundEffect from './components/BackgroundEffect.jsx'
import LearnWithPic from './components/LearnWithPic.jsx'
import LearnWithVideo from './components/LearnWithVideo.jsx'
import Redeem from './components/redeem.jsx'
import CrudGift from '../../../frontend-2/crud_gift.jsx'

function App() {
  const [activeTab, setActiveTab] = useState('pic')
  const [activeForeground, setActiveFoneground] = useState(false)

  const currentPath = window.location.pathname;
  
  const navStyle = {
    // position: 'fixed',
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
  };

  const activeButton = {
    background: '#0ea5a4',
    color: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
  };

  // height of the fixed nav (used to offset content)
  const navHeight = 54;

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
  }, [activeForeground])


  return (
    <>
      {/* =========================== */}
        { currentPath === '/scroll' ?
          (<>
            <BackgroundEffect />
          {/* {activeForeground ? <ForegroundEffect /> : null} */}

          <div role="tablist" aria-label="Main navigation" style={navStyle}>
            {/* Logo */}
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); setActiveTab('pic'); }}
              aria-label="TikLearn Home"
              style={{ display: 'flex', alignItems: 'center', marginRight: 8, textDecoration: 'none' }}
            >
              <img
                src="./tiklearn-logo.png"
                alt="TikLearn"
                style={{ height: 40, width: 'auto', display: 'block', marginRight: 8 , borderRadius: 8}}
              />
              <span style={{ fontWeight: 700, color: '#0f172a', fontSize: 20 }}>TikLearn</span>
            </a>

            <button
              role="tab"
              aria-selected={activeTab === 'pic'}
              style={activeTab === 'pic' ? { ...buttonBase, ...activeButton } : buttonBase}
              onClick={() => setActiveTab('pic')}
            >
              Scroll
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'video'}
              style={activeTab === 'video' ? { ...buttonBase, ...activeButton } : buttonBase}
              onClick={() => window.location.href = '/home'}
            >
              Home
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'redeem'}
              style={activeTab === 'redeem' ? { ...buttonBase, ...activeButton } : buttonBase}
              onClick={() => setActiveTab('redeem')}
            >
              Đổi quà
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'crud'}
              style={activeTab === 'crud' ? { ...buttonBase, ...activeButton } : buttonBase}
              onClick={() => setActiveTab('crud')}
            >
              Crud quà
            </button>
          </div>

          <div
            className="tab-panel"
            style={{
              paddingTop: `${16}px`,  // offset content so it's not hidden under the fixed nav
              paddingLeft: 16,
              paddingRight: 16,
            }}
          >
            {activeTab === 'pic' ? (
              <LearnWithPic setActiveFoneground={setActiveFoneground}/>
            ) : activeTab === 'video' ? (
              <LearnWithVideo />
            ) : activeTab === 'redeem' ? (
              <Redeem />
            ) : activeTab === 'crud' ? (
              <CrudGift />
            ) : null}
          </div>

          </>) : null
        }
      {/* =========================== */}
      <Routes>
        {/* Trang chủ */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />

        {/* Module 1 Routes */}
        <Route path="/topics" element={<TopicSelectPage />} />
        <Route path="/learn/:topicId" element={<LearnPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/result" element={<ResultPage />} />

        {/* Module 2 Routes (MỚI) */}
        <Route path="/scenarios" element={<ScenarioSelectPage />} />
        <Route path="/prep-kit/:scenarioId" element={<PrepKitPage />} />
        <Route path="/practice/:scenarioId" element={<PracticePage />} />
        <Route path="/practice/complete" element={<PracticeCompletePage />} />

      </Routes>
    </>
  );
}

export default App;
