import Assets from "../../../Asset/Assets";
import i18n from '../../../i18n';

// Bill categories - using translation keys
export const getBillCategories = () => [
  {
    id: 'electricity',
    name: i18n.t('billpay:categories.electricity'),
    description: i18n.t('billpay:categories.electricityDesc'),
    color: '#FF9800',
    longDescription: i18n.t('billpay:categories.electricityLong')
  },
  {
    id: 'goverment',
    name: i18n.t('billpay:categories.goverment'),
    description: i18n.t('billpay:categories.govermentDesc'),
    color: '#2196F3',
    longDescription: i18n.t('billpay:categories.govermentLong')
  },
  {
    id: 'internet',
    name: i18n.t('billpay:categories.internet'),
    description: i18n.t('billpay:categories.internetDesc'),
    color: '#9C27B0',
    longDescription: i18n.t('billpay:categories.internetLong')
  },
  {
    id: 'mobile',
    name: i18n.t('billpay:categories.mobile'),
    description: i18n.t('billpay:categories.mobileDesc'),
    color: '#4CAF50',
    longDescription: i18n.t('billpay:categories.mobileLong')
  },
  {
    id: 'tv',
    name: i18n.t('billpay:categories.tv'),
    description: i18n.t('billpay:categories.tvDesc'),
    color: '#E91E63',
    longDescription: i18n.t('billpay:categories.tvLong')
  },
  {
    id: 'gas',
    name: i18n.t('billpay:categories.gas'),
    description: i18n.t('billpay:categories.gasDesc'),
    color: '#607D8B',
    longDescription: i18n.t('billpay:categories.gasLong')
  }
];

// Legacy export for backward compatibility
export const billCategories = getBillCategories();

// Bill providers - these are company names and logos, typically don't need translation
export const billProviders = [
  {
    id: 1,
    name: 'LUKU',
    categoryId: 'electricity',
    logo: Assets.luku,
    popular: true,
    accountLabel: i18n.t('billpay:form.meterNumber'),
    accountHint: i18n.t('billpay:form.enterMeterNumber')
  },
  {
    id: 2,
    name: 'GPG',
    categoryId: 'goverment',
    logo: Assets.gpg,
    popular: false,
    accountLabel: i18n.t('billpay:form.connectionNumber'),
    accountHint: i18n.t('billpay:form.enterConnectionNumber')
  },
  {
    id: 3,
    name: 'Zuku Fiber',
    categoryId: 'internet',
    logo: Assets.zuku,
    popular: true,
    accountLabel: i18n.t('billpay:form.accountNumber'),
    accountHint: i18n.t('billpay:form.enterAccountNumber')
  },
  {
    id: 4,
    name: 'TTCL',
    categoryId: 'mobile',
    logo: Assets.ttcl,
    popular: true,
    accountLabel: i18n.t('billpay:form.mobileNumber'),
    accountHint: i18n.t('billpay:form.enterMobileNumber')
  },
  {
    id: 5,
    name: 'T-PESA',
    categoryId: 'mobile',
    logo: Assets.tpesa,
    popular: true,
    accountLabel: i18n.t('billpay:form.mobileNumber'),
    accountHint: i18n.t('billpay:form.enterMobileNumber')
  },
  {
    id: 6,
    name: 'T-Halotel',
    categoryId: 'mobile', 
    logo: Assets.halotel,
    popular: true,
    accountLabel: i18n.t('billpay:form.mobileNumber'),
    accountHint: i18n.t('billpay:form.enterMobileNumber')
  },
  {
    id: 7,
    name: 'Vodacom',
    categoryId: 'mobile',
    logo: Assets.vodacom,
    popular: true,
    accountLabel: i18n.t('billpay:form.mobileNumber'),
    accountHint: i18n.t('billpay:form.enterMobileNumber')
  },
  {
    id: 8,
    name: 'Airtel',
    categoryId: 'mobile',
    logo: Assets.airtel,  
    popular: true,
    accountLabel: i18n.t('billpay:form.mobileNumber'),
    accountHint: i18n.t('billpay:form.enterMobileNumber')
  },
  {
    id: 9,
    name: 'Tigo',
    categoryId: 'mobile',
    logo: Assets.tigo,
    popular: false,
    accountLabel: i18n.t('billpay:form.mobileNumber'),
    accountHint: i18n.t('billpay:form.enterMobileNumber')
  },
  {
    id: 10,
    name: 'DSTV',
    categoryId: 'tv',
    logo: Assets.dstv,
    popular: true,
    accountLabel: i18n.t('billpay:form.subscriberId'),
    accountHint: i18n.t('billpay:form.enterSubscriberId')
  },
  {
    id: 11,
    name: 'Azam TV',
    categoryId: 'tv',
    logo: Assets.azam,
    popular: true,
    accountLabel: i18n.t('billpay:form.smartCardNumber'),
    accountHint: i18n.t('billpay:form.enterSmartCardNumber')
  },
  {
    id: 12,
    name: 'City Gas',
    categoryId: 'gas',
    logo: 'https://via.placeholder.com/150',
    popular: true,
    accountLabel: i18n.t('billpay:form.consumerNumber'),
    accountHint: i18n.t('billpay:form.enterConsumerNumber')
  }
];

// Recent payments - using translations for status
export const getRecentPayments = () => [
  {
    id: 1,
    categoryId: 'electricity',
    provider: 'State Electric',
    accountNumber: '12345678901',
    amount: 2500,
    date: '2024-03-10',
    status: 'success',
    statusText: i18n.t('billpay:paid')
  },
  {
    id: 2,
    categoryId: 'mobile',
    provider: 'Vodacom',
    accountNumber: '0712345678',
    amount: 500,
    date: '2024-03-08',
    status: 'success',
    statusText: i18n.t('billpay:paid')
  },
  {
    id: 3,
    categoryId: 'tv',
    provider: 'DSTV',
    accountNumber: 'DST123456',
    amount: 3000,
    date: '2024-03-05',
    status: 'success',
    statusText: i18n.t('billpay:paid')
  },
  {
    id: 4,
    categoryId: 'government',
    provider: 'Metro Water',
    accountNumber: 'MW987654',
    amount: 1200,
    date: '2024-03-01',
    status: 'failed',
    statusText: i18n.t('billpay:failed')
  }
];

// Legacy export for backward compatibility
export const recentPayments = getRecentPayments();

// Helper function to get providers by category
export const getProvidersByCategory = (categoryId) => {
  return billProviders.filter(provider => provider.categoryId === categoryId);
};

// Helper function to get category by ID
export const getCategoryById = (categoryId) => {
  return getBillCategories().find(category => category.id === categoryId);
};

// Helper function to get provider by ID
export const getProviderById = (providerId) => {
  return billProviders.find(provider => provider.id === providerId);
};

// Function to refresh data when language changes
export const refreshTranslatedData = () => {
  // This can be called when language changes to refresh translated content
  return {
    categories: getBillCategories(),
    recentPayments: getRecentPayments()
  };
};