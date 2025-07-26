import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft } from 'react-icons/fa';
import { getProvidersByCategory } from '../data/billPayData';

const BillPayCategory = ({ category, onSelectProvider, onBack }) => {
  const { t } = useTranslation('billpay');
  const providers = getProvidersByCategory(category.id);

  return (
    <div className="billpay-category">
      <div className="category-header">
        <button className="back-button" onClick={onBack}>
          <FaArrowLeft /> {t('form.back')}
        </button>
        <h2>{category.name} {t('providers.selectProvider')}</h2>
      </div>

      <div className="providers-grid">
        {providers.map((provider) => (
          <div 
            key={provider.id} 
            className="provider-card"
            onClick={() => onSelectProvider(provider)}
          >
            <div className="provider-logo">
              <img src={provider.logo} alt={provider.name} />
            </div>
            <div className="provider-info">
              <h3>{provider.name}</h3>
              {provider.popular && <span className="popular-badge">{t('popular')}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="category-description">
        <h3>{t('about')} {category.name} {t('payments')}</h3>
        <p>{category.longDescription || category.description}</p>
        
        <div className="payment-instructions">
          <h4>{t('howToPay')} {category.name.toLowerCase()} {t('bill')}</h4>
          <ol>
            <li>{t('instructions.step1')}</li>
            <li>{t('instructions.step2')}</li>
            <li>{t('instructions.step3')}</li>
            <li>{t('instructions.step4')}</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default BillPayCategory;