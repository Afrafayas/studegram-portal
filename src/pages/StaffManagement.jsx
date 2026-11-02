import ListFilterTabs from '../components/ListFilterTabs';
import useServerList from '../hooks/useServerList';
import ListToolbar, { ListPagination } from '../components/ListToolbar';
import ActionMenu from '../components/ActionMenu';
import SearchableSelect from '../components/SearchableSelect';
import ValidatedInput from '../components/ValidatedInput';
import { getDisplayId } from '../utils/displayId';
import StaffDetailPage from '../components/StaffDetailPage';
import { ActionButton, ActionForm } from '../components/ActionControls';
import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useToast } from '../context/ToastContext';

export default function StaffManagement({ partnerData }) {
  const toast = useToast();
  const list = useServerList('/partners/staff');
  const [staffList, setStaffList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [staffLoadError, setStaffLoadError] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState(() => new URLSearchParams(window.location.search).get('portalStaffId'));
  const selectedStaff = staffList.find(staff => String(staff._id || staff.id) === selectedStaffId);

  useEffect(() => {
    const syncSelection = () => setSelectedStaffId(new URLSearchParams(window.location.search).get('portalStaffId'));
    window.addEventListener('popstate', syncSelection);
    return () => window.removeEventListener('popstate', syncSelection);
  }, []);

  const openStaffDetails = (staff) => {
    const id = String(staff._id || staff.id);
    const url = new URL(window.location.href);
    url.searchParams.set('portalStaffId', id);
    window.history.pushState({ ...window.history.state, portalStaffDetail: true }, '', url);
    setSelectedStaffId(id);
    window.scrollTo({ top: 0 });
  };

  const closeStaffDetails = () => {
    if (window.history.state?.portalStaffDetail) {
      window.history.back();
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete('portalStaffId');
      window.history.replaceState(window.history.state, '', url);
      setSelectedStaffId(null);
    }
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Staff',
    password: '',
    status: 'Active'
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const fetchStaffMembers = async () => {
    list.refresh();
    setIsLoading(true);
    setStaffLoadError('');
    try {
      const res = await API.get('/partners/staff');
      if (res.data?.success) {
        setStaffList(res.data.data || []);
      } else {
        throw new Error(res.data?.message || 'Unable to load staff members.');
      }
    } catch (err) {
      setStaffLoadError(err.response?.data?.message || err.message || 'Unable to load staff members.');
      console.error('Failed to load staff list:', err);
      toast.error(err.response?.data?.message || 'Error fetching staff members');
    } finally {
      setIsLoading(false);
    }
  };

  const [availableRoles, setAvailableRoles] = useState([]);

  const fetchAgentRoles = async () => {
    try {
      const res = await API.get('/roles');
      if (res.data?.success && Array.isArray(res.data.data)) {
        const agentRoles = res.data.data.filter(r => r.portalType === 'Agent');
        if (Array.isArray(agentRoles)) {
          const mapped = agentRoles.map(r => ({
            id: r.name,
            title: r.displayName || r.name,
            desc: r.description || 'Configured agency operational role',
            permissions: r.permissions || []
          }));
          setAvailableRoles(mapped);
        }
      }
    } catch (err) {
      console.warn('Could not fetch custom agent roles:', err.message);
    }
  };

  useEffect(() => {
    fetchStaffMembers();
    fetchAgentRoles();
  }, []);

  const [showPendingModal, setShowPendingModal] = useState(false);

  const openAddModal = () => {
    if (partnerData?.status === 'Pending') {
      setShowPendingModal(true);
      return;
    }
    setEditingStaff(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'Staff',
      password: '',
      status: 'Active'
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (staff) => {
    if (partnerData?.status === 'Pending') {
      setShowPendingModal(true);
      return;
    }
    setEditingStaff(staff);
    setFormData({
      name: staff.name || '',
      email: staff.email || '',
      phone: staff.phone || '',
      role: staff.role || 'Staff',
      password: '', // leave empty unless updating password
      status: staff.status || 'Active'
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email address format';
    }
    if (!editingStaff && !formData.password) {
      errors.password = 'Password is required for new staff account';
    } else if (formData.password && formData.password.length < 4) {
      errors.password = 'Password must be at least 4 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      if (editingStaff) {
        // Update existing staff
        const updatePayload = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          status: formData.status
        };
        if (formData.password && formData.password.trim()) {
          updatePayload.password = formData.password.trim();
        }

        const res = await API.put(`/partners/staff/${editingStaff._id}`, updatePayload);
        if (res.data?.success) {
          toast.success(
            formData.password
              ? `Staff member '${formData.name}' updated! New login credentials emailed to ${formData.email}.`
              : `Staff member '${formData.name}' updated successfully!`
          );
          setIsModalOpen(false);
          fetchStaffMembers();
        }
      } else {
        // Create new staff
        const res = await API.post('/partners/staff', formData);
        if (res.data?.success) {
          toast.success(`New staff member '${formData.name}' created! Login credentials emailed to ${formData.email}.`);
          setIsModalOpen(false);
          fetchStaffMembers();
        }
      }
    } catch (err) {
      console.error('Save staff error:', err);
      toast.error(err.response?.data?.message || 'Failed to save staff member');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (staff) => {
    const newStatus = staff.status === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await API.put(`/partners/staff/${staff._id}`, { status: newStatus });
      if (res.data?.success) {
        toast.success(`Account status for ${staff.name} changed to ${newStatus}`);
        fetchStaffMembers();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDeleteStaff = async (staffId) => {
    try {
      const res = await API.delete(`/partners/staff/${staffId}`);
      if (res.data?.success) {
        toast.success('Staff member removed successfully');
        setDeleteConfirmId(null);
        fetchStaffMembers();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete staff member');
    }
  };

  const filteredStaff = list.records;

  // Role Badge Styling Helper
  const getRoleBadge = (role) => {
    switch (role) {
      case 'AgencyAdmin':
        return {
          label: 'Agency Admin',
          bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20'
        };
      case 'Manager':
        return {
          label: 'Manager',
          bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
        };
      case 'Counselor':
        return {
          label: 'Counselor',
          bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
        };
      default:
        return {
          label: 'Staff Executive',
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        };
    }
  };

  return (
    <div className="workspace-page flex-1 p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {selectedStaffId ? (
        <StaffDetailPage key={selectedStaffId} staff={selectedStaff} isLoading={isLoading} loadError={staffLoadError} onReload={fetchStaffMembers} onBack={closeStaffDetails} onEdit={openEditModal} onToggleStatus={handleToggleStatus} partnerData={partnerData} roles={availableRoles} />
      ) : (
      <>
      {/* Top Banner & Action */}
      <div className="workspace-panel flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">
              Agency Staff & Team Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-50 text-[#D99A1C] border border-amber-200">
              Role-Based Access
            </span>
          </div>
          <p className="text-xs text-[#64748B] font-medium">
            Manage your agency staff accounts, assign operational roles, and manage secure portal access.
          </p>
        </div>
        <ActionButton
          onClick={openAddModal}
          className="bg-gradient-to-r from-[#D99A1C] to-[#F5B025] hover:scale-[1.02] text-black font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Add New Staff
        </ActionButton>
      </div>

      <ListToolbar list={list} label="staff" fields={[{"key":"role","label":"Roles"},{"key":"status","label":"Statuses"}]} />

      {/* Staff Table */}
      <div className="workspace-panel workspace-list-frame bg-white border border-[#E2E8F0] border-t-4 border-t-[#D99A1C] rounded-2xl shadow-sm overflow-hidden">
        {/* Scoping Tabs */}
        <ListFilterTabs list={list} endpoint="/partners/staff" field="status" options={[{value:'All',label:'All staff'},{value:'Active',label:'Active'},{value:'Inactive',label:'Inactive'}]} />
        {list.loading ? (
          <div className="p-12 text-center text-[#64748B] space-y-3">
            <svg className="animate-spin h-8 w-8 text-[#D99A1C] mx-auto" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-xs font-semibold">Loading agency staff members...</p>
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="p-12 text-center text-[#64748B] space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-sm font-bold text-[#0F172A]">No staff members found</p>
            <p className="text-xs text-[#64748B]">Click "Add New Staff" above to create your team's logins.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="workspace-table w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-[#E2E8F0] text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">
                  <th className="py-3.5 px-6">Staff Member</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Assigned Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-[#0F172A]">
                {filteredStaff.map((staff) => {
                  const badge = getRoleBadge(staff.role);
                  const initials = staff.name
                    ? staff.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                    : 'ST';

                  return (
                    <tr tabIndex={0} onKeyDown={event => { if (event.target === event.currentTarget && event.key === "Enter") { event.preventDefault(); event.currentTarget.click(); } }} key={staff._id} onClick={() => openStaffDetails(staff)} className="hover:bg-amber-50/40 transition-colors cursor-pointer group">
                      {/* Name & Avatar */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs border border-slate-700">
                            {initials}
                          </div>
                          <div>
                            <p className="font-bold text-xs text-[#0F172A]">{staff.name}</p>
                            <p className="text-[10px] text-[#64748B]">ID: {getDisplayId(staff)}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <p className="text-xs font-semibold">{staff.email}</p>
                          <p className="text-[11px] text-[#64748B]">{staff.phone || 'No phone'}</p>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <ActionButton
                          onClick={() => handleToggleStatus(staff)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer border ${
                            staff.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          }`}
                          title="Click to toggle status"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${staff.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                          {staff.status}
                        </ActionButton>
                      </td>

                      {/* Created Date */}
                      <td className="py-4 px-4 text-[11px] text-[#64748B]">
                        {new Date(staff.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>

                      {/* ActionMenu */}
                      <td className="py-4 px-6 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                        <ActionMenu
                          items={[
                            {
                              label: 'View Staff Details',
                              onClick: () => openStaffDetails(staff)
                            },
                            {
                              label: 'Edit Staff Member',
                              onClick: () => openEditModal(staff)
                            },
                            {
                              label: staff.status === 'Active' ? 'Deactivate Account' : 'Activate Account',
                              onClick: () => handleToggleStatus(staff)
                            },
                            {
                              label: 'Delete Staff Account',
                              variant: 'danger',
                              onClick: () => handleDeleteStaff(staff._id)
                            }
                          ]}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      </>
      )}

      <ListPagination list={list} />
      {/* Add / Edit Staff Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[9999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="workspace-list-frame bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col my-auto">
            {/* Modal Header */}
            <div className="bg-white px-6 py-4 text-slate-900 flex items-center justify-between border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#D99A1C] text-black flex items-center justify-center font-bold">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold">
                    {editingStaff ? 'Edit Staff Account' : 'Add New Staff Member'}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    {editingStaff ? `Modifying settings for ${editingStaff.name}` : 'Create login credentials and set operational permissions'}
                  </p>
                </div>
              </div>
              <ActionButton
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </ActionButton>
            </div>

            {/* Form Body */}
            <ActionForm onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 min-h-0">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Connor"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-none transition-all ${
                    formErrors.name ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-200 focus:border-[#D99A1C] focus:bg-white'
                  }`}
                />
                {formErrors.name && <p className="text-[10px] text-rose-500 font-bold">{formErrors.name}</p>}
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="sarah@agency.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-none transition-all ${
                      formErrors.email ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-200 focus:border-[#D99A1C] focus:bg-white'
                    }`}
                  />
                  {formErrors.email && <p className="text-[10px] text-rose-500 font-bold">{formErrors.email}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">
                    Phone Number
                  </label>
                  <ValidatedInput validationKind="phone"
                    type="text"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#D99A1C] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">
                  Assign Staff Role <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {availableRoles.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => setFormData({ ...formData, role: r.id })}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        formData.role === r.id
                          ? 'border-[#D99A1C] bg-amber-50/50 ring-1 ring-[#D99A1C]'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#0F172A]">{r.title}</span>
                        {formData.role === r.id && (
                          <span className="w-2 h-2 rounded-full bg-[#D99A1C]"></span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#64748B] mt-0.5 line-clamp-2">{r.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">
                    Password {editingStaff ? '(Leave blank to keep unchanged)' : <span className="text-rose-500">*</span>}
                  </label>
                  <ActionButton
                    type="button"
                    onClick={() => {
                      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
                      let pass = '';
                      for (let i = 0; i < 10; i++) {
                        pass += chars.charAt(Math.floor(Math.random() * chars.length));
                      }
                      setFormData({ ...formData, password: pass });
                      setShowPassword(true);
                    }}
                    className="text-[10px] text-[#D99A1C] hover:underline font-extrabold cursor-pointer"
                  >
                    🎲 Auto Generate
                  </ActionButton>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={editingStaff ? '•••••••• (leave blank to keep unchanged)' : 'Set account password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-none transition-all ${
                      formErrors.password ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-200 focus:border-[#D99A1C] focus:bg-white'
                    }`}
                  />
                  <ActionButton
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[10px] text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </ActionButton>
                </div>
                {formErrors.password && <p className="text-[10px] text-rose-500 font-bold">{formErrors.password}</p>}
                <p className="text-[10px] text-slate-400 font-medium">
                  ✉️ An email with login credentials will be automatically sent to the staff member's registered email address upon saving.
                </p>
              </div>

              {/* Status Select */}
              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">
                  Account Access Status
                </label>
                <SearchableSelect
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#D99A1C] focus:bg-white transition-all font-semibold"
                >
                  <option value="Active">Active (Allowed to sign in)</option>
                  <option value="Inactive">Inactive (Sign in disabled)</option>
                </SearchableSelect>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <ActionButton
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#64748B] hover:bg-slate-100 transition-colors"
                  disabled={isSaving}
                >
                  Cancel
                </ActionButton>
                <ActionButton
                  type="submit"
                  disabled={isSaving}
                  className="bg-gradient-to-r from-[#D99A1C] to-[#F5B025] hover:scale-[1.02] active:scale-95 text-black font-extrabold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 text-black" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving Account...
                    </>
                  ) : editingStaff ? (
                    'Update Staff Account'
                  ) : (
                    'Create Staff Account'
                  )}
                </ActionButton>
              </div>
            </ActionForm>
          </div>
        </div>,
        document.body
      )}
      {/* Verification Pending Modal */}
      {showPendingModal && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-200 select-none overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-center max-h-[90vh] overflow-y-auto my-auto">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-amber-50">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border bg-amber-100 text-amber-800 border-amber-200">
                Registration Under Review
              </span>
              <h3 className="text-xl font-bold text-[#0F172A] pt-1">
                Verification Pending
              </h3>
            </div>

            <p className="text-xs text-[#64748B] leading-relaxed font-medium">
              Your agency registration is currently under review by the Unigather Admin team. Please wait for verification and approval before creating staff accounts.
            </p>

            <ActionButton
              onClick={() => setShowPendingModal(false)}
              className="w-full bg-[#0F172A] hover:bg-black text-white font-bold py-2.5 rounded-xl text-xs transition-all uppercase tracking-wider"
            >
              Close Window
            </ActionButton>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}