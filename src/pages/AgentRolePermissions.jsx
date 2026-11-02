import ListRecordView from '../components/ListRecordView';
import ListFilterTabs from '../components/ListFilterTabs';
import useServerList from '../hooks/useServerList';
import ListToolbar, { ListPagination } from '../components/ListToolbar';
import ActionMenu from '../components/ActionMenu';
import { ActionButton, ActionForm } from '../components/ActionControls';
import { createPortal } from 'react-dom';
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

export default function AgentRolePermissions({ partnerData }) {
  const [listRecord, setListRecord] = React.useState(null);

  const toast = useToast();
  const list = useServerList('/roles', { fixedFilters: { portalType: 'Agent' } });
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('All');

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
    list.refresh();
    setIsLoading(true);
    try {
      const res = await API.get('/roles');
      if (res.data?.success && Array.isArray(res.data.data)) {
        const agentRoles = res.data.data.filter(r => r.portalType === 'Agent');
        setRoles(agentRoles);
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'All') {
      list.setFilter('isPreset', undefined);
    } else if (tab === 'Preset') {
      list.setFilter('isPreset', 'true');
    } else if (tab === 'Custom') {
      list.setFilter('isPreset', 'false');
    }
    list.setPage(1);
  };

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
    if (!roleForm.displayName.trim()) {
      toast.error('Role name is required.');
      return;
    }
    setIsSaving(true);
    try {
      if (editingRole && editingRole._id) {
        const res = await API.put(`/roles/${editingRole._id}`, roleForm);
        if (res.data?.success) {
          toast.success('Agent role updated successfully');
          setIsModalOpen(false);
          fetchAgentRoles();
        } else {
          throw new Error(res.data?.message || 'Failed to update role');
        }
      } else {
        const generatedKey = roleForm.displayName.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const payload = {
          ...roleForm,
          name: roleForm.name || generatedKey
        };
        const res = await API.post('/roles', payload);
        if (res.data?.success) {
          toast.success('New agency role created successfully');
          setIsModalOpen(false);
          fetchAgentRoles();
        } else {
          throw new Error(res.data?.message || 'Failed to create role');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Operation failed');
    } finally {
      setIsSaving(false);
    }
  };

  const totalRolesCount = roles.length;
  const presetRolesCount = roles.filter(r => r.isPreset).length;
  const customRolesCount = roles.filter(r => !r.isPreset).length;

  return (
    listRecord ? <div className="workspace-page flex-1 p-4 sm:p-6"><ListRecordView record={listRecord} title={listRecord.displayName || listRecord.title || listRecord.name || listRecord.university || 'Record details'} onBack={() => setListRecord(null)} /></div> : (<div className="workspace-page flex-1 p-4 sm:p-6 space-y-6 bg-[#F0F2F5] select-text">
      {/* Top Banner */}
      <div className="workspace-panel flex flex-wrap gap-3 justify-between items-center bg-white border border-[#E2E8F0] border-t-4 border-t-[#D99A1C] p-6 rounded-2xl shadow-xs">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Agency Roles & Permissions Checklist
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage your agency staff operational roles, sidebar item checklists, and feature access clearance.
          </p>
        </div>
        <ActionButton
          onClick={openCreateModal}
          className="bg-[#D99A1C] hover:bg-[#F5B025] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Create Agency Role</span>
        </ActionButton>
      </div>

      {/* Table Frame */}
      <div className="workspace-panel workspace-list-frame bg-white border border-[#E2E8F0] border-t-4 border-t-[#D99A1C] rounded-2xl shadow-xs overflow-hidden">
        {/* Scoping Tabs */}
        <ListFilterTabs list={list} endpoint="/roles" field="isPreset" fixedFilters={{portalType:'Agent'}} options={[{value:'All',label:'All roles'},{value:'true',label:'Preset roles'},{value:'false',label:'Custom roles'}]} />

        {/* ListToolbar */}
        <ListToolbar
          list={list}
          label="roles"
          fields={[
            {
              key: 'isPreset',
              label: 'Role Types',
              options: [
                { value: 'true', label: 'Preset' },
                { value: 'false', label: 'Custom' }
              ]
            }
          ]}
        />

        

        <div className="overflow-x-auto">
          {list.records.length > 0 ? (
            <table className="workspace-table w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-[#E2E8F0]">
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Role Title</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Role Type</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Assigned Permissions</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {list.records.map((role) => (
                  <tr tabIndex={0} onKeyDown={event => { if (event.target === event.currentTarget && event.key === "Enter") { event.preventDefault(); event.currentTarget.click(); } }}
                    key={role._id || role.name}
                    onClick={() => setListRecord(role)}
                    className="hover:bg-amber-50/40 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <p className="font-black text-slate-900 text-xs group-hover:text-[#D99A1C] transition-colors">
                        {role.displayName || role.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold">{role.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      {role.isPreset ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border bg-slate-100 text-slate-700 border-slate-200">
                          Preset Role
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border bg-purple-50 text-purple-700 border-purple-200">
                          Custom Role
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 flex-wrap max-w-sm">
                        <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-black px-2 py-0.5 rounded-full">
                          {role.permissions?.length || 0} permissions
                        </span>
                        {role.permissions?.slice(0, 2).map((pKey) => (
                          <span key={pKey} className="bg-slate-100 text-slate-600 text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {pKey}
                          </span>
                        ))}
                        {(role.permissions?.length || 0) > 2 && (
                          <span className="text-[9px] text-slate-400">+{role.permissions.length - 2} more</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium text-[11px] max-w-xs truncate">
                      {role.description || 'Configured agency staff access level.'}
                    </td>
                    <td className="px-6 py-4 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                      <ActionMenu
                        items={[
                          {
                            label: 'Edit Permissions Checklist',
                            onClick: () => openEditModal(role)
                          }
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400 font-semibold">
              No matching agency roles found.
            </div>
          )}
        </div>

        <ListPagination list={list} />
      </div>

      {/* MODAL */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs select-none p-4 overflow-y-auto">
          <div className="workspace-list-frame bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto">
            <div className="flex justify-between items-center p-4 bg-white text-slate-900 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  {editingRole ? `Edit Agency Role — ${editingRole.displayName}` : 'Create Agency Security Role'}
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold">Checklist sidebar navigation and operational rights</p>
              </div>
              <ActionButton onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-900 font-bold text-sm">
                ✕
              </ActionButton>
            </div>

            <ActionForm onSubmit={handleSaveRole} className="p-6 space-y-6 overflow-y-auto flex-1">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-1">
                  Role Display Name *
                </label>
                <input
                  type="text"
                  required
                  value={roleForm.displayName}
                  onChange={(e) => setRoleForm({ ...roleForm, displayName: e.target.value })}
                  placeholder="e.g. Senior Branch Counselor"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#D99A1C]"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={roleForm.description}
                  onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                  placeholder="Explain the scope and responsibilities of this agency staff role..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#D99A1C]"
                />
              </div>

              {/* Sidebar Checklist */}
              <div className="space-y-3">
                <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider block">
                  1. Sidebar Navigation Checklist
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {AGENT_SIDEBAR_ITEMS.map((item) => {
                    const isChecked = roleForm.permissions.includes(item.key);
                    return (
                      <label key={item.key} className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700 select-none p-1.5 hover:bg-white rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePermissionKey(item.key)}
                          className="w-4 h-4 text-[#D99A1C] rounded border-slate-300 focus:ring-[#D99A1C]"
                        />
                        <span>{item.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Features Checklist */}
              <div className="space-y-3">
                <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider block">
                  2. Operations & Feature Actions Checklist
                </span>
                <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {AGENT_FEATURE_ACTIONS.map((item) => {
                    const isChecked = roleForm.permissions.includes(item.key);
                    return (
                      <label key={item.key} className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700 select-none p-1.5 hover:bg-white rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePermissionKey(item.key)}
                          className="w-4 h-4 text-[#D99A1C] rounded border-slate-300 focus:ring-[#D99A1C]"
                        />
                        <span>{item.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <ActionButton
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </ActionButton>
                <ActionButton
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#D99A1C] hover:bg-[#F5B025] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md"
                >
                  {isSaving ? 'Saving...' : 'Save Role Permissions'}
                </ActionButton>
              </div>
            </ActionForm>
          </div>
        </div>,
        document.body
      )}
    </div>)
  );
}
