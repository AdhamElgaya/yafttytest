'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import './BookingForm.css';

const BookingForm = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    campaignDuration: '',
    budget: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    router.push('/payment/123'); // Navigate to payment page with booking ID
  };

  return (
    <div className="booking-form-container">
      <div className="booking-form">
        <h1>Book Your Outdoor Advertising</h1>
        <p>Fill out the form below to start your outdoor advertising campaign</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="company">Company Name</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="campaignDuration">Campaign Duration *</label>
            <select
              id="campaignDuration"
              name="campaignDuration"
              value={formData.campaignDuration}
              onChange={handleChange}
              required
            >
              <option value="">Select duration</option>
              <option value="1-week">1 Week</option>
              <option value="2-weeks">2 Weeks</option>
              <option value="1-month">1 Month</option>
              <option value="3-months">3 Months</option>
              <option value="6-months">6 Months</option>
              <option value="1-year">1 Year</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="budget">Budget Range *</label>
            <select
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              required
            >
              <option value="">Select budget</option>
              <option value="1000-5000">$1,000 - $5,000</option>
              <option value="5000-10000">$5,000 - $10,000</option>
              <option value="10000-25000">$10,000 - $25,000</option>
              <option value="25000-50000">$25,000 - $50,000</option>
              <option value="50000+">$50,000+</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message">Additional Requirements</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              placeholder="Tell us about your campaign requirements..."
            />
          </div>

          <button type="submit" className="submit-btn">
            Submit Booking Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm; 