import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHandshake,
    faShieldAlt,
    faChartLine,
    faUsers,
    faMoneyCheckAlt,
    faMobileAlt,
    faCreditCard,
    faPiggyBank,
    faArrowRight
} from "@fortawesome/free-solid-svg-icons";
import "../css/OurServices.css"; // Import CSS

const services = [
    { id: 1, title: "Customer Support", icon: faHandshake, description: "24/7 dedicated support for all banking needs.", details: "We offer 24/7 customer support via phone, chat, and email to ensure all your banking concerns are addressed immediately.", ctaLink: "/support" },
    { id: 2, title: "Secure Banking", icon: faShieldAlt, description: "Advanced security to keep your money safe.", details: "Our banking platform is equipped with AI-driven fraud detection and two-factor authentication to keep your funds safe.", ctaLink: "/security" },
    { id: 3, title: "Investment Plans", icon: faChartLine, description: "Smart investment options for your future.", details: "Grow your wealth with personalized investment plans tailored to your risk appetite and financial goals.", ctaLink: "/investments" },
    { id: 4, title: "Business Loans", icon: faMoneyCheckAlt, description: "Flexible loans for small and large businesses.", details: "We provide customized loan solutions with low interest rates to help businesses thrive and expand.", ctaLink: "/business-loans" },
    { id: 5, title: "Mobile Banking", icon: faMobileAlt, description: "Bank anytime, anywhere with our mobile app.", details: "Our feature-rich mobile app lets you manage transactions, pay bills, and track expenses on the go.", ctaLink: "/mobile-banking" },
    { id: 6, title: "Community Support", icon: faUsers, description: "Empowering local communities with financial aid.", details: "We support financial literacy programs and provide funding for community-driven projects.", ctaLink: "/community" },
    { id: 7, title: "Credit Cards", icon: faCreditCard, description: "Exclusive credit card benefits and rewards.", details: "Enjoy premium benefits, cashback offers, and reward points with our wide range of credit card options tailored for your lifestyle.", ctaLink: "/credit-cards" },
    { id: 8, title: "Wealth Management", icon: faPiggyBank, description: "Expert financial guidance for wealth growth.", details: "Get personalized wealth management strategies and expert investment advice to maximize your financial potential.", ctaLink: "/wealth-management" }
];
// Update class names in the component
const OurServices = () => {
    const [flippedCards, setFlippedCards] = useState({});
    const [visibleServices, setVisibleServices] = useState([]);
    const [activeFilter, setActiveFilter] = useState("all");
    
    // Categories for filtering
    const categories = [
        { id: "all", name: "All Services" },
        { id: "personal", name: "Personal Banking", serviceIds: [1, 2, 5, 7] },
        { id: "business", name: "Business Solutions", serviceIds: [3, 4, 8] },
        { id: "community", name: "Community", serviceIds: [6] }
    ];

    // Effect to filter services based on active category
    useEffect(() => {
        if (activeFilter === "all") {
            setVisibleServices(services);
        } else {
            const category = categories.find(cat => cat.id === activeFilter);
            if (category && category.serviceIds) {
                const filtered = services.filter(service => 
                    category.serviceIds.includes(service.id)
                );
                setVisibleServices(filtered);
            }
        }
    }, [activeFilter]);

    const handleFlip = (id, e) => {
        // Prevent flip when clicking on the CTA button
        if (e.target.tagName.toLowerCase() === 'a' || 
            e.target.tagName.toLowerCase() === 'button' ||
            e.target.closest('a') || 
            e.target.closest('button')) {
            return;
        }
        
        setFlippedCards((prev) => ({
            ...prev,
            [id]: !prev[id], // Toggle flip state
        }));
    };

    const handleFilterChange = (categoryId) => {
        setActiveFilter(categoryId);
        // Reset all flipped cards when changing filter
        setFlippedCards({});
    };

    return (
        <section className="landingpageService-wrapper">
            <div className="landingpageService-header">
                <h6 className="landingpageService-subheading">FEATURED SOLUTIONS</h6>
                <h2 className="landingpageService-title">
                    Banking Solutions Tailored to You
                </h2>
                <p className="landingpageService-description">
                    Discover a world of banking solutions perfectly crafted to suit your unique needs. 
                    Personalized financial services designed just for you.
                </p>
                
                <div className="landingpageService-filter">
                    {categories.map((category) => (
                        <button 
                            key={category.id}
                            className={`landingpageService-filter-btn ${activeFilter === category.id ? 'active' : ''}`}
                            onClick={() => handleFilterChange(category.id)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="landingpageService-container">
                <div className="landingpageService-section">
                    {visibleServices.map((service) => (
                        <div
                            key={service.id}
                            className={`landingpageService-card ${flippedCards[service.id] ? "flipped" : ""}`}
                            onClick={(e) => handleFlip(service.id, e)}
                        >
                            <div className="landingpageService-front">
                                <div className="landingpageService-icon">
                                    <FontAwesomeIcon icon={service.icon} className="landingpageService-icon-style" />
                                </div>
                                <h3 className="landingpageService-title">{service.title}</h3>
                                <p className="landingpageService-description">{service.description}</p>
                                <span className="landingpageService-flip-hint">Click to learn more</span>
                            </div>

                            <div className="landingpageService-back">
                                <h3 className="landingpageService-title">{service.title}</h3>
                                <p className="landingpageService-details">{service.details}</p>
                                <a href={service.ctaLink} className="landingpageService-cta">
                                    Learn More
                                    <FontAwesomeIcon icon={faArrowRight} className="landingpageService-cta-icon" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OurServices;