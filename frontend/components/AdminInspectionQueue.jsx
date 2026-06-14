// =======================================================================
// PORTAL ADMINISTRATION DECK: INSPECTION DISPATCH QUEUE (React + Tailwind)
// Filename: frontend/components/AdminInspectionQueue.jsx
// =======================================================================

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Specialist directory list
const SPECIALISTS = [
  { id: 'ins-jake-04', name: 'Jake Thompson', specialty: 'Body, Frame, & Chassis Specialist' },
  { id: 'ins-sarah- Chen', name: 'Sarah Chen', specialty: 'EV & Hybrid Diagnostics Specialist' },
  { id: 'ins-alex-99', name: 'Alex Rodriguez', specialty: 'Powertrain & Gearbox Examiner' }
];

export default function AdminInspectionQueue() {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Selected specialist state mapped by inspection ID
  const [assignments, setAssignments] = useState({});
  const [submittingId, setSubmittingId] = useState(null);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token') || '';
      const response = await axios.get('/api/inspections/pending', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setInspections(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching admin inspection files:', err);
      setError('Could not retrieve inspection backlog files. Verify you are signed in with the Admin credentials.');
      setLoading(false);
    }
  };

  // Assign certified field officer to active request
  const handleAssignSpecialist = async (inspectionId) => {
    const specialistId = assignments[inspectionId];
    if (!specialistId) {
      alert('Kindly select a qualified specialist from the dropdown catalogue first.');
      return;
    }

    setSubmittingId(inspectionId);
    setSuccessMsg(null);

    try {
      const token = localStorage.getItem('token') || '';
      const response = await axios.put(
        `/api/inspections/${inspectionId}/assign`,
        { inspector_id: specialistId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setSuccessMsg(`Specialist successfully assigned to request #${inspectionId}.`);
        await fetchQueue();
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error('Failure dispatching inspector:', err);
      alert(err.response?.data?.error || 'Database rejected dynamic assignment instructions.');
    } finally {
      setSubmittingId(null);
    }
  };

  // Admin audit approvals & rejections
  const handleReviewDecision = async (inspectionId, verdict) => {
    setSubmittingId(inspectionId);
    setSuccessMsg(null);

    try {
      const token = localStorage.getItem('token') || '';
      const response = await axios.put(
        `/api/inspections/${inspectionId}/approve`,
        { status: verdict }, // 'approved' or 'rejected'
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setSuccessMsg(`Request #${inspectionId} has been successfully designated as '${verdict}'.`);
        await fetchQueue();
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error('Failure updating approval states:', err);
      alert(err.response?.data?.error || 'Failed to submit approvals verdict.');
    } finally {
      setSubmittingId(null);
    }
  };

  const getStatusStyle = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'pending': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'assigned': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'completed': return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'approved': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'rejected': return 'bg-red-50 text-red-800 border-red-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header content bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-5 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Administration Dispatch & Auditing Queue</h1>
            <p className="text-xs text-slate-500 mt-1">
              Match vehicle review requests with certified safety specialists, and verify engine/compartment specs before buyer presentation.
            </p>
          </div>
          <button 
            onClick={fetchQueue}
            className="px-4 py-2 border border-slate-250 hover:bg-slate-100 text-xs font-bold rounded-xl bg-white text-slate-750 flex items-center gap-1.5 h-[40px] transition-all"
          >
            🔄 Refresh Pipeline
          </button>
        </div>

        {/* Global action feedback banner */}
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-2xl p-4 text-xs font-bold animate-pulse text-center">
            ✨ {successMsg}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-sm">
            <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-xs text-slate-400 font-semibold">Resolving pending queue logs...</p>
          </div>
        ) : error ? (
          <div className="text-center p-12 bg-red-50 border border-red-150 rounded-2xl text-red-850">
            <p className="text-sm font-semibold">{error}</p>
            <p className="text-xs text-red-500 mt-1">Use the Mock Admin Session generator in the navigation ribbon to log in as administrative advisor.</p>
          </div>
        ) : inspections.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-sm">
            <span className="text-5xl block">🏝️</span>
            <h3 className="text-lg font-bold text-slate-700">All Clear: No requests in Queue</h3>
            <p className="text-xs text-slate-450 max-w-sm mx-auto leading-relaxed">
              Buyers have not ordered any car listings surveys. When an inspection is added, it will populate this portal dynamically for dispatch control.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold uppercase text-slate-500 tracking-wider">
                  <tr>
                    <th className="py-4 px-6 text-xs">Request Info</th>
                    <th className="py-4 px-4 text-xs">Vehicle Target</th>
                    <th className="py-4 px-4 text-xs">Assigned Specialist</th>
                    <th className="py-4 px-4 text-xs">Flow State</th>
                    <th className="py-4 pr-8 text-right text-xs">Response Deck</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-650">
                  {inspections.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/40 transition-colors">
                      {/* Request details */}
                      <td className="py-4 px-6">
                        <strong className="block text-slate-900 font-bold text-sm">Req #{req.id}</strong>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Buyer Signature: {req.buyer_id}</span>
                        <span className="text-[10px] text-slate-400 block">Created: {new Date(req.created_at).toLocaleDateString()}</span>
                      </td>

                      {/* Vehicle properties */}
                      <td className="py-4 px-4">
                        <strong className="block text-slate-800 text-xs font-bold leading-none truncate max-w-[200px]">{req.car_title}</strong>
                        <span className="text-[10px] text-indigo-600 font-medium block mt-1">Car Price: ${parseFloat(req.car_price).toLocaleString()}</span>
                      </td>

                      {/* Specialist information */}
                      <td className="py-4 px-4">
                        {req.inspector_id ? (
                          <div className="space-y-0.5">
                            <span className="block font-semibold text-slate-800">
                              👤 {SPECIALISTS.find(sp => sp.id === req.inspector_id)?.name || req.inspector_id}
                            </span>
                            <span className="text-[10px] text-slate-400 uppercase block font-medium">Platform Certified Rank</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No specialist assigned yet</span>
                        )}
                      </td>

                      {/* Flow status */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-extrabold uppercase ${getStatusStyle(req.status)}`}>
                          ● {req.status}
                        </span>
                      </td>

                      {/* Actions Deck */}
                      <td className="py-4 pr-8 text-right">
                        {/* Action State: Pending -> Dispatch choice */}
                        {req.status === 'pending' && (
                          <div className="flex items-center justify-end gap-2">
                            <select
                              value={assignments[req.id] || ''}
                              onChange={(e) => setAssignments({ ...assignments, [req.id]: e.target.value })}
                              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs flex-1 max-w-[220px] focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer text-slate-700 font-medium h-[38px]"
                            >
                              <option value="">Select Certified Officer...</option>
                              {SPECIALISTS.map(sp => (
                                <option key={sp.id} value={sp.id}>{sp.name} ({sp.specialty})</option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleAssignSpecialist(req.id)}
                              disabled={submittingId === req.id}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl text-xs font-extrabold shadow h-[38px] transition-all disabled:opacity-50"
                            >
                              Dispatch Spec
                            </button>
                          </div>
                        )}

                        {/* Action State: Assigned or In Progress -> Wait */}
                        {(req.status === 'assigned' || req.status === 'in_progress') && (
                          <span className="text-slate-400 italic text-xs">Waiting for inspector to submit report...</span>
                        )}

                        {/* Action State: Completed -> Admin approve or decline triggers */}
                        {req.status === 'completed' && (
                          <div className="flex items-center justify-end gap-2">
                            {req.report_notes && (
                              <button
                                onClick={() => alert(`INSPECTION REPORT NOTES:\n\nScore: ${req.condition_score}/10\n\nNotes: ${req.report_notes}\n\nDefects identified:\n${req.defects?.length > 0 ? req.defects.join('\n- ') : 'None'}`)}
                                className="px-3.5 py-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 rounded-xl transition-all h-[38px]"
                              >
                                📋 Read Notes
                              </button>
                            )}
                            <button
                              onClick={() => handleReviewDecision(req.id, 'approved')}
                              disabled={submittingId === req.id}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-705 text-white rounded-xl text-xs font-extrabold shadow transition-all h-[38px] disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReviewDecision(req.id, 'rejected')}
                              disabled={submittingId === req.id}
                              className="px-4 py-2 bg-red-600 hover:bg-red-750 text-white rounded-xl text-xs font-extrabold shadow transition-all h-[38px] disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        )}

                        {/* Action State: Approved or Rejected -> Print status info */}
                        {(req.status === 'approved' || req.status === 'rejected') && (
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="text-xs text-slate-400 font-medium">Evaluation certified closed.</span>
                            {req.report_notes && (
                              <button
                                onClick={() => alert(`INSPECTION REPORT NOTES:\n\nScore: ${req.condition_score}/10\n\nNotes: ${req.report_notes}\n\nDefects identified:\n${req.defects?.length > 0 ? req.defects.join('\n- ') : 'None'}`)}
                                className="px-2.5 py-1 text-[11px] border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 transition-all font-semibold"
                              >
                                Read
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
