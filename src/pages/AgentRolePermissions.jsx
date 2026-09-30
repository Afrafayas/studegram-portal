import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useToast } from '../context/ToastContext';

const AGENT_SIDEBAR_ITEMS = [
  { key: 'sidebar:dashboard', label: 'Agent Dashboard' },
  { key: 'sidebar:applications', label: 'Application History' },
  { key: 'sidebar:universities', label: 'Universities Directory' },
  { key: 'sidebar:courses', label: 'Search Courses' },
  { key: 'sidebar:staff', label: 'Team Management' },
  { key: 'sidebar:notice', label: 'Notices & Circulars' },
  { key: 'sidebar:webinar', label: 'Webinars' },
  { key: 'sidebar:knowledge', label: 'Knowledge Hub' },
  { key: 'sidebar:scholarships', label: 'Scholarships' },
  { key: 'sidebar:deadlines', label: 'University Deadlines' }
];

const AGENT_FEATURE_ACTIONS = [
  { key: 'applications:view', label: 'View Student Applications' },
  { key: 'applications:create', label: 'Create & Submit New Student Application' },
  { key: 'applications:edit', label: 'Edit Application Details & Documents' },
  { key: 'applications:claim_commission', label: 'Claim Agency Commission Payout' },
  { key: 'staff:view', label: 'View Agency Team Members' },
  { key: 'staff:manage', label: 'Add & Manage Agency Staff Credentials' }
];

const DEFAULT_AGENT_ROLES = [
  {
    _id: 'ar1',
    name: 'AgencyAdmin',
    displayName: 'Agent SuperAdmin (Agency Owner)',
    portalType: 'Agent',
    description: 'Primary agency administrator with total control over staff accounts, applications, and payouts.',
    permissions: [
      'sidebar:dashboard', 'sidebar:applications', 'sidebar:universities', 'sidebar:courses',
      'sidebar:staff', 'sidebar:notice', 'sidebar:webinar', 'sidebar:knowledge', 'sidebar:scholarships', 'sidebar:deadlines',
      'applications:view', 'applications:create', 'applications:edit', 'applications:claim_commission', 'staff:view', 'staff:manage'
    ],
    isPreset: true
  },
  {
    _id: 'ar2',
    name: 'Manager',
    displayName: 'Agency Branch Manager',
    portalType: 'Agent',
    description: 'Manages branch counselors, application filings, and student lead follow-ups.',
    permissions: [
      'sidebar:dashboard', 'sidebar:applications', 'sidebar:universities', 'sidebar:courses',
      'sidebar:notice', 'sidebar:webinar', 'sidebar:knowledge', 'sidebar:scholarships', 'sidebar:deadlines',
      'applications:view', 'applications:create', 'applications:edit', 'staff:view'
    ],
    isPreset: true
  },
  {
    _id: 'ar3',
    name: 'Counselor',
    displayName: 'Student Counselor',
    portalType: 'Agent',
    description: 'Creates student profiles, searches courses, and files application submissions.',
    permissions: [
      'sidebar:dashboard', 'sidebar:applications', 'sidebar:universities', 'sidebar:courses', 'sidebar:notice',
      'applications:view', 'applications:create'
    ],
    isPreset: true
  },
  {
    _id: 'ar4',
    name: 'Staff',
    displayName: 'Agency Staff Executive',
    portalType: 'Agent',
    description: 'Standard processing staff member assisting with document uploads and application tracking.',
    permissions: [
      'sidebar:dashboard', 'sidebar:applications', 'sidebar:courses',
      'applications:view', 'applications:create'
    ],
    isPreset: true
  }
];

export default function AgentRolePermissions({ partnerData }) {
  const toast = useToast();
  const [roles, setRoles] = useState(DEFAULT_AGENT_ROLES);
  const [isLoading, setIsLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleForm, setRoleForm] = useState({
    name: '',
    displayName: '',
    portalType: 'Agent',
    description: '',
    permissions: []
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchAgentRoles = async () => {
    setIsLoading(true);
    try {
      const res = await API.get('/roles');
      if (res.data?.success && Array.isArray(res.data.data)) {
        const agentRoles = res.data.data.filter(r => r.portalType === 'Agent');
        if (agentRoles.length > 0) {
          const fetchedNames = new Set(agentRoles.map(r => r.name));
          const missingPresets = DEFAULT_AGENT_ROLES.filter(pr => !fetchedNames.has(pr.name));
          setRoles([...agentRoles, ...missingPresets]);
        }
      }
    } catch (err) {
      console.warn('Failed to load agent roles from backend:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentRoles();
  }, []);

  const openCreateModal = () => {
    setEditingRole(null);
    setRoleForm({
      name: '',
      displayName: '',
      portalType: 'Agent',
      description: '',
      permissions: ['sidebar:dashboard', 'sidebar:applications', 'applications:create']
    });
    setIsModalOpen(true);
  };

  const openEditModal = (role) => {
    setEditingRole(role);
    setRoleForm({
      name: role.name || '',
      displayName: role.displayName || role.name || '',
      portalType: 'Agent',
      description: role.description || '',
      permissions: role.permissions || []
    });
    setIsModalOpen(true);
  };

  const togglePermissionKey = (key) => {
    setRoleForm(prev => {
      const exists = prev.permissions.includes(key);
      if (exists) {
        return { ...prev, permissions: prev.permissions.filter(k => k !== key) };
      } else {
        return { ...prev, permissions: [...prev.permissions, key] };
      }
    });
  };

  const handleSaveRole = async (e) => {
    e.preventDefault();
    if (!roleForm.displayName.trim() || (!editingRole && !roleForm.name.trim())) {
      toast.error('Role display title and identifier are required.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingRole && editingRole._id && !editingRole._id.startsWith('ar')) {
        const res = await API.put(`/roles/${editingRole._id}`, {
          displayName: roleForm.displayName,
          description: roleForm.description,
          permissions: roleForm.permissions
        });
        if (res.data?.success) {
          toast.success(`Role '${roleForm.displayName}' permissions updated in database!`);
          setIsModalOpen(false);
          fetchAgentRoles();
        }
      } else {
        const res = await API.post('/roles', {
          name: roleForm.name || roleForm.displayName.replace(/\s+/g, ''),
          displayName: roleForm.displayName,
          portalType: 'Agent',
          description: roleForm.description,
          permissions: roleForm.permissions
        });
        if (res.data?.success) {
          toast.success(`Role '${roleForm.displayName}' saved to database!`);
          setIsModalOpen(false);
          fetchAgentRoles();
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save role permissions.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full select-text">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">
              Agency Roles & Permissions Checklist
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-50 text-purple-700 border border-purple-200">
              Agency RBAC
            </span>
          </div>
          <p className="text-xs text-[#64748B] font-medium">
            Manage your agency staff operational roles, sidebar item checklists, and feature access clearance.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-[#D99A1C] to-[#F5B025] hover:scale-[1.02] text-black font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Create Agency Role
        </button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => (
          <div key={role._id || role.name} className="bg-white border border-[#E2E8F0] hover:border-[#D99A1C] rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4 transition-all">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-purple-50 text-purple-700 border border-purple-200">
                    🏢 Agency Role
                  </span>
                  <h3 className="text-lg font-bold text-[#0F172A] pt-1">{role.displayName || role.name}</h3>
                </div>
                {role.isPreset && (
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200">
                    Preset Role
                  </span>
                )}
              </div>

              <p className="text-xs text-[#64748B] font-medium leading-relaxed">
                {role.description || 'Configured agency staff access level.'}
              </p>

              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Assigned Permissions ({role.permissions?.length || 0}):</span>
                <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto">
                  {role.permissions?.map((pKey) => (
                    <span key={pKey} className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-200">
                      {pKey}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => openEditModal(role)}
              className="w-full bg-[#0F172A] hover:bg-black text-white font-bold text-xs py-2.5 rounded-xl transition-all uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit Permissions Checklist</span>
            </button>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs select-none p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 bg-[#0F172A] text-white">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  {editingRole ? `Edit Agency Role — ${editingRole.displayName}` : 'Create Agency Security Role'}
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold">Checklist sidebar navigation and operational rights</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRole} className="p-6 space-y-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">Role Title / Display Name *</label>
                  <input
                    type="text"
                    required
                    value={roleForm.displayName}
                    onChange={(e) => setRoleForm({ ...roleForm, displayName: e.target.value })}
                    placeholder="e.g. Branch Supervisor"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#D99A1C]"
                  />
                </div>

                {!editingRole && (
                  <div className="space-y-1">
                    <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">Identifier (No spaces) *</label>
                    <input
                      type="text"
                      required
                      value={roleForm.name}
                      onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                      placeholder="e.g. BranchSupervisor"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#D99A1C]"
                    />
                  </div>
                )}

                <div className="space-y-1 md:col-span-2">
                  <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">Role Description</label>
                  <input
                    type="text"
                    value={roleForm.description}
                    onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                    placeholder="Describe staff operational rights..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#D99A1C]"
                  />
                </div>
              </div>

              {/* SIDEBAR ITEMS CHECKLIST */}
              <div className="space-y-3 border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  📌 Agency Sidebar Navigation Checklist
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AGENT_SIDEBAR_ITEMS.map((item) => {
                    const isChecked = roleForm.permissions.includes(item.key);
                    return (
                      <label
                        key={item.key}
                        onClick={() => togglePermissionKey(item.key)}
                        className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                          isChecked ? 'bg-amber-50 border-[#D99A1C] text-[#0F172A] font-bold' : 'bg-slate-50 border-slate-200 text-[#64748B]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#D99A1C] rounded border-slate-300 focus:ring-[#D99A1C]"
                        />
                        <div className="truncate">
                          <p className="text-xs">{item.label}</p>
                          <span className="text-[9px] text-[#64748B] block font-mono">{item.key}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* FEATURE ACTION CHECKLIST */}
              <div className="space-y-3 border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  ⚡ Agency Feature Capabilities Checklist
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AGENT_FEATURE_ACTIONS.map((act) => {
                    const isChecked = roleForm.permissions.includes(act.key);
                    return (
                      <label
                        key={act.key}
                        onClick={() => togglePermissionKey(act.key)}
                        className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                          isChecked ? 'bg-purple-50 border-purple-500 text-purple-950 font-bold' : 'bg-slate-50 border-slate-200 text-[#64748B]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
                        />
                        <div className="truncate">
                          <p className="text-xs">{act.label}</p>
                          <span className="text-[9px] text-[#64748B] block font-mono">{act.key}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-gradient-to-r from-[#D99A1C] to-[#F5B025] hover:scale-[1.01] text-black font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md uppercase tracking-wider"
                >
                  {isSaving ? 'Saving to Database...' : 'Save Role & Permissions ✓'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
