// =======================================================================
// SELLER ACCOUNT DEALERSHIP DASHBOARD (React + Tailwind CSS)
// Filename: frontend/components/SellerListings.jsx
// =======================================================================

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function SellerListings() {
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal Control state
  const [showModal, setShowModal] = useState(false);
  const [operatingListing, setOperatingListing] = useState(null); // null means 'Add Car', value means 'Edit'

  // Input bindings
  const [formData, setFormData] = useState({
    title: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    mileage: '',
    color: '',
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    description: '',
    photos: ''
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  // Load seller's own data
  useEffect(() => {
    fetchSellerLedger();
  }, []);

  const fetchSellerLedger = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch own items from backend
      const response = await axios.get('/api/listings/my-listings');
      setMyListings(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching inventory ledgers:', err);
      // Fallback - If not securely signed in or backend returns error, handle gracefully
      setError('Could not retrieve dealer inventory. Ensure you are signed in as a Seller.');
      setLoading(false);
    }
  };

  // Trigger modal launch for NEW item
  const handleAddNewCar = () => {
    setOperatingListing(null);
    setFormData({
      title: '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      price: '',
      mileage: '',
      color: '',
      fuel_type: 'Petrol',
      transmission: 'Automatic',
      description: '',
      photos: ''
    });
    setShowModal(true);
  };

  // Trigger modal launch for EDITING existing item
  const handleEditCarClick = (car) => {
    setOperatingListing(car);
    setFormData({
      title: car.title || '',
      make: car.make || '',
      model: car.model || '',
      year: car.year || new Date().getFullYear(),
      price: car.price || '',
      mileage: car.mileage || '',
      color: car.color || '',
      fuel_type: car.fuel_type || 'Petrol',
      transmission: car.transmission || 'Automatic',
      description: car.description || '',
      photos: Array.isArray(car.photos) ? car.photos.join(', ') : ''
    });
    setShowModal(true);
  };

  // Handle Form Submissions (Create or Update)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);

    // Format photos string into actual array
    const photosArr = formData.photos
      .split(',')
      .map((url) => url.trim())
      .filter((url) => url.startsWith('http'));

    const packagePayload = {
      ...formData,
      year: parseInt(formData.year),
      price: parseFloat(formData.price),
      mileage: parseInt(formData.mileage),
      photos: photosArr.length > 0 ? photosArr : ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600']
    };

    try {
      if (operatingListing) {
        // Run PUT update
        const response = await axios.put(`/api/listings/${operatingListing.id}`, packagePayload);
        setSuccessMsg('Listing modified successfully in catalog.');
      } else {
        // Run POST create
        const response = await axios.post('/api/listings', packagePayload);
        setSuccessMsg('New vehicle published live to public feed.');
      }

      // Reload dataset and close modal
      await fetchSellerLedger();
      setTimeout(() => {
        setShowModal(false);
        setSuccessMsg(null);
      }, 1500);
    } catch (err) {
      console.error('Error preserving listing records:', err);
      alert(err.response?.data?.error || 'Database rejected listing registration. Ensure correct parameters.');
    } finally {
      setSaving(false);
    }
  };

  // Handle Delete Confirmation
  const handleDeleteCar = async (listingId) => {
    if (!window.confirm('Are you absolutely sure you want to remove this car permanently from dealership catalogs?')) {
      return;
    }

    try {
      await axios.delete(`/api/listings/${listingId}`);
      await fetchSellerLedger();
    } catch (err) {
      console.error('Error removing targeted listing:', err);
      alert('Failed to delete listing. Ensure you own this vehicle or have administrator role rights.');
    }
  };

  // Stats ledger metrics Calculations
  const statsTotal = myListings.length;
  const statsActive = myListings.filter((c) => c.status === 'active' || c.status === 'approved').length;
  const statsSold = myListings.filter((c) => c.status === 'sold').length;
  const totalValuation = myListings.reduce((acc, current) => acc + parseFloat(current.price || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* 1. Header Action bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Dealer Inventory Hub</h1>
            <p className="mt-1 text-slate-500 text-sm">
              Control, edit, and publish your dealership inventory records. Check active status, adjust quotes, or remove sold vehicles.
            </p>
          </div>
          <button
            onClick={handleAddNewCar}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl py-3 px-6 text-sm font-bold shadow-md transition-all h-[44px]"
          >
            <span>➕</span>
            <span>Publish New Vehicle</span>
          </button>
        </div>

        {/* 2. Visual Statistics Banner Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 border border-slate-200/80 rounded-2xl shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Registered Vehicles</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{statsTotal}</span>
              <span className="text-xs text-slate-450">items in ledger</span>
            </div>
          </div>

          <div className="bg-white p-6 border border-slate-200/80 rounded-2xl shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active & Public Feed</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 text-emerald-650">{statsActive}</span>
              <span className="text-xs text-slate-450">viewable online</span>
            </div>
          </div>

          <div className="bg-white p-6 border border-slate-200/80 rounded-2xl shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sold Transactions</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 text-indigo-650">{statsSold}</span>
              <span className="text-xs text-slate-450">cleared via portal</span>
            </div>
          </div>

          <div className="bg-white p-6 border border-slate-200/80 rounded-2xl shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Inventory Valuation</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 text-blue-750">${totalValuation.toLocaleString()}</span>
              <span className="text-xs text-slate-450">cumulative USD</span>
            </div>
          </div>

        </div>

        {/* 3. listings Table or Grid collection */}
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-md">Your Commercial Listings</h3>
            <button 
              onClick={fetchSellerLedger}
              className="text-xs text-slate-500 hover:text-indigo-650 flex items-center gap-1.5"
            >
              🔄 Refresh List
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-650 rounded-full animate-spin"></div>
              <p className="text-xs font-medium text-slate-400">Loading catalog trace...</p>
            </div>
          ) : error ? (
            <div className="text-center p-12 bg-red-50 text-red-750">
              <p className="text-sm font-semibold">{error}</p>
              <p className="text-xs text-slate-450 mt-1">Please log in as an authorized Seller / Prime partner with active token certification files.</p>
            </div>
          ) : myListings.length === 0 ? (
            <div className="text-center py-20 px-4 space-y-4">
              <span className="text-5xl block">📑</span>
              <h4 className="text-lg font-bold text-slate-700">No Inventory Found</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                You haven't added any vehicles for escrow sale yet. Click "Publish New Vehicle" in the top bar to register your first catalog entry.
              </p>
              <button
                onClick={handleAddNewCar}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl text-xs font-bold shadow-md transition-all inline-block h-[40px]"
              >
                Launch Creation Wizard
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase">
                  <tr>
                    <th className="py-4 px-6">Vehicle Details</th>
                    <th className="py-4 px-3">Parameters</th>
                    <th className="py-4 px-3">Price Status</th>
                    <th className="py-4 px-3">Exposure</th>
                    <th className="py-4 text-right pr-8">Control Deck</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {myListings.map((car) => (
                    <tr key={car.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Thumbnail & Title info */}
                      <td className="py-4 px-6 flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
                          <img
                            src={(car.photos && car.photos[0]) || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=200'}
                            alt={car.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <strong className="block text-slate-850 font-bold max-w-xs truncate">{car.title}</strong>
                          <span className="text-xs text-slate-450 block mt-0.5">{car.year} {car.make} {car.model}</span>
                        </div>
                      </td>

                      {/* Mileage / Transmission list */}
                      <td className="py-4 px-3 text-xs text-slate-600 space-y-0.5">
                        <p className="font-semibold">{car.mileage.toLocaleString()} miles</p>
                        <p className="text-slate-400">{car.transmission} · {car.fuel_type}</p>
                      </td>

                      {/* Financial Index info */}
                      <td className="py-4 px-3">
                        <strong className="block text-slate-900 font-extrabold text-blue-750">
                          ${parseFloat(car.price).toLocaleString()}
                        </strong>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">USD base list</span>
                      </td>

                      {/* Dynamic status badges */}
                      <td className="py-4 px-3 text-xs">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold uppercase text-[10px] ${
                          car.status === 'active' || car.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : car.status === 'sold'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>
                          ● {car.status || 'ACTIVE'}
                        </span>
                      </td>

                      {/* Edit or Purge controllers */}
                      <td className="py-4 pr-8 text-right space-x-2">
                        <button
                          onClick={() => handleEditCarClick(car)}
                          className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-indigo-650 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-all min-h-[38px]"
                        >
                          ✏️ Edit Specs
                        </button>
                        <button
                          onClick={() => handleDeleteCar(car.id)}
                          className="px-3.5 py-2 text-xs font-bold text-red-700 hover:text-red-950 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-all min-h-[38px]"
                        >
                          🗑️ Purge
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* 4. Car Builder Form Creation/Edit Backdrop Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Form header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">
                  {operatingListing ? `Modify Vehicle Specs: ${operatingListing.title}` : 'List New Vehicle for Escrow'}
                </h3>
                <p className="text-xs text-slate-350">Fill in detailed metrics for buyer compliance.</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Form interface element */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              
              {successMsg && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 text-xs font-bold animate-pulse text-center">
                  ✨ {successMsg}
                </div>
              )}

              {/* Title & Brand fields */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Commercial Title Header</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Mercedes-Benz C300 Premium Coupe 4MATIC"
                  className="w-full px-4 py-3 bg-slate-55 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                />
              </div>

              {/* Triple Grid elements */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Make</label>
                  <input
                    type="text"
                    required
                    value={formData.make}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    placeholder="e.g. Mercedes-Benz"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Model</label>
                  <input
                    type="text"
                    required
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="e.g. C300 Coupe"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Year Model</label>
                  <input
                    type="number"
                    required
                    min="1886"
                    max="2030"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* pricing & Mileage metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Asking Price Quote (USD)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 52000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Odometry Reading (Miles)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 15450"
                    value={formData.mileage}
                    onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Attributes styling */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Color Theme</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Obsidian Black"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Fuel Standard</label>
                  <select
                    value={formData.fuel_type}
                    onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs bg-white cursor-pointer"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Transmission Box</label>
                  <select
                    value={formData.transmission}
                    onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs bg-white cursor-pointer"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                    <option value="CVT">CVT</option>
                  </select>
                </div>
              </div>

              {/* Image urls link */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Photos URLs (Commaseparated)</label>
                <input
                  type="text"
                  placeholder="e.g. https://images.unsplash.com/... , https://images.unsplash.com/..."
                  value={formData.photos}
                  onChange={(e) => setFormData({ ...formData, photos: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs"
                />
                <span className="text-[10px] text-slate-400 mt-1 block leading-relaxed">
                  Provide absolute URLs starting with http:// or https://. Separate multiple image references using commas.
                </span>
              </div>

              {/* Description block */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Vehicle Narrative Description</label>
                <textarea
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Identify premium comfort packets, paint scratches, servicing histories, customized carbon trim attributes, or import clearance dates..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs resize-none"
                ></textarea>
              </div>

              {/* Action operations and cancel link */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-indigo-650 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold transition-all disabled:bg-indigo-300 min-h-[44px]"
                >
                  {saving ? 'Preserving Listing details...' : 'Publish Modifications'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
