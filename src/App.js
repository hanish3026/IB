import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LandingPage from './Pages/LandingPages/page/LandingPage';
import Login from './Pages/Login/Login';
import ForgetPassword from './Pages/LandingPages/components/ForgetPassword';
import DashBoard from "./Pages/DashBoard/Pages/DashBoard"
import Layout from './Layout';
import Account from './Pages/Account/Pages/Account';
import Transfer from './Pages/Tranfer/pages/Transfer';
import Wallet from './Pages/Wallet/pages/Wallet';
import TransferMoney from './Pages/Wallet/components/TransferMoney';
import Loan from './Pages/Loan/Pages/Loan';
import PaymentCard from './Pages/Card/pages/Card';
import Service from './Pages/Services/pages/Service';
import Apply from './Pages/Apply/pages/Apply';
// import OverAllLogin from './Pages/Login/OverAllLogin';
import TransactionTable from './Pages/DashBoard/components/TransactionTable';
import "./App.css"
import BillPay from './Pages/BillPay/pages/BillPay';
import Profile from './Pages/Profile/pages/Profile';
import useScrollToTop from './hooks/useScrollToTop';
import AuthGuard from './Components/AuthGuard';
import PaymentPage from './Pages/Tranfer/pages/PaymentPage';
import SelfRegistration from './Pages/Login/SelfRegistration/SelfRegistration';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PaymentMenu from './Pages/ADMIN/PaymentMenu';
function AppContent() {
  const location = useLocation();   
  // useScrollToTop();
  const scrollToTop = useScrollToTop();
  useEffect(() => {
    scrollToTop();
  }, [location.pathname]);
  return (
    <Layout>
      <AuthGuard />
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/self-registration' element={<SelfRegistration/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/forgot-password' element={<ForgetPassword/>}/>
        <Route path='/dashboard' element={<DashBoard/>}/>
        <Route path='/account' element={<Account/>}/>
        <Route path='/transfer' element={<Transfer/>}/>
        {/* <Route path='/wallet' element={<Wallet/>}/> */}
        <Route path='/loan' element={<Loan/>}/>
        <Route path='/cards' element={<PaymentCard/>}/>
        <Route path='/services' element={<Service/>}/>
        <Route path='/apply' element={<Apply/>}/>
        <Route path='/transactions' element={<TransactionTable/>}/>
        <Route path='/billpay' element={<BillPay/>}/>
        <Route path='/wallet-transfer' element={<TransferMoney/>}/>
        <Route path='/profile' element={<Profile/>}/>    
        <Route path='/paymentmenu' element={<PaymentMenu/>}/>         
       <Route path='/transfer/payment/:beneficiaryId' element={<PaymentPage/>}/>
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <>
    <Router basename="/ib">
      <AppContent />
    </Router>

    </>
  );
}

export default App;
