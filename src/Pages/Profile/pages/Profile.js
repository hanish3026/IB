import React, { useState } from 'react';
import PersonalInfo from '../components/PersonalInfo';
import SecuritySettings from '../components/SecuritySettings';
import AccountPreferences from '../components/AccountPreferences';
import NotificationSettings from '../components/NotificationSettings';
import { FaUser, FaLock, FaCog, FaBell } from 'react-icons/fa';
import '../css/Profile.css';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('personal');

  const tabs = [
    { id: 'personal', label: 'Personal Information', icon: <FaUser /> },
    { id: 'security', label: 'Security Settings', icon: <FaLock /> },
    { id: 'preferences', label: 'Account Preferences', icon: <FaCog /> },
    // { id: 'notifications', label: 'Notification Settings', icon: <FaBell /> }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'personal': return <PersonalInfo />;
      case 'security': return <SecuritySettings />;
      case 'preferences': return <AccountPreferences />;
      case 'notifications': return <NotificationSettings />;
      default: return <PersonalInfo />;
    }
  };

  return (
    <div className="profile">
      <header className="profile__header">
        <h1 className="profile__title">Profile Settings</h1>
        <p className="profile__subtitle">Manage your personal information and account preferences</p>
      </header>
      
      <div className="profile__content">
        <aside className="profile__sidebar">
          <nav className="profile__nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`profile__nav-item ${activeTab === tab.id ? 'profile__nav-item--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                aria-selected={activeTab === tab.id}
                role="tab"
              >
                <span className="profile__nav-icon">{tab.icon}</span>
                <span className="profile__nav-label">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>
        
        <main className="profile__main" role="tabpanel">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Profile;