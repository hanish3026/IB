import React, { useState, useEffect } from "react";
import { 
  FaMapMarkerAlt, 
  FaSearch, 
  FaClock, 
  FaPhone, 
  FaWheelchair,
  FaParking,
  FaMoneyBillWave,
  FaFilter,
  FaDirections,
  FaStar
} from "react-icons/fa";
import "../css/BranchLocator.css";

// Enhanced placeholder data
const locations = [
  {
    id: 1,
    name: "ABC Bank - Main Branch",
    type: "Branch",
    address: "123 Main St, City, Country",
    phone: "+91 98765 43210",
    hours: "Mon-Fri: 9:00 AM - 5:00 PM",
    services: ["Loans", "Deposits", "Forex"],
    facilities: ["Parking", "Wheelchair", "24/7 ATM"],
    rating: 4.5,
    reviews: 128,
    lat: 40.748817,
    lng: -73.985428,
    distance: "0.5",
    image: "branch1.jpg"
  },
  // ... more locations
];

const BranchLocator = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLocations, setFilteredLocations] = useState(locations);
  const [filters, setFilters] = useState({
    type: "all",
    services: [],
    facilities: [],
    radius: 5
  });
  const [userLocation, setUserLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [view, setView] = useState("list"); // list or map

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.log(error)
      );
    }
  }, []);

  const handleSearch = () => {
    let filtered = [...locations];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(location => 
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filters.type !== "all") {
      filtered = filtered.filter(location => location.type === filters.type);
    }

    if (filters.services.length) {
      filtered = filtered.filter(location => 
        filters.services.every(service => location.services.includes(service))
      );
    }

    if (filters.facilities.length) {
      filtered = filtered.filter(location => 
        filters.facilities.every(facility => location.facilities.includes(facility))
      );
    }

    setFilteredLocations(filtered);
  };

  return (
    <div className="alerts-page">
      <div className="alerts-content">
        <div className="alerts-header">
          <FaMapMarkerAlt className="header-icon" />
          <h4>Branch & ATM Locator</h4>
        </div>

        <div className="search-section">
          <div className="search-bar">
            {/* <FaSearch className="search-icon" /> */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by branch name, area, or pin code"
              className="search-input"
            />
            <button className="search-button" onClick={handleSearch}>
              Search
            </button>
          </div>

          <div className="view-toggle">
            <button 
              className={`view-btn ${view === 'list' ? 'active' : ''}`}
              onClick={() => setView('list')}
            >
              List View
            </button>
            <button 
              className={`view-btn ${view === 'map' ? 'active' : ''}`}
              onClick={() => setView('map')}
            >
              Map View
            </button>
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-groups">
            <div className="filter-group">
              <select 
                value={filters.type} 
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="filter-select"
              >
                <option value="all">All Locations</option>
                <option value="Branch">Branches Only</option>
                <option value="ATM">ATMs Only</option>
              </select>
            </div>

            <div className="filter-group">
              <select 
                value={filters.radius} 
                onChange={(e) => setFilters({...filters, radius: e.target.value})}
                className="filter-select"
              >
                <option value="5">Within 5 KM</option>
                <option value="10">Within 10 KM</option>
                <option value="20">Within 20 KM</option>
              </select>
            </div>
          </div>

          <div className="facility-filters">
            {["24/7", "Parking", "Wheelchair", "Forex"].map(facility => (
              <button 
                key={facility}
                className={`facility-btn ${filters.facilities.includes(facility) ? 'active' : ''}`}
                onClick={() => {
                  const newFacilities = filters.facilities.includes(facility)
                    ? filters.facilities.filter(f => f !== facility)
                    : [...filters.facilities, facility];
                  setFilters({...filters, facilities: newFacilities});
                }}
              >
                {facility}
              </button>
            ))}
          </div>
        </div>

        <div className="content-section">
          {view === 'list' ? (
            <div className="locations-grid">
              {filteredLocations.map((location) => (
                <div key={location.id} className="location-card">
                  <div className="location-header">
                    <div className="location-type">{location.type}</div>
                    <div className="location-distance">{location.distance} km away</div>
                  </div>

                  <h5>{location.name}</h5>
                  <p className="location-address">
                    <FaMapMarkerAlt /> {location.address}
                  </p>

                  <div className="location-details">
                    <p><FaClock /> {location.hours}</p>
                    <p><FaPhone /> {location.phone}</p>
                  </div>

                  <div className="location-facilities">
                    {location.facilities.map(facility => (
                      <span key={facility} className="facility-tag">
                        {facility === 'Parking' && <FaParking />}
                        {facility === 'Wheelchair' && <FaWheelchair />}
                        {facility === '24/7 ATM' && <FaMoneyBillWave />}
                        {facility}
                      </span>
                    ))}
                  </div>

                  <div className="location-rating">
                    <FaStar className="star-icon" />
                    <span>{location.rating}</span>
                    <span className="review-count">({location.reviews} reviews)</span>
                  </div>

                  <div className="location-actions">
                    <button className="action-btn">
                      <FaDirections /> Get Directions
                    </button>
                    <button className="action-btn">
                      More Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="map-view">
              {/* Google Maps integration would go here */}
              <div className="map-placeholder">
                Map View Coming Soon
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BranchLocator;