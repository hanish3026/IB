import React, { useState } from 'react'
import CardOverview from '../components/CardOverveiw'
import RequestCard from '../components/RequestCard'
import ReportCard from '../components/ReportCard'
import { useTranslation } from 'react-i18next';
const Card = () => {
  const { t } = useTranslation('card');
  const [selectedModule, setSelectedModule] = useState('');

  const renderSelectedModule = () => {
    switch (selectedModule) {
      case '':
        return <CardOverview/>;
      case 'request':
        return <RequestCard />;
      case 'report':
        return <ReportCard />;
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2 className="section-title">
            {selectedModule ? (
              <div className="d-flex align-items-center">
                <button 
                  className="btn btn-link text-decoration-none"
                  onClick={() => setSelectedModule('')}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                {t('cardServices')}
              </div>
            ) : (
              t('cardServices')
            )}
          </h2>
        </div>
      </div>
      {renderSelectedModule()}
    </div>
  );
};

export default Card