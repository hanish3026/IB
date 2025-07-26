import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import header from './locales/en/header.json';
import common from './locales/en/common.json';
import navbar from './locales/en/navbar.json';
import arHeader from './locales/ar/header.json';
import arCommon from './locales/ar/common.json';
import arNavbar from './locales/ar/navbar.json';
import dashboard from './locales/en/dashboard.json';
import arDashboard from './locales/ar/dashboard.json';
import account from './locales/en/account.json';
import arAccount from './locales/ar/account.json';
import transactiontable from './locales/en/transactiontable.json';
import arTransactiontable from './locales/ar/transactiontable.json';
import loan from './locales/en/loan.json';
import arLoan from './locales/ar/loan.json';
import transfer from './locales/en/Tranfer.json';
import arTransfer from './locales/ar/Tranfer.json';
import card from './locales/en/card.json';
import arCard from './locales/ar/card.json';
import apply from './locales/en/apply.json';
import arApply from './locales/ar/apply.json';
import service from './locales/en/service.json';
import arService from './locales/ar/service.json';
import billpay from './locales/en/billpay.json';
import arBillpay from './locales/ar/billpay.json';
// Translation resources
const resources = {
  en: {
    header,
    common,
    navbar,
    dashboard,
    account,  
    transactiontable,
    loan,
    transfer,
    card,
    apply,
    service,
    billpay,
  },
    ar: {
    header: arHeader,
    common: arCommon,
    navbar: arNavbar,
    dashboard: arDashboard,
    account: arAccount,
    transactiontable: arTransactiontable,
    loan: arLoan,
    transfer: arTransfer,
    card: arCard,
    apply: arApply,
    service: arService,
    billpay: arBillpay,
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: localStorage.getItem('language') || 'en',
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    interpolation: {
      escapeValue: false,
    },
    
    react: {
      useSuspense: false,
    },
  });

export default i18n; 