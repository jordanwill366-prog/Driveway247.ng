// =======================================================================
// BROWSE CAR CATALOG (React + Tailwind CSS)
// Filename: frontend/components/BrowseListings.jsx
// =======================================================================

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BuyerInspectionRequest } from './InspectionRequest';

export default function BrowseListings() {
  const [originalListings, setOriginalListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter conditions
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedTransmission, setSelectedTransmission] = useState('');

  // Selected vehicle for details modal
  const [activeCar, setActiveCar] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSendingMsg, setIsSendingMsg] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState(false);

  // Retrieve listings on load
  useEffect(() => {
    fetchActiveListings();
  }, []);

  const fetchActiveListings = async () => {
    try {
      setLoading(true);
      // Fetching from `/api/listings` as assumed
      const response = await axios.get('/api/listings');
      setOriginalListings(response.data);
      setFilteredListings(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching cars list:', err);
      setError('Could not retrieve catalog listings. Please try again.');
      setLoading(false);
    }
  };

  // Run filtering on criteria updates
  useEffect(() => {
    let list = [...originalListings];

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.make.toLowerCase().includes(q) ||
          c.model.toLowerCase().includes(q)
      );
    }

    if (selectedMake) {
      list = list.filter((c) => c.make === selectedMake);
    }

    if (maxPrice) {
      const parsedMax = parseFloat(maxPrice);
      if (!isNaN(parsedMax)) {
        list = list.filter((c) => parseFloat(c.price) <= parsedMax);
      }
    }

    if (selectedTransmission) {
      list = list.filter((c) => c.transmission === selectedTransmission);
    }

    setFilteredListings(list);
  }, [searchQuery, selectedMake, maxPrice, selectedTransmission, originalListings]);

  // Handle Contact submission
  const handleContactSubmit = (e) => {
    e.preventDefault();
    setIsSendingMsg(true);
    // Simulate contact notification post payload
    setTimeout(() => {
      setIsSendingMsg(false);
      setMsgSuccess(true);
      setContactForm({ name: '', email: '', message: '' });
      setTimeout(() => setMsgSuccess(false), 5000);
    }, 1200);
  };

  // Unique list of manufacturers for the dynamic sidebar/filter selector
  const availableMakes = [...new Set(originalListings.map((c) => c.make))];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* 1. Header Hero Panel */}
      <section className="bg-slate-900 text-white py-12 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Explore Premium Off-Market Vehicles</h1>
            <p className="mt-2 text-slate-350 max-w-2xl text-lg">
              Unlock Verified pre-inspected inventory directly from top certified sellers.
              All-inclusive escrow support guaranteed.
            </p>
          </div>
          <div className="flex bg-white/10 rounded-full border border-white/20 px-4 py-2 text-sm select-none gap-2">
            <span className="text-emerald-450 font-semibold animate-pulse">●</span>
            <span className="text-slate-200">Catalog fully synchronized</span>
          </div>
        </div>
      </section>

      {/* 2. Main Workspace Layout */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* A. Sidebar filter controls */}
          <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm h-fit space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-800">Filter Listings</h2>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedMake('');
                  setMaxPrice('');
                  setSelectedTransmission('');
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition-all"
              >
                Clear all
              </button>
            </div>

            {/* Keyword Search */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Keyword Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Camry, F-Sport..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Manufacturer filter */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Manufacturer</label>
              <select
                value={selectedMake}
                onChange={(e) => setSelectedMake(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
              >
                <option value="">All Makes</option>
                {availableMakes.map((make) => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>
            </div>

            {/* Price Limit Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Maximum Price</label>
                <span className="text-sm font-semibold text-slate-700">
                  {maxPrice ? `$${parseFloat(maxPrice).toLocaleString()}` : 'Any Price'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100000"
                step="1000"
                value={maxPrice || '100000'}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full text-indigo-600 focus:outline-none accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Transmission filter */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Transmission</label>
              <div className="grid grid-cols-2 gap-2">
                {['Automatic', 'Manual'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedTransmission(selectedTransmission === type ? '' : type)}
                    className={`py-2 px-3 border rounded-xl text-xs font-medium transition-all ${
                      selectedTransmission === type
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                        : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* B. Active Products Grid list */}
          <section className="lg:col-span-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200/80 rounded-2xl md:p-12 shadow-sm space-y-4">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium">Downloading live car listings ledger...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16 bg-red-50 border border-red-100 rounded-2xl p-8 shadow-sm">
                <p className="text-red-700 font-medium">{error}</p>
                <button 
                  onClick={fetchActiveListings}
                  className="mt-4 px-6 py-2.5 bg-red-650 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all"
                >
                  Retry Loading
                </button>
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="text-center py-24 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-4">
                <p className="text-6xl">🚗</p>
                <h3 className="text-xl font-bold text-slate-700">No Vehicles match current filters</h3>
                <p className="text-slate-400 max-w-sm mx-auto text-sm">
                  Try broadening your keyword parameters or relaxing transmission filter tags (e.g. searching all makes or any price limits).
                </p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedMake('');
                    setMaxPrice('');
                    setSelectedTransmission('');
                  }}
                  className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-md hover:bg-slate-800 transition-all"
                >
                  Reset Filter State
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredListings.map((car) => (
                  <div 
                    key={car.id} 
                    className="group bg-white rounded-2xl border border-slate-200/75 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Active Car photo */}
                    <div className="relative overflow-hidden aspect-[4/3] bg-slate-100">
                      <img
                        src={(car.photos && car.photos[0]) || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600'}
                        alt={car.title}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600';
                        }}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className={`absolute top-4 left-4 text-xs font-bold tracking-wide px-3 py-1.5 rounded-full shadow-md text-white ${
                        car.status === 'active' ? 'bg-emerald-600' : 'bg-amber-600'
                      }`}>
                        {car.status ? car.status.toUpperCase() : 'ACTIVE'}
                      </span>
                    </div>

                    {/* Metadata elements */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                          {car.year} {car.make}
                        </p>
                        <h3 className="text-lg font-bold text-slate-800 line-clamp-1 mt-1 group-hover:text-indigo-600 transition-colors">
                          {car.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">{car.model}</p>
                      </div>

                      {/* Info grid metrics */}
                      <div className="grid grid-cols-2 gap-y-2 py-3 border-t border-b border-slate-100 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <span>🛣️</span>
                          <span>{car.mileage.toLocaleString()} miles</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span>⚙️</span>
                          <span className="truncate">{car.transmission}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span>⛽</span>
                          <span>{car.fuel_type || 'Petrol'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span>🎨</span>
                          <span>{car.color || 'Unspecified'}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <span className="text-xs text-slate-400 block font-semibold uppercase">ASKING PRICE</span>
                          <span className="text-xl font-black text-slate-900">
                            ${parseFloat(car.price || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* User action interfaces */}
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <button
                          onClick={() => setActiveCar(car)}
                          className="py-3 px-4 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all text-center min-h-[44px]"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            setActiveCar(car);
                            // Auto open dialog focus
                          }}
                          className="py-3 px-4 border border-indigo-600 text-indigo-750 bg-indigo-50/50 hover:bg-indigo-50 rounded-xl text-xs font-bold transition-all text-center min-h-[44px]"
                        >
                          Contact Seller
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* 3. Deep Vehicle Analysis Details Overlay Modal */}
      {activeCar && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header bar */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-indigo-400 font-bold tracking-widest uppercase">{activeCar.year} {activeCar.make}</span>
                <h3 className="text-xl font-bold">{activeCar.title}</h3>
              </div>
              <button 
                onClick={() => {
                  setActiveCar(null);
                  setMsgSuccess(false);
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-all text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Main container */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 max-h-[80vh] overflow-y-auto p-6 gap-6">
              
              {/* Column Left: Visuals & Specifications summary */}
              <div className="space-y-4">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-150">
                  <img
                    src={(activeCar.photos && activeCar.photos[0]) || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800'}
                    alt={activeCar.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Secondary list of detail pictures if available */}
                {activeCar.photos && activeCar.photos.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {activeCar.photos.slice(1, 5).map((pic, idx) => (
                      <div key={idx} className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border border-slate-250">
                        <img src={pic} alt="car profile segment" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Spec overview list */}
                <div className="bg-slate-55 shadow-inner p-4 rounded-2xl border border-slate-100 space-y-3">
                  <h4 className="text-sm font-bold text-slate-800">Vehicle Specifications</h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block uppercase">Year Range</span>
                      <strong className="text-slate-700 block">{activeCar.year}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block uppercase">Model Trim</span>
                      <strong className="text-slate-700 block truncate">{activeCar.model}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block uppercase">Price Index</span>
                      <strong className="text-slate-750 block font-extrabold text-blue-700">${parseFloat(activeCar.price).toLocaleString()}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block uppercase">Odometry Reading</span>
                      <strong className="text-slate-700 block">{activeCar.mileage.toLocaleString()} miles</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block uppercase">Fuel Index</span>
                      <strong className="text-slate-700 block">{activeCar.fuel_type || 'Petrol'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block uppercase">Transmission Shift</span>
                      <strong className="text-slate-700 block">{activeCar.transmission}</strong>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-500">
                  <h5 className="font-bold text-slate-750">Seller Description:</h5>
                  <p className="mt-1 leading-relaxed text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-150">
                    {activeCar.description || 'No direct comments added by seller. Standard mechanical compliance certificates are validated available.'}
                  </p>
                </div>
              </div>

              {/* Column Right: Messaging form client */}
              <div className="px-2 md:pl-6 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                    <h4 className="text-sm font-bold text-indigo-900">Guaranteed Escrow Secure Protection</h4>
                    <p className="text-xs text-indigo-750 mt-1 leading-relaxed">
                      All transactional balances are backed by the Carvello platform. Do NOT issue cash payments. Complete escrow transfers inside the portal.
                    </p>
                  </div>

                  {/* Active Vehicle Inspection Request Panel */}
                  <BuyerInspectionRequest listingId={activeCar.id} />

                  <h3 className="text-lg font-bold text-slate-800">Inquire with drive partner</h3>
                  
                  {msgSuccess ? (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 text-xs font-semibold space-y-1">
                      <p>✨ Request Dispatched Successfully!</p>
                      <p className="text-emerald-650 font-normal">A representative from the dealership will follow up within 2 hours of operating business window.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      {/* Name input */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Your Representative Name</label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          placeholder="e.g. Jordan Williams"
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                      </div>

                      {/* Email address */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Contact Email/Phone</label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          placeholder="jordanwill366@gmail.com"
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                      </div>

                      {/* Inline text query */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Your Message</label>
                        <textarea
                          rows="4"
                          required
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          placeholder={`Hello, I'm interested in the ${activeCar.year} ${activeCar.make} ${activeCar.model}. Is this vehicle clear for immediate pickup/inspections?`}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={isSendingMsg}
                        className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl text-xs font-bold transition-all shadow-md disabled:bg-indigo-300 min-h-[44px]"
                      >
                        {isSendingMsg ? 'Delivering Inquiry...' : 'Submit Certified Inquiry'}
                      </button>
                    </form>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Seller Tag: {activeCar.seller_id || 'Global Dealer'}</span>
                  <button 
                    onClick={() => {
                      setActiveCar(null);
                      setMsgSuccess(false);
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
