import { useState } from 'react'
import './App.css'
import LearnWithPic from './components/LearnWithPic.jsx'
import LearnWithVideo from './components/LearnWithVideo.jsx'
import Redeem from './components/redeem.jsx'
import CrudGift from '../../../frontend-2/crud_gift.jsx'

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
        <button
          role="tab"
          aria-selected={activeTab === 'redeem'}
          className={`${activeTab === 'redeem' ? 'active' : ''}`}
          onClick={() => setActiveTab('redeem')}
        >
          Đổi quà
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'crud'}
          className={`${activeTab === 'crud' ? 'active' : ''}`}
          onClick={() => setActiveTab('crud')}
        >
          Crud quà
        </button>
      </div>

      <div className="tab-panel">
        {activeTab === 'pic' ? (
          <LearnWithPic />
        ) : activeTab === 'video' ? (
          <LearnWithVideo />
        ) : activeTab === 'redeem' ? (
          <Redeem />
        ) : activeTab === 'crud' ? (
          <CrudGift />
        ) : null}
      </div>
    </div>
  )
}

export default App
