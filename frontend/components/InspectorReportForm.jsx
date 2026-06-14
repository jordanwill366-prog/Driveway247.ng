// =======================================================================
// INSPECTOR REPORT COMPILATION WORKSPACE (React + Tailwind)
// Filename: frontend/components/InspectorReportForm.jsx
// =======================================================================

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function InspectorReportForm() {
  const [assignedInspections, setAssignedInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Active processing inspection
  const [activeRequest, setActiveRequest] = useState(null);

  // Form states matching backend keys
  const [notes, setNotes] = useState('');
  const [score, setScore] = useState(7);
  const [defects, setDefects] = useState([]);
  const [newDefect, setNewDefect] = useState('');
  const [photos, setPhotos] = useState([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  const [saving, setSaving] = useState(false);

  // Load list of inspections assigned to this expert inspector
  useEffect(() => {
    fetchActiveAssigned();
  }, []);

  const getLoggedInInspector = () => {
    try {
      const rawUser = localStorage.getItem('user_session');
      if (rawUser) {
        return JSON.parse(rawUser);
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  const fetchActiveAssigned = async () => {
    const inspectorUser = getLoggedInInspector();
    if (!inspectorUser) {
      setError('Session missing: Please authenticate with an Inspector account.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token') || '';
      // We will load the pending pipeline logs & filter down on this inspector's assignments
      // Admin pending endpoint returns all rows, making it dynamic for general list viewing
      const response = await axios.get('/api/inspections/pending', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Filter matched assignments for this designated specialist
      const matched = response.data.filter(
        item => item.inspector_id === inspectorUser.id && ['assigned', 'in_progress'].includes(item.status)
      );

      setAssignedInspections(matched);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching assigned items:', err);
      setError('Could not retrieve your designated inspection tickets. Admin role or proper session registration needed.');
      setLoading(false);
    }
  };

  const handleLaunchReport = (req) => {
    setActiveRequest(req);
    // Preset form values with placeholders or standard defaults
    setNotes(req.report_notes || '');
    setScore(req.condition_score || 8);
    setDefects(req.defects || []);
    setPhotos(req.photos || [
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=400',
      'https://images.unsplash.com/photo-1508974239320-0a029497e820?q=80&w=400'
    ]);
    setSuccessMsg(null);
  };

  // Dynamic Array Adders
  const handleAddDefect = (e) => {
    e.preventDefault();
    if (newDefect.trim()) {
      setDefects([...defects, newDefect.trim()]);
      setNewDefect('');
    }
  };

  const handleRemoveDefect = (indexToRemove) => {
    setDefects(defects.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddPhoto = (e) => {
    e.preventDefault();
    if (newPhotoUrl.trim() && newPhotoUrl.startsWith('http')) {
      setPhotos([...photos, newPhotoUrl.trim()]);
      setNewPhotoUrl('');
    } else {
      alert('Must send a valid, absolute URL starting with http:// or https://');
    }
  };

  const handleRemovePhoto = (indexToRemove) => {
    setPhotos(photos.filter((_, idx) => idx !== indexToRemove));
  };

  // Submit complete evaluation payload to server PUT
  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!notes.trim()) {
      alert('Kindly fill in diagnostic review comments detailing your mechanical analysis.');
      return;
    }

    setSaving(true);
    setSuccessMsg(null);

    const reportPayload = {
      report_notes: notes,
      condition_score: parseInt(score),
      defects: defects,
      photos: photos
    };

    try {
      const token = localStorage.getItem('token') || '';
      const response = await axios.put(
        `/api/inspections/${activeRequest.id}/complete`,
        reportPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setSuccessMsg(`✨ Mechanical inspection report for Request #${activeRequest.id} completed successfully and dispatched to Admin audit.`);
        
        // Refresh master list
        await fetchActiveAssigned();

        // Close form dialog with delay
        setTimeout(() => {
          setActiveRequest(null);
          setSuccessMsg(null);
        }, 2000);
      }
    } catch (err) {
      console.error('Error submitting completed inspection form:', err);
      alert(err.response?.data?.error || 'Database rejected report registration.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Ribbon section */}
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-2xl font-black text-slate-900">Inspector Diagnostics Hub</h1>
          <p className="text-xs text-slate-500 mt-1">
            Access active on-site mechanical work orders assigned to your expert signature. Log testing observations and submit reports securely.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-2">
            <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-650 rounded-full animate-spin"></div>
            <p className="text-xs text-slate-400 font-semibold">Configuring diagnostic links...</p>
          </div>
        ) : error ? (
          <div className="text-center p-12 bg-red-50 border border-red-150 rounded-2xl text-red-850">
            <p className="text-sm font-semibold">{error}</p>
            <p className="text-xs text-slate-500 mt-1">Use the Mock Inspector Session tool in the navigation drawer to authenticate credentials.</p>
          </div>
        ) : assignedInspections.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl space-y-4">
            <span className="text-5xl block">🚗💨</span>
            <h3 className="text-lg font-bold text-slate-700">No Pending Inspections in Workspace</h3>
            <p className="text-xs text-slate-450 max-w-sm mx-auto leading-relaxed">
              Wonderful! You have answered all active work logs. Once our system administration staff assigns additional cars to your profile, they will show up here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* LEFT COLUMN: TICKETS IN WORKSPACE */}
            <div className="md:col-span-1 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Your Diagnostic Tickets</h3>
              <div className="space-y-3">
                {assignedInspections.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleLaunchReport(item)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer text-left ${
                      activeRequest?.id === item.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-slate-350 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className={`${activeRequest?.id === item.id ? 'text-indigo-300' : 'text-indigo-650'}`}>TICKET #{item.id}</span>
                      <span className="text-xs uppercase px-2 py-0.5 rounded bg-white/10">{item.status}</span>
                    </div>

                    <h4 className="font-extrabold mt-2 truncate text-sm leading-tight">{item.car_title}</h4>
                    <p className={`text-[11px] mt-1 ${activeRequest?.id === item.id ? 'text-slate-350' : 'text-slate-450'}`}>
                      Model Year: {item.car_year} · Color: {item.car_color || 'Default'}
                    </p>
                    
                    <div className="mt-4 pt-3 border-t border-slate-100/10 flex items-center justify-between text-[10px]">
                      <span>Action: Field Review</span>
                      <span className="font-bold underline">Begin Assessment →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: ACTIVE REPORT EDITOR FORM */}
            <div className="md:col-span-2">
              {activeRequest ? (
                <div className="bg-white border border-slate-200/95 rounded-3xl p-6 shadow-sm space-y-6">
                  
                  {/* Active vehicle identifier */}
                  <div className="flex items-center gap-4 bg-slate-50 border border-slate-150 p-4 rounded-2xl">
                    <span className="text-2xl">🔧</span>
                    <div>
                      <h3 className="font-extrabold text-slate-800 text-sm">Reviewing Live: {activeRequest.car_title}</h3>
                      <p className="text-xs text-slate-450">Inspection Order ID: #{activeRequest.id} · Filed by Buyer: {activeRequest.buyer_id}</p>
                    </div>
                  </div>

                  {successMsg && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 text-xs font-bold animate-pulse text-center">
                      {successMsg}
                    </div>
                  )}

                  <form onSubmit={handleSubmitReport} className="space-y-6">
                    
                    {/* Mechanical condition scale */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-500 uppercase">Mechanical Assessment Score (1-10)</label>
                        <span className="text-base font-black text-indigo-650">{score} / 10 Excellent</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        className="w-full text-indigo-600 accent-indigo-600 focus:outline-none cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-400 block leading-tight">
                        Provide a raw metric grading the structural safety of this asset. 1 represents terminal scrap condition, 10 represents mint showroom criteria.
                      </span>
                    </div>

                    {/* Report diagnostic comments */}
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Specialist Audit Comments & Observations</label>
                      <textarea
                        rows="5"
                        required
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Log observations about engine sound, brake pads condition, suspension performance, onboard fault scans, panel alignments, and odometer validation..."
                        className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-xs resize-none"
                      ></textarea>
                    </div>

                    {/* Defects logs */}
                    <div className="space-y-3 p-4 bg-red-50/20 border border-red-100 rounded-2xl">
                      <label className="text-xs font-bold text-red-800 uppercase block">Mechanical Defects Checked & Flagged</label>
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newDefect}
                          onChange={(e) => setNewDefect(e.target.value)}
                          placeholder="e.g. Scratched front lower bumper panel, OBD-II code P0302 misfire"
                          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs flex-1"
                        />
                        <button
                          type="button"
                          onClick={handleAddDefect}
                          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all"
                        >
                          Add Defect
                        </button>
                      </div>

                      {/* Defects list display */}
                      {defects.length === 0 ? (
                        <p className="text-[10px] text-slate-400 italic">No defects registered. All systems normal.</p>
                      ) : (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {defects.map((def, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-750 border border-red-100 text-[10px] font-semibold">
                              ⚠️ {def}
                              <button
                                type="button"
                                onClick={() => handleRemoveDefect(idx)}
                                className="text-[11px] text-red-400 hover:text-red-800 font-extrabold focus:outline-none"
                              >
                                ✕
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Media images array */}
                    <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                      <label className="text-xs font-bold text-slate-600 uppercase block">Field Survey Photo Uploads Links</label>
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newPhotoUrl}
                          onChange={(e) => setNewPhotoUrl(e.target.value)}
                          placeholder="Provide image URL starting with http/https..."
                          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs flex-1"
                        />
                        <button
                          type="button"
                          onClick={handleAddPhoto}
                          className="px-4 py-2.5 bg-indigo-650 text-white rounded-xl text-xs font-bold transition-all hover:bg-indigo-750"
                        >
                          Add URL
                        </button>
                      </div>

                      {/* Photo preview segment */}
                      <div className="grid grid-cols-4 gap-3 pt-2">
                        {photos.map((ph, idx) => (
                          <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-350 shadow-inner group">
                            <img src={ph} alt="uploaded evidence" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(idx)}
                              className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-black/60 rounded-full text-white text-[9px] hover:bg-black"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setActiveRequest(null)}
                        className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all h-[40px]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl text-xs font-bold shadow-md transition-all h-[40px] disabled:opacity-50"
                      >
                        {saving ? 'Transmitting Data...' : 'Certify & Submit Report'}
                      </button>
                    </div>

                  </form>
                </div>
              ) : (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400 space-y-3">
                  <p className="text-4xl">📋</p>
                  <h4 className="font-bold text-slate-600 text-sm">Form Workspace Idle</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Select one of your assigned diagnostic tickets from the left workspace sidebar to launch the live assessment editor.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
