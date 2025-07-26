import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Layout.css";
import Header from "./Components/Component/Header";
import Footer from "./Components/Component/Footer";
import { ScaleLoader } from "react-spinners";
import AdSlider from "./Components/Component/AdSlider";

const Layout = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  
  // Pages that should not have header/footer
  const noHeaderPages = ["/", "/login", "/lock","/forgot-password","/reset-password","/self-registration"];

  useEffect(() => {
    if(location.pathname === "/dashboard"){
      setLoading(false);
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [location.pathname]);
  
  if (noHeaderPages.includes(location.pathname)) {
    return (
      <div className="layout-container">
        {children}
      </div>
    );
  }

  return (
    <div className="layout-container">
      <Header className="layout-header" />
      
      <div className="content-wrapper">
        <main className="layout-main">
          <div className="layout-content">
            {children}
          </div>
        </main>
        
        <div className="ad-slider-container mt-3">
          <AdSlider />
        </div>
      </div>

      <Footer className="layout-footer" />
      
      {loading && (
        <div className="layout-loader">
          <ScaleLoader color="#0056b3" />
        </div>
      )}
    </div>
  );
};

export default Layout;
