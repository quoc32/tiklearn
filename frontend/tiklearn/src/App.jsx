import { useState } from 'react'
import './App.css'
import LearnWithPic from './components/LearnWithPic.jsx'
import LearnWithVideo from './components/LearnWithVideo.jsx'

function App() {
  const [activeTab, setActiveTab] = useState('pic')

  return (
    <div>
      <div role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === 'pic'}
          className={`${activeTab === 'pic' ? 'active' : ''}`}
          onClick={() => setActiveTab('pic')}
        >
          Ảnh
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'video'}
          className={`${activeTab === 'video' ? 'active' : ''}`}
          onClick={() => setActiveTab('video')}
        >
          Video
        </button>
      </div>

      <div className="tab-panel">
        {activeTab === 'pic' ? <LearnWithPic /> : <LearnWithVideo />}
      </div>
    </div>
  )
}

export default App
