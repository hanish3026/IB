import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "../css/Navbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faChartPie, 
  faUser, 
  faExchangeAlt, 
  faWallet, 
  faHandHoldingUsd, 
  faCreditCard, 
  faCogs, 
  faFileSignature,
  faB,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const { t } = useTranslation('navbar');
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectorStyle, setSelectorStyle] = useState({});
  const navRef = useRef(null);

  // Navigation items with corresponding icons
  const navItems = [
    { name: "Dashboard", icon: faChartPie, translationKey: "dashboard" },
    { name: "Account", icon: faUser, translationKey: "account" },
    // { name: "Wallet", icon: faWallet, translationKey: "wallet" },
    { name: "Loan", icon: faHandHoldingUsd, translationKey: "loan" },
    { name: "Cards", icon: faCreditCard, translationKey: "cards" },
    { name: "Transfer", icon: faExchangeAlt, translationKey: "transfer" },
    { name: "Apply", icon: faFileSignature, translationKey: "apply" },
    { name: "Services", icon: faCogs, translationKey: "services" },
    { name: "Billpay", icon: faB, translationKey: "billpay"},
  ];

  useEffect(() => {
    const currentPath = location.pathname.substring(1) || "dashboard";
    const formattedTab = currentPath.charAt(0).toUpperCase() + currentPath.slice(1);
    setActiveTab(formattedTab);
    
    // Update selector position after a short delay to ensure DOM is ready
    setTimeout(updateSelectorPosition, 50);
    
    // Add resize listener for responsive selector
    window.addEventListener('resize', updateSelectorPosition);
    return () => window.removeEventListener('resize', updateSelectorPosition);
  }, [location]);

  const updateSelectorPosition = () => {
    const activeElement = document.querySelector(`.${styles.active}`);
    if (activeElement) {
      setSelectorStyle({
        left: `${activeElement.offsetLeft}px`,
        width: `${activeElement.offsetWidth}px`,
      });
    }
  };

  const handleNavigation = (tabName) => {
    setActiveTab(tabName);
    navigate(`/${tabName.toLowerCase()}`);
  };

  return (
    <div className={styles.navContainer}>
      <nav className={styles.navbar} ref={navRef}>
        {/* <div className={styles.logoSection}>
          <div className={styles.logo}>BankApp</div>
        </div> */}
        <ul className={styles.navList}>
          <div className={styles.selector} style={selectorStyle}></div>
          {navItems.map((item) => (
            <li
              key={item.name}
              className={`${styles.navItem} ${activeTab === item.name ? styles.active : ""}`}
              onClick={() => handleNavigation(item.name)}
            >
              <FontAwesomeIcon icon={item.icon} className={styles.navIcon} />
              <span className={styles.navText}>{t(item.translationKey)}</span>
            </li>
          ))}
        </ul>
          {/* <div className={styles.profileSection}>
            <div className={styles.profileIcon}>
              <FontAwesomeIcon icon={faUserCircle} />
            </div>
          </div> */}
      </nav>
    </div>
  );
};

export default Navbar;