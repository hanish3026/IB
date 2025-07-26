import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBell, 
  faPowerOff, 
  faCircleChevronDown, 
  faBars,
  faSearch,
  faHome,
  faCreditCard,
  faMoneyBillWave,
  faExchangeAlt,
  faUserCircle,
  faHeadset,
  faChevronDown,
  faTimes,
  faFileAlt,
  faCogs,
  faSignOutAlt,
  faGlobe,
  faHandHoldingUsd,
  faClipboardCheck
} from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/Header.css";
import Assets from "../../Asset/Assets";
import Navbar from "./NavBar";
import AOS from "aos";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export const showNotifications = () => {
    console.log("Notification function triggered!");
    toast.info("Your last transaction was successful.", { autoClose: false, onClick: () => {
        console.log("Notification clicked!");
    } });
    toast.info("TZS 5,000 has been credited to your account", { autoClose: false, onClick: () => {
        console.log("Notification clicked!");
    } });
    toast.success("Card payment processed successfully", { autoClose: false, onClick: () => {
        console.log("Notification clicked!");
    } });
};
const Header = () => {
    const nav = useNavigate();
    const { t, i18n } = useTranslation(['header', 'common']);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
    const searchDropdownRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [notificationCount, setNotificationCount] = useState(3); // Default notification count
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
    const languageDropdownRef = useRef(null);
    
    // Language options
    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'ar', name: 'العربية', flag: '🇸🇦' }
    ];

    // Change language function
    const changeLanguage = (languageCode) => {
        i18n.changeLanguage(languageCode);
        localStorage.setItem('language', languageCode);
        setLanguageDropdownOpen(false);
        document.documentElement.lang = languageCode;
    };

    // Logout function to clear session and reset language
    const handleLogout = () => {
        // Clear all session data
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('paymentToken');
        sessionStorage.removeItem('requestToken');
        sessionStorage.removeItem('tokenExpiry');
        
        // Clear any other banking session data
        Object.keys(sessionStorage).forEach(key => {
            if (key.includes('token') || key.includes('session') || key.includes('auth')) {
                sessionStorage.removeItem(key);
            }
        });
        
        // Reset language to English
        i18n.changeLanguage('en');
        localStorage.setItem('language', 'en');
        document.documentElement.lang = 'en';
        
        // Close any open dropdowns
        setDropdownOpen(false);
        setMobileMenuOpen(false);
        setLanguageDropdownOpen(false);
        
        // Navigate to login
        nav('/login');
    };

    // Search categories and results
    const searchCategories = {
        "Banking Services": [
            { title: "Open New Account", path: "/apply" },
            { title: "Fixed Deposits", path: "/apply" },
            { title: "Recurring Deposits", path: "/apply" },
            { title: "Loan Application", path: "/apply" },
            { title: "Account Overview", path: "/account" },
            { title: "Dashboard", path: "/dashboard" }
        ],
        "Cards": [
            { title: "Credit Cards", path: "/cards" },
            { title: "Debit Cards", path: "/cards" },
            { title: "Block Card", path: "/cards" },
            { title: "Apply for New Card", path: "/apply" },
            { title: "Card Overview", path: "/cards" }
        ],
        "Payments & Transfers": [
            { title: "Fund Transfer", path: "/transfer" },
            { title: "Bill Payments", path: "/billpay" },
            { title: "Recharge", path: "/billpay" },
            { title: "Money Transfer", path: "/transfer" },
            { title: "UPI Transfer", path: "/transfer" },
            { title: "NEFT Transfer", path: "/transfer" }
        ],
        "Support & Services": [
            { title: "Customer Support", path: "/services" },
            { title: "Service & Support", path: "/services" },
            { title: "Report Issue", path: "/services" },
            { title: "FAQs", path: "/services" },
            { title: "Locate Branch", path: "/services" },
            { title: "Change Password", path: "/services" }
        ],
        "Profile & Settings": [
            { title: "My Profile", path: "/profile" },
            { title: "Profile Settings", path: "/profile" },
            { title: "Account Settings", path: "/profile" },
            { title: "Security Settings", path: "/profile" }
        ]
    };
    
    // Filter search results based on search query
    const getFilteredResults = () => {
        if (!searchQuery.trim() || searchQuery.length < 2) return [];
        
        const results = [];
        const query = searchQuery.toLowerCase().trim();
        
        Object.entries(searchCategories).forEach(([category, items]) => {
            const filteredItems = items.filter(item => 
                item.title.toLowerCase().includes(query) ||
                category.toLowerCase().includes(query)
            );
            
            if (filteredItems.length > 0) {
                results.push({
                    category,
                    items: filteredItems
                });
            }
        });
        
        return results;
        console.log(results);
    };

    // Handle search item selection
    const handleSearchItemClick = (item) => {
        console.log("🚀 handleSearchItemClick triggered");
        console.log("📄 Item:", item);
        console.log("🔗 Path:", item.path);
        
        // Clear search state immediately
        setSearchDropdownOpen(false);
        setSearchQuery('');
        console.log("✅ Search state cleared");
        
        // Navigate with a small delay to ensure state is updated
        setTimeout(() => {
            console.log("🚀 Navigating to:", item.path);
            nav(item.path);
        }, 50);
    };

    // Handle search input changes
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        setSearchDropdownOpen(value.length >= 2);
    };

    // Handle search input focus
    const handleSearchFocus = () => {
        if (searchQuery.length >= 2) {
            setSearchDropdownOpen(true);
        }
    };

    useEffect(() => {
        // showNotifications()
        AOS.init({ duration: 1500, delay: 100 });
        
        // Set initial document language
        document.documentElement.lang = i18n.language;
        
        const handleClickOutside = (event) => {
            // Handle profile dropdown
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
            
            // Handle search dropdown
            if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
                setSearchDropdownOpen(false);
            }
            
            // Handle language dropdown
            if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
                setLanguageDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [i18n.language]);

    const handleProfileClick = () => {
        setDropdownOpen(!dropdownOpen);
        console.log("🔒 Profile dropdown state:", dropdownOpen);
    };

    return (
        <>
            <header className="header-container">
                {/* Desktop Layout */}
                <div className="desktop-header">
                    <div className="logo d-flex justify-content-center align-items-center">
                        <h1 className="header-Title">{t('header:title')}</h1>
                    </div>
                    <div className="search-bar" ref={searchDropdownRef}>
                        <div className="search-container">
                            <div className="search-input-wrapper">
                                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                                <input 
                                    className="form-control headerSearch" 
                                    placeholder={t('header:search')}
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onFocus={handleSearchFocus}
                                    onBlur={() => {
                                        // Delay closing to allow click on dropdown items
                                        setTimeout(() => setSearchDropdownOpen(false), 250);
                                    }}
                                />
                            </div>
                            
                            {searchDropdownOpen && (
                                <div className="search-results-dropdown">
                                    {getFilteredResults().length > 0 ? (
                                        getFilteredResults().map((categoryGroup, index) => (
                                            <div key={index} className="search-category">
                                                <h6 className="category-title">{categoryGroup.category}</h6>
                                                <ul className="search-results-list">
                                                    {categoryGroup.items.map((item, idx) => (
                                                        <li 
                                                            key={idx} 
                                                            onMouseDown={(e) => {
                                                                e.preventDefault();
                                                                console.log("🖱️ Desktop search item clicked:", item.title);
                                                                handleSearchItemClick(item);
                                                            }}
                                                        >
                                                            {item.title}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-results">{t('header:noResults')}</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="actions">
                        {/* Language Dropdown */}
                        <div className="language-container" ref={languageDropdownRef}>
                            <div 
                                className="language-trigger"
                                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                            >
                                <FontAwesomeIcon icon={faGlobe} className="language-icon" />
                                <span className="language-text">{t('header:language')}</span>
                                <FontAwesomeIcon 
                                    icon={faChevronDown} 
                                    className={`language-arrow ${languageDropdownOpen ? 'active' : ''}`}
                                />
                            </div>
                            <div className={`language-dropdown ${languageDropdownOpen ? "show" : ""}`}>
                                {languages.map((lang) => (
                                    <div
                                        key={lang.code}
                                        className={`language-option ${i18n.language === lang.code ? 'active' : ''}`}
                                        onClick={() => changeLanguage(lang.code)}
                                    >
                                        <span className="language-flag">{lang.flag}</span>
                                        <span className="language-name">{lang.name}</span>
                                        {i18n.language === lang.code && (
                                            <i className="fas fa-check language-check"></i>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <span className="divider header-Title">|</span>
                        <h3 className="header-Title mt-2" onClick={()=>{nav("/services")}} style={{cursor:"pointer"}}>{t('header:serviceSupport')}</h3>
                        <span className="divider header-Title">|</span>
                        <div className="notification-container">
                            <FontAwesomeIcon
                                icon={faBell}
                                className="icon header-Title"
                                onClick={() => {
                                    showNotifications();
                                    setNotificationCount(0); // Clear count when notifications are viewed
                                }}
                            />
                            {notificationCount > 0 && (
                                <span className="header-notification-badge">
                                    {notificationCount > 99 ? '99+' : notificationCount}
                                </span>
                            )}
                        </div>

                        <div
                            className="profile-container"
                            // ref={dropdownRef}
                            onClick={handleProfileClick}
                        >
                            <div className="profile-trigger">
                                <img
                                    src={Assets.profile}
                                    className="circle-img"
                                    alt="ProfileImage"
                                />
                                {/* <FontAwesomeIcon 
                                    icon={faCircleChevronDown}
                                    className={`dropdown-arrow ${dropdownOpen ? 'active' : ''}`}
                                /> */}
                            </div>
                            <div className={`profile-dropdown ${dropdownOpen ? "show" : ""}`}>
                                <div className="profile-header">
                                    <img src={Assets.profile} className="profile-avatar" alt="Profile" />
                                    <div className="profile-info">
                                        <span className="profile-name">Hanish</span>
                                        <span className="profile-email">hanish@123.com</span>
                                    </div>
                                </div>
                                <div className="profile-divider"></div>
                                <div className="profile-menu">
                                    <button className="profile-menu-item" onClick={() => {nav("/profile");setDropdownOpen(false)}}>
                                        <i className="fas fa-user"></i>
                                        {t('header:profile')}
                                    </button>
                                    <button className="profile-menu-item" onClick={handleLogout}>
                                        <i className="fas fa-sign-out-alt"></i>
                                        {t('header:logout')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Layout */}
                <div className="mobile-header">
                    <div className="mobile-header-top">
                        <div className="mobile-hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            <FontAwesomeIcon icon={faBars} className="hamburger-icon" />
                        </div>
                        
                        <div className="mobile-search-container" ref={searchDropdownRef}>
                            <div className="search-input-wrapper">
                                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                                <input 
                                    className="form-control mobile-search" 
                                    placeholder={t('header:search')}
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onFocus={handleSearchFocus}
                                    onBlur={() => {
                                        // Delay closing to allow click on dropdown items
                                        setTimeout(() => setSearchDropdownOpen(false), 200);
                                    }}
                                />
                            </div>
                            
                            {searchDropdownOpen && (
                                <div className="search-results-dropdown">
                                    {getFilteredResults().length > 0 ? (
                                        getFilteredResults().map((categoryGroup, index) => (
                                            <div key={index} className="search-category">
                                                <h6 className="category-title">{categoryGroup.category}</h6>
                                                <ul className="search-results-list">
                                                    {categoryGroup.items.map((item, idx) => (
                                                        <li 
                                                            key={idx} 
                                                            onMouseDown={(e) => {
                                                                e.preventDefault();
                                                                console.log("🖱️ Mobile search item clicked:", item.title);
                                                                handleSearchItemClick(item);
                                                            }}
                                                        >
                                                            {item.title}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-results">{t('header:noResults')}</div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="mobile-actions">
                            <div className="notification-container">
                                <FontAwesomeIcon
                                    icon={faBell}
                                    className="icon mobile-icon"
                                    onClick={() => {
                                        showNotifications();
                                        setNotificationCount(0);
                                    }}
                                />
                                {notificationCount > 0 && (
                                    <span className="header-notification-badge">
                                        {notificationCount > 99 ? '99+' : notificationCount}
                                    </span>
                                )}
                            </div>

                            <div
                                className="profile-container mobile-profile"
                                ref={dropdownRef}
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <div className="profile-trigger">
                                    <img
                                        src={Assets.AD4}
                                        className="circle-img mobile-profile-img"
                                        alt="ProfileImage"
                                    />
                                </div>
                                <div className={`profile-dropdown ${dropdownOpen ? "show" : ""}`}>
                                    <div className="profile-header">
                                        <img src={Assets.AD4} className="profile-avatar" alt="Profile" />
                                        <div className="profile-info">
                                            <span className="profile-name">Hanish</span>
                                            <span className="profile-email">hanish@123.com</span>
                                        </div>
                                    </div>
                                    <div className="profile-divider"></div>
                                    <div className="profile-menu">
                                        <button className="profile-menu-item" onClick={() => nav("/profile")}>
                                            <i className="fas fa-user"></i>
                                            {t('header:profile')}
                                        </button>
                                        <button className="profile-menu-item" onClick={handleLogout}>
                                            <i className="fas fa-sign-out-alt"></i>
                                            {t('header:logout')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Overlay */}
                    <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'show' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                        <div className={`mobile-menu-sidebar ${mobileMenuOpen ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
                            {/* Menu Header */}
                            <div className="mobile-menu-header">
                                <div className="menu-profile-section">
                                    <img src={Assets.profile} className="menu-profile-avatar" alt="Profile" />
                                    <div className="menu-profile-info">
                                        <span className="menu-profile-name">Hanish</span>
                                        <span className="menu-profile-email">hanish@123.com</span>
                                    </div>
                                </div>
                                <button className="menu-close-btn" onClick={() => setMobileMenuOpen(false)}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>

                            {/* Menu Items */}
                            <div className="mobile-menu-content">
                                <div className="menu-section">
                                    <div className="menu-section-title">{t('header:mainNavigation')}</div>
                                    
                                    <div className="mobile-menu-item" onClick={() => {nav("/dashboard"); setMobileMenuOpen(false);}}>
                                        <div className="menu-item-icon">
                                            <FontAwesomeIcon icon={faHome} />
                                        </div>
                                        <div className="menu-item-content">
                                            <span className="menu-item-title">{t('header:dashboard')}</span>
                                            <span className="menu-item-subtitle">{t('header:overview')}</span>
                                        </div>
                                        <FontAwesomeIcon icon={faChevronDown} className="menu-item-arrow" />
                                    </div>

                                    <div className="mobile-menu-item" onClick={() => {nav("/account"); setMobileMenuOpen(false);}}>
                                        <div className="menu-item-icon">
                                            <FontAwesomeIcon icon={faMoneyBillWave} />
                                        </div>
                                        <div className="menu-item-content">
                                            <span className="menu-item-title">{t('header:accounts')}</span>
                                            <span className="menu-item-subtitle">{t('header:viewManage')}</span>
                                        </div>
                                        <FontAwesomeIcon icon={faChevronDown} className="menu-item-arrow" />
                                    </div>

                                    <div className="mobile-menu-item" onClick={() => {nav("/cards"); setMobileMenuOpen(false);}}>
                                        <div className="menu-item-icon">
                                            <FontAwesomeIcon icon={faCreditCard} />
                                        </div>
                                        <div className="menu-item-content">
                                            <span className="menu-item-title">{t('header:cards')}</span>
                                            <span className="menu-item-subtitle">{t('header:creditDebit')}</span>
                                        </div>
                                        <FontAwesomeIcon icon={faChevronDown} className="menu-item-arrow" />
                                    </div>

                                    <div className="mobile-menu-item" onClick={() => {nav("/transfer"); setMobileMenuOpen(false);}}>
                                        <div className="menu-item-icon">
                                            <FontAwesomeIcon icon={faExchangeAlt} />
                                        </div>
                                        <div className="menu-item-content">
                                            <span className="menu-item-title">{t('header:transfers')}</span>
                                            <span className="menu-item-subtitle">{t('header:sendReceive')}</span>
                                        </div>
                                        <FontAwesomeIcon icon={faChevronDown} className="menu-item-arrow" />
                                    </div>

                                    <div className="mobile-menu-item" onClick={() => {nav("/billpay"); setMobileMenuOpen(false);}}>
                                        <div className="menu-item-icon">
                                            <FontAwesomeIcon icon={faFileAlt} />
                                        </div>
                                        <div className="menu-item-content">
                                            <span className="menu-item-title">{t('header:billPayments')}</span>
                                            <span className="menu-item-subtitle">{t('header:payBills')}</span>
                                        </div>
                                        <FontAwesomeIcon icon={faChevronDown} className="menu-item-arrow" />
                                    </div>

                                    <div className="mobile-menu-item" onClick={() => {nav("/loan"); setMobileMenuOpen(false);}}>
                                        <div className="menu-item-icon">
                                            <FontAwesomeIcon icon={faHandHoldingUsd} />
                                        </div>
                                        <div className="menu-item-content">
                                            <span className="menu-item-title">{t('header:loans')}</span>
                                            <span className="menu-item-subtitle">{t('header:applyForLoans')}</span>
                                        </div>
                                        <FontAwesomeIcon icon={faChevronDown} className="menu-item-arrow" />
                                    </div>

                                    <div className="mobile-menu-item" onClick={() => {nav("/apply"); setMobileMenuOpen(false);}}>
                                        <div className="menu-item-icon">
                                            <FontAwesomeIcon icon={faClipboardCheck} />
                                        </div>
                                        <div className="menu-item-content">
                                            <span className="menu-item-title">{t('header:apply')}</span>
                                            <span className="menu-item-subtitle">{t('header:applyForServices')}</span>
                                        </div>
                                        <FontAwesomeIcon icon={faChevronDown} className="menu-item-arrow" />
                                    </div>
                                </div>

                                <div className="menu-section">
                                    <div className="menu-section-title">{t('header:supportServices')}</div>
                                    
                                    <div className="mobile-menu-item" onClick={() => {nav("/services"); setMobileMenuOpen(false);}}>
                                        <div className="menu-item-icon">
                                            <FontAwesomeIcon icon={faHeadset} />
                                        </div>
                                        <div className="menu-item-content">
                                            <span className="menu-item-title">{t('header:customerSupport')}</span>
                                            <span className="menu-item-subtitle">{t('header:helpAssistance')}</span>
                                        </div>
                                        <FontAwesomeIcon icon={faChevronDown} className="menu-item-arrow" />
                                    </div>

                                    <div className="mobile-menu-item" onClick={() => {nav("/profile"); setMobileMenuOpen(false);}}>
                                        <div className="menu-item-icon">
                                            <FontAwesomeIcon icon={faCogs} />
                                        </div>
                                        <div className="menu-item-content">
                                            <span className="menu-item-title">{t('header:settings')}</span>
                                            <span className="menu-item-subtitle">{t('header:profilePreferences')}</span>
                                        </div>
                                        <FontAwesomeIcon icon={faChevronDown} className="menu-item-arrow" />
                                    </div>
                                    
                                    {/* Language Selection in Mobile Menu */}
                                    <div className="mobile-language-section">
                                        <div className="mobile-language-title text-white">{t('header:language')}</div>
                                        <div className="mobile-language-options">
                                            {languages.map((lang) => (
                                                <div
                                                    key={lang.code}
                                                    className={`mobile-language-option ${i18n.language === lang.code ? 'active' : ''}`}
                                                    onClick={() => changeLanguage(lang.code)}
                                                >
                                                    <span className="language-flag text-white">{lang.flag}</span>
                                                    <span className="language-name text-white">{lang.name}</span>
                                                    {i18n.language === lang.code && (
                                                        <i className="fas fa-check language-check"></i>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Menu Footer */}
                            <div className="mobile-menu-footer">
                                <div className="menu-footer-item" onClick={handleLogout}>
                                    <FontAwesomeIcon icon={faSignOutAlt} className="menu-footer-icon" />
                                    <span>{t('header:logout')}</span>
                                </div>
                                <div className="menu-app-version">
                                    <span>{t('header:appVersion')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            {/* <div class="nav-shutter-container">
                <div className="nav-arrow-wrapper">
                    <FontAwesomeIcon icon={faCircleChevronDown} className="nav-arrow" />
                </div>
                <div class="nav-shutter">
                </div>
            </div> */}
            {/* <div data-aos="">
                <nav className="main-navigation">
                    <div className="nav-links">
                        <a href="/dashboard" className="nav-link">
                            <FontAwesomeIcon icon={faHome} className="nav-icon" />
                            <span>Home</span>
                        </a>
                        <a href="/accounts" className="nav-link">
                            <FontAwesomeIcon icon={faMoneyBillWave} className="nav-icon" />
                            <span>Accounts</span>
                        </a>
                        <a href="/cards" className="nav-link">
                            <FontAwesomeIcon icon={faCreditCard} className="nav-icon" />
                            <span>Cards</span>
                        </a>
                        <a href="/payments" className="nav-link">
                            <FontAwesomeIcon icon={faExchangeAlt} className="nav-icon" />
                            <span>Payments</span>
                        </a>
                        <a href="/services" className="nav-link">
                            <FontAwesomeIcon icon={faHeadset} className="nav-icon" />
                            <span>Services</span>
                        </a>
                        <a href="/profile" className="nav-link">
                            <FontAwesomeIcon icon={faUserCircle} className="nav-icon" />
                            <span>Profile</span>
                        </a>
                    </div>
                </nav>
            </div> */}
<Navbar/>
            {/* ToastContainer should be included */}
            <ToastContainer />
        </>
    );
};

export default Header;
