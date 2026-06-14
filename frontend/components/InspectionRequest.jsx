// =======================================================================
// BUYER INSPECTION REQUEST & STATUS TRACKER (React + Tailwind)
// Filename: frontend/components/InspectionRequest.jsx
// =======================================================================

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Component A: REQUEST INSPECTION ACTION BUTTON (Used inside detail modals/views)
export function BuyerInspectionRequest({ listingId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const [isError, setIsError] = useState(false);

  const checkUserSession = () => {
    try {
      const rawUser = localStorage.getItem('user_session');
      if (rawUser) {
        return JSON.parse(rawUser);
      }
    } catch (e) {
      console.error('Session parse err:', e);
    }
    return null;
  };

  const handleRequestInspection = async () => {
    const user = checkUserSession();
    if (!user) {
      setIsError(true);
      setStatusMsg('Please log in as a Buyer to request a vehicles inspection.');
      return;
    }

    if ((user.role || '').toLowerCase() !== 'buyer') {
      setIsError(true);
      setStatusMsg('Only authorized Buyer accounts can order a mechanical inspection.');
      return;
    }

    setLoading(true);
    setStatusMsg(null);
    setIsError(false);

    try {
      // Set Auth headers from local token simulated
      const token = localStorage.getItem('token') || '';
      const response = await axios.post(
        '/api/inspections',
        { listing_id: listingId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setIsError(false);
        setStatusMsg('✨ Inspection request registered! Our administration deck will now assign a field specialist.');
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err) {
      console.error('Error submitting inspection request:', err);
      setIsError(true);
      setStatusMsg(err.response?.data?.error || 'Failed to submit inspection request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
      <div className="flex items-start gap-3">
        <span className="text-2xl mt-0.5">🔍</span>
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase">Mechanical Certifications</h4>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
            Order an on-site comprehensive evaluation. A qualified platform expert will analyze chassis, powertrain, diagnostics, and paint thickness.
          </p>
        </div>
      </div>

      {statusMsg && (
        <div className={`p-3 rounded-xl text-xs font-semibold ${
          isError ? 'bg-red-50 text-red-800 border border-red-105' : 'bg-emerald-50 text-emerald-800 border border-emerald-105'
        }`}>
          {statusMsg}
        </div>
      )}

      <button
        onClick={handleRequestInspection}
        disabled={loading}
        className="w-full h-[40px] flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-50"
      >
        {loading ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>Registering Order...</span>
          </>
        ) : (
          <span>📋 Request Professional Inspection</span>
        )}
      </button>
    </div>
  );
}

// Component B: MAIN BUYER WORKSPACE (Inspect personal requests & reports)
export default function BuyerInspectionStatus() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token') || '';
      const response = await axios.get('/api/inspections/my-requests', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRequests(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error retrieving inspection requests:', err);
      setError('Unable to fetch your active inspection records. Confirm you are signed in as a Buyer.');
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'assigned':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'in_progress':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'completed':
        return 'bg-indigo-50 text-indigo-750 border-indigo-200';
      case 'approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusLabel = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'pending': return 'Awaiting Admin Assignment';
      case 'assigned': return 'Inspector Assigned';
      case 'in_progress': return 'Reviewing On-Site';
      case 'completed': return 'Report Under Auditing';
      case 'approved': return 'Inspection Approved';
      case 'rejected': return 'Inspection Disapproved';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header summary */}
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-2xl font-black text-slate-900">Your Inspection Orders</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track certified engineering reports, specialist assignments, and physical mechanical audits for car purchases.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-650 rounded-full animate-spin"></div>
            <p className="text-xs text-slate-450 font-semibold">Gathering audit files...</p>
          </div>
        ) : error ? (
          <div className="text-center p-12 bg-red-50 border border-red-150 rounded-2xl text-red-850">
            <p className="text-sm font-semibold">{error}</p>
            <p className="text-xs text-red-500 mt-1">Use the Mock Buyer Session generator in the header bar to run buyer operations.</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl space-y-4">
            <span className="text-5xl block">🧐</span>
            <h3 className="text-lg font-bold text-slate-700">No Active Inspection Requests</h3>
            <p className="text-xs text-slate-450 max-w-sm mx-auto leading-relaxed">
              When viewing any vehicle listing under "Browse Cars", click the "Request Professional Inspection" button to order a thorough expert mechanical test.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {requests.map((req) => (
              <div key={req.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                
                {/* Vehicle summary specs */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-16 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
                    <img
                      src={(req.car_photos && req.car_photos[0]) || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=200'}
                      alt={req.car_title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded uppercase">Request #{req.id}</span>
                    <h3 className="font-extrabold text-slate-800 text-base mt-1">{req.car_title}</h3>
                    <p className="text-xs text-slate-450">{req.car_year} · {req.car_make} · {req.car_model}</p>
                  </div>
                </div>

                {/* Progress track */}
                <div className="flex-1 max-w-md w-full px-4">
                  <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
                    <span>Task Status:</span>
                    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase ${getStatusBadge(req.status)}`}>
                      ● {getStatusLabel(req.status)}
                    </span>
                  </div>
                  {/* Visual timeline bar */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        req.status === 'pending' ? 'w-1/4 bg-amber-500' :
                        req.status === 'assigned' ? 'w-2/4 bg-blue-500' :
                        req.status === 'in_progress' ? 'w-3/4 bg-purple-500' :
                        req.status === 'completed' ? 'w-11/12 bg-indigo-500' :
                        'w-full bg-emerald-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Report view prompt */}
                <div className="flex flex-col items-end gap-1.5 min-w-[150px]">
                  <span className="text-xs text-slate-400">Ordered {new Date(req.created_at).toLocaleDateString()}</span>
                  {(req.status === 'approved' || req.status === 'completed') ? (
                    <button
                      onClick={() => setViewingReport(req)}
                      className="w-full h-9 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all text-center"
                    >
                      📖 View Full Report
                    </button>
                  ) : (
                    <button
                      onClick={() => setViewingReport(req)}
                      className="w-full h-9 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-bold transition-all text-center"
                    >
                      🔍 Track Details
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

        {/* DETAILS POPUP FOR SINGLE INSPECTION TRACKING */}
        {viewingReport && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-250 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-250">
              
              <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Comprehensive Assessment Report</span>
                  <h3 className="font-bold text-md">Request ID: #{viewingReport.id}</h3>
                </div>
                <button 
                  onClick={() => setViewingReport(null)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-sm flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                {/* Vehicle specifications banner */}
                <div className="flex gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="w-16 h-12 bg-slate-200 rounded-lg overflow-hidden border border-slate-300">
                    <img 
                      src={viewingReport.car_photos?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=200'} 
                      alt="car thumbnail" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm">{viewingReport.car_title}</h4>
                    <p className="text-xs text-slate-500">
                      Pricing Asset Ask: <strong className="text-slate-800">${parseFloat(viewingReport.car_price || 0).toLocaleString()}</strong>
                    </p>
                  </div>
                </div>

                {/* Audit details stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-55 rounded-2xl border border-slate-100 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Specialist Decision Status</span>
                    <p className={`mt-1 text-sm font-bold uppercase ${getStatusBadge(viewingReport.status)} py-1 px-3 rounded-full border inline-block`}>
                      {viewingReport.status}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-55 rounded-2xl border border-slate-100 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Mechanical Score Rating (1-10)</span>
                    <div className="mt-1 flex items-baseline justify-center gap-1">
                      <span className="text-2xl font-black text-slate-800">
                        {viewingReport.condition_score || '--'}
                      </span>
                      <span className="text-xs text-slate-400">/ 10</span>
                    </div>
                  </div>
                </div>

                {/* Report notes block */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Inspection Assessment Summary</h4>
                  <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl text-xs text-slate-700 leading-relaxed min-h-[80px]">
                    {viewingReport.report_notes || 'Pending: The designated expert has not input mechanical review data yet.'}
                  </div>
                </div>

                {/* Defects bullet points */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Isolate Defect Items Reported</h4>
                  {viewingReport.defects && viewingReport.defects.length > 0 ? (
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {viewingReport.defects.map((def, idx) => (
                        <li key={idx} className="flex items-center gap-2 bg-red-50/50 text-red-800 border border-red-100 p-2.5 rounded-xl font-medium">
                          <span className="text-red-500">⚠️</span>
                          <span>{def}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-100 text-center">
                      ✨ No outstanding mechanic defects flagged in testing.
                    </div>
                  )}
                </div>

                {/* Inspection live pictures section */}
                {viewingReport.photos && viewingReport.photos.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Field Assessment Media Uploads</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {viewingReport.photos.map((ph, idx) => (
                        <div key={idx} className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                          <img src={ph} alt="mechanical review point" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Inspector ID: {viewingReport.inspector_id || 'Not assigned yet'}</span>
                  <span>Last Checked: {new Date(viewingReport.updated_at).toLocaleString()}</span>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
