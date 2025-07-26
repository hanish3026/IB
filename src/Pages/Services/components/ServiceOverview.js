import React, { useState } from 'react';
import "../css/ServiceOverview.css"

const ServiceOverview = ({ services, setSelectedModule }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredServices = services.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.title.toLowerCase().includes(search.toLowerCase()) &&
      (activeCategory === 'all' || section.category === activeCategory)
    )
  }));

  return (
    <div>
      <div className="service-categories mb-4">
        <button
          className={`${activeCategory === 'all' ? 'action-button' : 'action-button'} me-2`}
          onClick={() => setActiveCategory('all')}
        >
          All Services
        </button>
        {services.map((section, index) => (
          <button
            key={index}
            className={`${activeCategory === section.category ? 'action-button' : 'action-button'} me-2`}
            onClick={() => setActiveCategory(section.category)}
          >
            {section.category}
          </button>
        ))}
      </div>

      <div className="row">
        {filteredServices.map(section =>
          section.items.map(service => (
            <div key={service.id} className="col-md-4 col-lg-4 mb-4">
              <div className="feature-card h-100">
                <div className="feature-title gap-2">
                  {service.icon}
                  <div className="">{service.title}</div>
                </div>
                <div className="feature-description">{service.description}</div>
                <button 
                  className='action-button primary mt-3 w-100'
                  onClick={() => setSelectedModule(service.id)}
                >
                  View Service
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {filteredServices.every(section => section.items.length === 0) && (
        <div className="text-center py-5">
          <p className="mb-3">No services found matching "{search}"</p>
          <button
            className="btn btn-outline-primary"
            onClick={() => setSearch('')}
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
};

export default ServiceOverview;